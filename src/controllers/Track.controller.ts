import { NextFunction, Request, Response } from "express";
import { TrackService } from "../services/Track.service";

class TrackController {
  public trackService = new TrackService();

  async store(req: Request, res: Response) {
    console.log(JSON.parse(JSON.stringify(req.body.file)));
    console.log({ file: req.body.file });
    console.log(JSON.stringify(req.body.file));

    try {
      res.send({
        body: JSON.stringify(req.body.file),
        message: "Successfully uploaded",
      });
    } catch (error) {
      console.log(`Error ${error}`);
    }
  }

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
}

export { TrackController };
