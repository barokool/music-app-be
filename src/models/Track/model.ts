import * as mongoose from "mongoose";
import { Track } from "./interface";
import slugify from "slugify";

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
    slug: String,
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

trackSchema.pre("save", function (next) {
  const slugOptions = {
    lower: true,
    strict: true,
    remove: /[^\x00-\x7F]/g,
  };
  this.slug = slugify(
    this.title + "-" + Math.round(Math.random() * 100),
    slugOptions
  );
  next();
});

const trackModel = mongoose.model<Track & mongoose.Document>(
  "Track",
  trackSchema
);

export default trackModel;
