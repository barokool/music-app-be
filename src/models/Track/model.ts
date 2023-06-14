import * as mongoose from "mongoose";
import { Track } from "./interface";
import slug from "mongoose-slug-generator";

mongoose.plugin(slug);

const trackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      index: true,
    },
    coverImage: String,
    artist: String,
    album: String,
    genre: String,
    releaseYear: Number,
    duration: Number,
    mp3File: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: {
      type: String,
      slug: ["title", "artist"],
      unique: true,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

const trackModel = mongoose.model<Track & mongoose.Document>(
  "Track",
  trackSchema
);

export default trackModel;
