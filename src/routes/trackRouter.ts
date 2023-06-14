import { authMiddleware } from "../middlewares";
import { TrackController } from "../controllers/Track.controller";
import { Router } from "express";
import multer from "multer";

const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
});

const upload = multer({ storage });

const trackRouter = Router();

const trackController = new TrackController();

trackRouter.get("/", trackController.getAllTracks);
trackRouter.get("/detail/:slug", trackController.getTrackBySlug);
trackRouter
  .all("/*", authMiddleware)
  .post("/uploaded", upload.single("file"), trackController.store)
  .delete("/delete/:slug", trackController.delete);

//edit a track
export { trackRouter };
