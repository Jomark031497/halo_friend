import { verify } from "argon2";
import { AppError } from "../../utils/error.js";
import type { NewUser, User } from "../users/users.schema.js";
import { createUser, getUser } from "../users/users.service.js";

export const signUpUser = async (payload: NewUser) => {
  const user = await createUser(payload);

  return user;
};

export const getAuthenticatedUser = async (id: User["id"]) => {
  return await getUser("id", id);
};

export const loginUser = async (
  payload: Pick<User, "username" | "password">
) => {
  const user = await getUser("username", payload.username);
  if (!user) throw new AppError(404, "invalid username/password");

  if (payload.password && user.password) {
    const isPasswordValid = await verify(user.password, payload.password);
    if (!isPasswordValid) throw new AppError(404, "invalid username/password");
  }

  return user;
};
