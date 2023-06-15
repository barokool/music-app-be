import { createTrackDto } from "models/Track/dto";
import TrackModel from "../models/Track/model";
import { FilterQuery } from "mongoose";
import { Track } from "models/Track/interface";
import unorm from "unorm";
import { User } from "models/User/interface";

class TrackService {
  private trackModel = TrackModel;

  public async createTrack(user: User, dto: createTrackDto & { author: User }) {
    dto.author = user;
    const track = await this.trackModel.create(dto);
    return track;
  }

  public async getAllTracks(
    limit: number = 10,
    skip: number = 0,
    keyword?: string,
    options?: FilterQuery<Track>
  ) {
    let tracks = [] as any[];
    if (keyword) {
      const normalizedKeyword = unorm
        .nfd(keyword)
        .replace(/[\u0300-\u036f]/g, "");
      tracks = await this.trackModel
        .find({ title: { $regex: `${normalizedKeyword}`, $options: "i" } })
        .populate("author")
        .limit(limit)
        .skip(skip);
    } else {
      tracks = await this.trackModel
        .find()
        .populate("author")
        .limit(limit)
        .skip(skip);
    }

    const length = await this.trackModel.countDocuments(options);

    return {
      data: tracks,
      length,
    };
  }

  public async getTrackBySlug(slug: string) {
    const track = await this.trackModel.findOne({ slug }).populate("author");

    if (!track) {
      throw new Error("Track not found");
    }

    return track;
  }

  public async deleteTrackBySlug(slug: string) {
    const track = await this.trackModel.findByIdAndRemove({ slug });

    if (!track) {
      throw new Error("Track not found");
    }

    return track;
  }
}

export { TrackService };
