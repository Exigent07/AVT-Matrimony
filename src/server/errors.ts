export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
  }
}

export function getErrorMessage(error: unknown) {
  if (error instanceof AppError || error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}
