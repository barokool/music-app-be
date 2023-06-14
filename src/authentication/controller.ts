import { NextFunction, Request, Response } from "express";
import { CreateUserDto, LoginUserDto } from "models/User/dto";
import userModel from "models/User/model";
import { AuthenticationService } from "./service";
import * as bcrypt from "bcrypt";
import { HttpException } from "@nestjs/common";
import RequestWithUser from "interfaces/requestWithUser.interface";
import Cookies from "universal-cookie";

class AuthenticationController {
  public authenticationService = new AuthenticationService();

  public registration = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const userData: CreateUserDto = request.body;
    try {
      const { tokenData, user } = await this.authenticationService.register(
        userData
      );

      response.send({
        tokenData,
        user,
      });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const logInData: LoginUserDto = request.body;
    const userData = await this.authenticationService.login(logInData);

    if ("tokenData" in userData && userData.user !== null) {
      response.send({
        tokenData: userData.tokenData,
        user: userData.user,
      });
    } else {
      next(new HttpException(userData.message, 401));
    }
  };

  public logOut = (request: Request, response: Response) => {
    response.setHeader("Set-Cookie", ["Authorization=;Max-age=0"]);
    response.send(200);
  };

  public me = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const user = request.user;
      if (user) response.send(user);
    } catch (error) {
      next(error);
    }
  };
}

export { AuthenticationController };
