import { HttpException } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { CreatePlaylistDto } from "../models/Playlist/dto";
import { PlaylistService } from "../services/Playlist.service";
import RequestWithUser from "interfaces/requestWithUser.interface";
import { User } from "models/User/interface";

class PlaylistController {
  public playlistService = new PlaylistService();

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
}

export { PlaylistController };
