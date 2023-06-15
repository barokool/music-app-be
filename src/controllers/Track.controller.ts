import { NextFunction, Request, Response } from "express";
import { TrackService } from "../services/Track.service";
import path from "path";
import cloudinary from "cloudinary";
import RequestWithUser from "interfaces/requestWithUser.interface";
import { User } from "models/User/interface";

cloudinary.v2.config({
  cloud_name: "dwoa7xykg",
  api_key: "912685791654311",
  api_secret: "zb7wd75IwZHhZpBQSLxGBsYWlck",
});

class TrackController {
  public trackService = new TrackService();

  async store(req: Request, res: Response) {
    console.log(req.file);

    try {
      res.send({
        body: req.file,
        message: "Successfully uploaded",
      });
    } catch (error) {
      console.log(`Error ${error}`);
    }
  }

  static async uploadCloudinary(file: any) {
    const result = await cloudinary.v2.uploader.upload(file, {
      resource_type: "auto",
    });

    return result;
  }

  async upload(req: Request, res: Response, next: NextFunction) {
    try {
      const file = req.file?.path;

      const result = await TrackController.uploadCloudinary(file);
      res.json({ url: result.secure_url });
    } catch (error) {
      console.log(`Error upload image ${error}`);
      next(error);
    }
  }

  getFileAudio = async (req: Request, res: Response) => {
    const { filename } = req.params;
    const filePath = path.join(__dirname, "upload", filename);

    res.sendFile(filePath);
  };

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const track = await this.trackService.deleteTrackBySlug(req.params.slug);
      if (track) res.send({ message: "Successfully deleted" });
    } catch (error) {
      next(error);
    }
  }

  public getAllTracks = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const limit = parseInt(request.query.limit as string) || 10;
    const skip = parseInt(request.query.skip as string) || 0;
    const keyword = (request.query.keyword as string) || "";

    try {
      const tracks = await this.trackService.getAllTracks(limit, skip, keyword);
      response.send(tracks);
    } catch (error) {
      next(error);
    }
  };

  public getTrackBySlug = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const slug = request.params.slug as string;
      console.log({ slug });
      const track = await this.trackService.getTrackBySlug(slug);
      if (track) response.send(track);
    } catch (error) {
      next(error);
    }
  };

  public createTrack = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const track = await this.trackService.createTrack(
        request.user as User,
        request.body
      );
      if (track) response.send(track);
    } catch (error) {
      next(error);
    }
  };
}

export { TrackController };
