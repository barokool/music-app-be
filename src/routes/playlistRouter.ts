import { PlaylistController } from "../controllers/Playlist.controller";
import { Router } from "express";
import { authMiddleware } from "../middlewares";

const playlistRouter = Router();

const playlistController = new PlaylistController();

playlistRouter.get("/", playlistController.getAllPlaylists);
// playlistRouter.get("/detail/:slug", trackController.getTrackBySlug);
// post("/:slug/track")
playlistRouter.post("/", authMiddleware, playlistController.createPlaylist);
playlistRouter.post(
  "/:slug/track/:trackSlug",
  authMiddleware,
  playlistController.updateTrackToPlaylist
);
playlistRouter.delete("/:slug/track", playlistController.deleteTrackOfPlaylist);
//   .delete("/", trackController.delete);

//edit a track
export { playlistRouter };
