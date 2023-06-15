import { PlaylistController } from "../controllers/Playlist.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares";

const playlistRouter = Router();

const playlistController = new PlaylistController();

playlistRouter.get("/", playlistController.getAllPlaylists);
// playlistRouter.get("/detail/:slug", trackController.getTrackBySlug);
// post("/:slug/track")
playlistRouter.post(
  "/:slug/track",
  authMiddleware,
  playlistController.updateTrackToPlaylist
);
playlistRouter.post("/", authMiddleware, playlistController.createPlaylist);
//   .delete("/", trackController.delete);

//edit a track
export { playlistRouter };
