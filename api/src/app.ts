import express from "express";
import cors from "cors";
import { initializeRoutes } from "./routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL,
    })
  );

  app.use(express.urlencoded());
  app.use(express.json());

  initializeRoutes(app);

  app.use(errorHandler);

  return app;
};
