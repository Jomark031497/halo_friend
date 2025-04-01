export class AppError extends Error {
  statusCode: number;
  errors: Record<string, unknown>;

  constructor(
    statusCode: number = 500,
    message: string,
    errors: Record<string, unknown> = {},
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    if (statusCode < 100 || statusCode > 599) {
      throw new Error(`Invalid status code: ${statusCode}`);
    }

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}
