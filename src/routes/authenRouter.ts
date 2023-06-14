import { AuthenticationController } from "../authentication/controller";
import { Router } from "express";
import { validationMiddleware } from "../middlewares";
import { CreateUserDto, LoginUserDto } from "../models/User/dto";
import { authMiddleware } from "../middlewares";

const authenRouter = Router();

const authenController = new AuthenticationController();

authenRouter.get("/me", authMiddleware, authenController.me);

authenRouter.post(
  "/register",
  validationMiddleware(CreateUserDto),
  authenController.registration
);

authenRouter.post(
  "/login",
  validationMiddleware(LoginUserDto),
  authenController.logIn
);

authenRouter.post("/logout", authenController.logOut);

export { authenRouter };
