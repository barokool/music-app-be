import * as mongoose from "mongoose";
import { User } from "./interface";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: {
      type: String,
      get: (): undefined => undefined,
    },
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

userSchema.virtual("tracks", {
  ref: "Track",
  localField: "_id",
  foreignField: "author",
});

userSchema.virtual("playlists", {
  ref: "Playlist",
  localField: "_id",
  foreignField: "author",
});

const userModel = mongoose.model<User & mongoose.Document>("User", userSchema);

export default userModel;
