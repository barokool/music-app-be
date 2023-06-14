import DataStoredInToken from "interfaces/dataStoredInToken";
import TokenData from "interfaces/tokenData.interface";
import { User } from "../models/User/interface";
import UserModel from "../models/User/model";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { HttpException } from "@nestjs/common";
import { CreateUserDto, LoginUserDto } from "models/User/dto";

class AuthenticationService {
  public userModel = UserModel;

  public async register(userData: CreateUserDto) {
    const userFound = await this.userModel.findOne({ email: userData.email });
    if (userFound) throw new HttpException("User already exists", 400);

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await this.userModel.create({
      ...userData,
      password: hashedPassword,
    });

    const tokenData = this.createToken(user);

    return {
      tokenData,
      user,
    };
  }

  public async login(userData: LoginUserDto) {
    const user = await this.userModel.findOne({ email: userData.email });
    if (user) {
      const isPasswordMatching = await bcrypt.compare(
        userData.password,
        user.get("password", null, { getters: false })
      );
      if (isPasswordMatching) {
        const tokenData = this.createToken(user);
        return {
          tokenData,
          user,
          message: "success",
        };
      } else {
        return {
          message: "Wrong password or username",
          tokenData: "",
          user: null,
        };
      }
    } else {
      return {
        message: "Wrong password or username",
        tokenData: "",
        user: null,
      };
    }
  }

  public createToken(user: User): TokenData {
    const expiresIn = 24 * 60 * 60; // a day
    const secret = process.env.JWT_SECRET || "barogiasecret";
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id,
    };
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
    };
  }

  public createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
  }
}

export { AuthenticationService };
