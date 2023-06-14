import * as mongoose from "mongoose";
import { Playlist } from "./interface";
import slugify from "slugify";

const playlistSchema = new mongoose.Schema(
  {
    name: String,
    tracks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Track",
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    slug: String,
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

playlistSchema.pre("save", function (next) {
  const slugOptions = {
    lower: true,
    strict: true,
    remove: /[^\x00-\x7F]/g,
  };
  this.slug = slugify(
    this.name + "-" + Math.random().toString(36).substr(2, 9),
    slugOptions
  );
  next();
});

const playlistModel = mongoose.model<Playlist & mongoose.Document>(
  "Playlist",
  playlistSchema
);

export default playlistModel;
