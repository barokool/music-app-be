import { User } from "models/User/interface";
import { CreatePlaylistDto } from "../models/Playlist/dto";
import { Playlist } from "../models/Playlist/interface";
import PlaylistModel from "../models/Playlist/model";
import { FilterQuery } from "mongoose";
import unorm from "unorm";

class PlaylistService {
  private playlistModel = PlaylistModel;

  public async createPlaylist(user: User, dto: CreatePlaylistDto) {
    try {
      const playlist = await this.playlistModel.create({
        name: dto.name,
        author: user._id,
        tracks: [],
      });

      return playlist;
    } catch (error) {
      console.log(`Error creating playlist: ${error}`);
    }
  }

  public async getAllPlaylists(
    limit: number = 10,
    skip: number = 0,
    keyword?: string,
    options?: FilterQuery<Playlist>
  ) {
    if (keyword) {
      const normalizedKeyword = unorm
        .nfd(keyword)
        .replace(/[\u0300-\u036f]/g, "");

      options = {
        ...options,
        title: {
          $regex: normalizedKeyword,
          $options: "i",
        },
      };
    }

    const playlists = await this.playlistModel
      .find({ options })
      .populate("author")
      .limit(limit)
      .skip(skip);

    const length = await this.playlistModel.countDocuments(options);
    return {
      data: playlists,
      length,
    };
  }
}

export { PlaylistService };
