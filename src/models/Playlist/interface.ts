import { Track } from "models/Track/interface";
import { User } from "models/User/interface";

export interface Playlist {
  _id: string;
  name: string;
  tracks: Track[];
  slug: string;
  author: User;
}
