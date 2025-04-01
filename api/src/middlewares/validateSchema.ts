import type { NextFunction, Request, Response } from "express";
import { type AnyZodObject, ZodError } from "zod";

export const validateSchema =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const mappedErrors = error.issues.reduce((prev, curr) => {
          const key = curr.path[0] as string;
          const value = curr.message;

          return { ...prev, [key]: value };
        }, {});

        res.status(400).json({
          message: "Validation Error",
          errors: mappedErrors,
        });
      }

      res.status(400).json(error);
    }
  };
