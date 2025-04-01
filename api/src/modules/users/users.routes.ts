import { Router } from "express";
import { createUserHandler } from "./users.controller.js";
import { validateSchema } from "../../middlewares/validateSchema.js";
import { insertUserSchema } from "./users.schema.js";

export const usersRoutes = Router();

usersRoutes.post("/ ", validateSchema(insertUserSchema), createUserHandler);
