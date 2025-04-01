import type { Request, Response, NextFunction } from "express";
import * as authService from "./auth.service.js";
import { generateState, OAuth2RequestError } from "arctic";
import { serializeCookie, parseCookies } from "oslo/cookie";
import { getUser, createUser } from "../users/users.service.js";
import type { DiscordUser } from "./auth.utils.js";
import {
  deleteSessionTokenCookie,
  discord,
  createSessionAndSetCookie,
} from "./auth.utils.js";
import { AppError } from "../../utils/error.js";
import { envs } from "../../config/envs.js";

export const loginUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.loginUser(req.body);
    await createSessionAndSetCookie(res, user.id);
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const signUpUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.signUpUser(req.body);
    await createSessionAndSetCookie(res, user.id);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const getAuthenticatedUserHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await authService.getAuthenticatedUser(res.locals.user.id);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const logoutUserHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    deleteSessionTokenCookie(res);
    res.status(200).json({ message: "logout success" });
  } catch (error) {
    next(error);
  }
};

export const initiateDiscordLoginHandler = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const state = generateState();
    const url = discord.createAuthorizationURL(state, null, [
      "identify",
      "email",
    ]);

    res
      .appendHeader(
        "Set-Cookie",
        serializeCookie("discord_oauth_state", state, {
          secure: process.env.NODE_ENV === "production",
          path: "/",
          httpOnly: true,
          maxAge: 60 * 10,
          sameSite: "lax",
        })
      )
      .json({ url: url.toString() });
  } catch (error) {
    next(error);
  }
};

export const discordCallbackHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { code, state } = req.query;
    const storedState = parseCookies(req.headers.cookie ?? "").get(
      "discord_oauth_state"
    );

    if (!code || !state || !storedState || state !== storedState) {
      res.status(400).json({ error: "Invalid OAuth state or code" });
      return;
    }

    const tokens = await discord.validateAuthorizationCode(
      code.toString(),
      null
    );
    const accessToken = tokens.accessToken();

    const discordUserResponse = await fetch(
      "https://discord.com/api/users/@me",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    if (!discordUserResponse.ok)
      throw new AppError(400, "Failed to fetch Discord user");

    const discordUser = (await discordUserResponse.json()) as DiscordUser;
    const existingUser = await getUser("discordId", discordUser.id);

    if (existingUser) {
      await createSessionAndSetCookie(res, existingUser.id);
      res.status(200).redirect(envs.CLIENT_URL);
    }

    const createdUser = await createUser({
      discordId: discordUser.id,
      username: discordUser.username,
      email: discordUser.email,
    });

    await createSessionAndSetCookie(res, createdUser.id);

    res.redirect(envs.CLIENT_URL);
  } catch (error) {
    if (
      error instanceof OAuth2RequestError &&
      error.message === "bad_verification_code"
    ) {
      res.status(400).json({ error: "Invalid verification code" });
    }
    next(error);
  }
};
