import { Request, Response, NextFunction } from "express";
import { createUser } from "./users.service.js";

export const createUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = await createUser(req.body);
    res.status(200).json(query);
  } catch (error) {
    return next(error);
  }
};
