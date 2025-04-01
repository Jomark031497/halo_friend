import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { NewUser, User, users } from "./users.schema.js";
import { hash } from "argon2";
import { AppError } from "../../utils/error.js";

export const getUsers = async () => {
  return await db.select().from(users);
};

export const getUser = async (field: keyof User, value: string | number) => {
  const [user] = await db.select().from(users).where(eq(users[field], value));
  return user;
};

export const createUser = async (payload: NewUser) => {
  const errors: Record<string, unknown> = {};
  let hashedPassword: string | null = null;

  const emailExists = await getUser("email", payload.email);
  if (emailExists) errors.email = "email is already taken";

  const usernameExists = await getUser("email", payload.email);
  if (usernameExists) errors.username = "username is already taken";

  if (Object.keys(errors).length)
    throw new AppError(400, "create user failed", errors);

  if (payload.password) hashedPassword = await hash(payload.password);
  const [user] = await db
    .insert(users)
    .values({
      ...payload,
      password: hashedPassword,
    })
    .returning();

  if (!user) throw new AppError(400, "create user failed");

  return user;
};

export const updateUser = () => {};

export const deleteUser = () => {};
