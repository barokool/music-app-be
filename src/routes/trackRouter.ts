import { authMiddleware } from "../middlewares";
import { TrackController } from "../controllers/Track.controller";
import { Router } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "src/upload");
  },
});

const upload = multer({ storage });

const trackRouter = Router();

const trackController = new TrackController();

trackRouter.get("/", trackController.getAllTracks);
trackRouter.get("/detail/:slug", trackController.getTrackBySlug);
trackRouter.get("/audio/:filename", trackController.getFileAudio);
trackRouter.post("/uploaded", upload.single("file"), trackController.upload);

trackRouter
  .all("/*", authMiddleware)
  .post("/", trackController.createTrack)
  .delete("/:slug", trackController.delete);

//edit a track
export { trackRouter };
