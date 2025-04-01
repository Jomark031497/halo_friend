import { eq } from "drizzle-orm";
import {
  encodeBase32LowerCaseNoPadding,
  encodeHexLowerCase,
} from "@oslojs/encoding";
import { sha256 } from "@oslojs/crypto/sha2";
import type { Response } from "express";
import { Discord } from "arctic";
import type { User } from "../users/users.schema.js";
import { users } from "../users/users.schema.js";
import { envs } from "../../config/envs.js";
import { db } from "../../db/index.js";
import { Session, sessionTable } from "./auth.schema.js";

export interface GitHubUser {
  id: number;
  login: string;
  email: string;
}

export interface DiscordUser {
  id: string;
  username: string;
  email: string;
}

export const discord = new Discord(
  envs.DISCORD_CLIENT_ID,
  envs.DISCORD_CLIENT_SECRET,
  `${envs.BASE_URL}/api/auth/login/discord/callback`
);

export async function createSessionAndSetCookie(
  res: Response,
  userId: User["id"]
) {
  const token = generateSessionToken();
  const session = await createSession(token, userId);
  setSessionTokenCookie(res, token, session.expiresAt);
  return { token, session };
}

export function setSessionTokenCookie(
  response: Response,
  token: string,
  expiresAt: Date
): void {
  response.cookie("session", token, {
    httpOnly: true,
    sameSite: "lax",
    expires: expiresAt,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function deleteSessionTokenCookie(response: Response): void {
  response.cookie("session", "", {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 0,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(
  token: string,
  userId: User["id"]
): Promise<Session> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const session: Session = {
    id: sessionId,
    userId,
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  };
  await db.insert(sessionTable).values(session);
  return session;
}

export async function validateSessionToken(
  token: string
): Promise<SessionValidationResult> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const result = await db
    .select({ user: users, session: sessionTable })
    .from(sessionTable)
    .innerJoin(users, eq(sessionTable.userId, users.id))
    .where(eq(sessionTable.id, sessionId));

  if (result.length < 1) return { session: null, user: null };

  const { user, session } = result[0] as SessionValidationResult;

  if (!session || !user) return { session: null, user: null };

  if (Date.now() >= session.expiresAt.getTime()) {
    await db.delete(sessionTable).where(eq(sessionTable.id, session.id));
    return { session: null, user: null };
  }
  if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
    session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
    await db
      .update(sessionTable)
      .set({
        expiresAt: session.expiresAt,
      })
      .where(eq(sessionTable.id, session.id));
  }
  return { session, user };
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await db.delete(sessionTable).where(eq(sessionTable.id, sessionId));
}

export type SessionValidationResult =
  | { session: Session; user: User }
  | { session: null; user: null };
