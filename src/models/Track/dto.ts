import { IsNumber, IsString } from "class-validator";

export class createTrackDto {
  @IsString()
  title: string;

  @IsString()
  coverImage: string;

  @IsString()
  artist: string;

  @IsString()
  album: string;

  @IsString()
  genre: string;

  @IsNumber()
  releaseYear: number;

  @IsString()
  duration: number;

  @IsString()
  mp3File: string;
}
