import express, { Express, NextFunction, Request, Response } from "express";
import { Logger } from "@nestjs/common";

export function loggerMiddleware(
  request: express.Request,
  response: express.Response,
  next: NextFunction
) {
  Logger.log(`${request.method} ${request.path}`);
  next();
}
