import { Router } from "express";
import { authenRouter } from "./authenRouter";
import { trackRouter } from "./trackRouter";
import { playlistRouter } from "./playlistRouter";

const apiRouter = Router();

apiRouter.use("/auth", authenRouter);
apiRouter.use("/tracks", trackRouter);
apiRouter.use("/playlists", playlistRouter);

export { apiRouter };
