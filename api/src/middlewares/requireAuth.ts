import type { Request, Response, NextFunction } from "express";
import { parseCookies } from "oslo/cookie";
import {
  validateSessionToken,
  deleteSessionTokenCookie,
  setSessionTokenCookie,
} from "../modules/auth/auth.utils.js";

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = parseCookies(req.headers.cookie ?? "").get("session") ?? "";

  const { session, user } = await validateSessionToken(token);

  if (session === null) {
    deleteSessionTokenCookie(res);
    res.status(401).json({ message: "unauthorized" }).end();
    return;
  }

  setSessionTokenCookie(res, token, session.expiresAt);

  res.locals.session = session;
  res.locals.user = user;

  next();
};
