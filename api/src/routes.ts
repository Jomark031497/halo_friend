import { Express } from "express";
import { usersRoutes } from "./modules/users/users.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";

export const initializeRoutes = (app: Express) => {
  app.use("/api/healthcheck", (_req, res) => {
    res.status(200).json({
      status: "OK",
    });
  });

  app.use("/api/users", usersRoutes);
  app.use("/api/auth", authRoutes);
};
