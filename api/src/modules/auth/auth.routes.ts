import { Router } from "express";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "../users/users.schema.js";
import * as controller from "./auth.controller.js";
import { requireAuth } from "../../middlewares/requireAuth.js";

export const authRoutes = Router();

// regular username/password routes
authRoutes.post(
  "/sign-up",
  validateSchema(insertUserSchema),
  controller.signUpUserHandler
);
authRoutes.post(
  "/login",
  validateSchema(insertUserSchema.pick({ username: true, password: true })),
  controller.loginUserHandler
);
authRoutes.get("/user", requireAuth, controller.getAuthenticatedUserHandler);
authRoutes.delete("/logout", requireAuth, controller.logoutUserHandler);

// Discord OAuth routes
authRoutes.get("/login/discord", controller.initiateDiscordLoginHandler);
authRoutes.get("/login/discord/callback", controller.discordCallbackHandler);
