import express from "express";
import cors from "cors";

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

  return app;
};
