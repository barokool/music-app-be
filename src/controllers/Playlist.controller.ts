import { HttpException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CreatePlaylistDto } from "../models/Playlist/dto";
import { PlaylistService } from "../services/Playlist.service";
import RequestWithUser from "interfaces/requestWithUser.interface";
import { User } from "models/User/interface";
import { TrackService } from "../services/Track.service";
import PlaylistModel from "../models/Playlist/model";
import TrackModel from "../models/Track/model";
import mongoose from "mongoose";

class PlaylistController {
  public playlistService = new PlaylistService();
  public trackService = new TrackService();
  static playlistModel = PlaylistModel;
  static trackModel = TrackModel;

  public getAllPlaylists = async (
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    const limit = parseInt(request.query.limit as string) || 10;
    const skip = parseInt(request.query.skip as string) || 0;
    const keyword = (request.query.keyword as string) || "";

    try {
      const tracks = await this.playlistService.getAllPlaylists(
        limit,
        skip,
        keyword
      );
      response.send(tracks);
    } catch (error) {
      next(error);
    }
  };

  public createPlaylist = async (
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) => {
    try {
      const createDto: CreatePlaylistDto = request.body;
      const user = request.user as User;

      const playlist = await this.playlistService.createPlaylist(
        user,
        createDto
      );

      response.send(playlist);
    } catch (error) {
      console.log(`Error creating playlist controller: ${error}`);
      next(error);
    }
  };

  async updateTrackToPlaylist(
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) {
    try {
      const body = request.body;
      const id = request.params.slug as string;
      const trackSlug = body.slug;

      const track = await PlaylistController.trackModel
        .findOne({ slug: trackSlug })
        .populate("author");

      if (track) {
        const playlist =
          await PlaylistController.playlistModel.findByIdAndUpdate(id, {
            $push: {
              tracks: track._id,
            },
          });

        console.log(playlist);
        if (playlist) {
          response.send(playlist);
        } else next(new HttpException("Playlist not found", 404));
      } else next(new HttpException("Track not found", 404));
    } catch (error) {
      next(error);
    }
  }

  async deleteTrackOfPlaylist(
    request: RequestWithUser,
    response: Response,
    next: NextFunction
  ) {
    try {
      const body = request.body;
      const id = request.params.slug as string;
      const trackSlug = request.params.trackSlug as string;

      console.log(body);
      console.log(id);

      console.log(trackSlug);

      const track = await PlaylistController.trackModel
        .findOne({ slug: trackSlug })
        .populate("author");

      if (track) {
        const playlist =
          await PlaylistController.playlistModel.findByIdAndRemove(id, {
            $pull: {
              tracks: track._id,
            },
          });
        if (playlist) {
          response.send(playlist);
        } else next(new HttpException("Playlist not found", 404));
      } else next(new HttpException("Track not found", 404));
    } catch (error) {
      next(error);
    }
  }
}

export { PlaylistController };
