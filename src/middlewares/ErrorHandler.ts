import { NextFunction, Request, Response } from "express";

const sendErrorDev = (err: any, res: any) => {
  res.status(err.statusCode || 500).json({
    error: err,
    errors: err.errors,
    message: err.message,
    stack: err.stack,
  });
};

export const errorHandler = (
  error: any,
  request: Request,
  response: Response,
  next: NextFunction
) => {
  error.statusCode = error.statusCode;
  error.errors = error.errors || null;
  sendErrorDev(error, response);
};
