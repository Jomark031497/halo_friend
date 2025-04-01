import { Express } from "express";

export const initializeRoutes = (app: Express) => {
  app.use("/api/healthcheck", (_req, res) => {
    res.status(200).json({
      status: "OK",
    });
  });
};
