import { HttpException } from "@nestjs/common";
import { NextFunction, Request, RequestHandler, Response } from "express";
import DataStoredInToken from "interfaces/dataStoredInToken";
import RequestWithUser from "interfaces/requestWithUser.interface";
import * as jwt from "jsonwebtoken";
import userModel from "../models/User/model";

async function authMiddleware(
  request: RequestWithUser,
  response: Response,
  next: NextFunction
) {
  const cookies = request.cookies["access_token"];
  const secret = process.env.JWT_SECRET as string;

  if (cookies) {
    try {
      const verificationResponse = jwt.verify(
        cookies,
        secret
      ) as unknown as DataStoredInToken;
      const id = verificationResponse._id;

      const user = await userModel.findById(id);

      if (user) {
        request.user = user;
        next();
      } else {
        next(new HttpException("Wrong authentication token", 401));
      }
    } catch (error) {
      next(new HttpException("Wrong authentication token", 401));
    }
  } else {
    next(new HttpException("Authentication token missing", 401));
  }
}
export { authMiddleware };
