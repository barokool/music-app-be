import mongoose from "mongoose";
import { Logger } from "@nestjs/common";
import express, { Express, NextFunction, Request, Response } from "express";
import cors from "cors";
// import { exampleRoutes } from "./routes";
import { errorHandler, loggerMiddleware } from "./middlewares";
import { apiRouter } from "./routes";
import cookieParser from "cookie-parser";

const app: Express = express();
app.use(loggerMiddleware);

const corsOptions = {
  origin: [
    "http://localhost:8000",
    "http://localhost:3000",
    process.env.FRONT_END_URL || "",
  ],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api", apiRouter);
app.use(errorHandler);

const start = async () => {
  if (!process.env.DB_URL) throw new Error("DB_URL must be defined");

  try {
    await Promise.all([mongoose.connect(process.env.DB_URL)]);
    Logger.log("Connected to DB");
  } catch (error) {
    Logger.error(`Error connecting to DB: ${error}`);
  }

  app.listen(process.env.PORT, () => {
    Logger.log(`Server is listening on port ${process.env.PORT}!`);
  });
};

start();
