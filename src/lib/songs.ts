import rawSongs from "../data/songs.json";

export type Song = {
  id: string;
  title: string;
  bpm: number;
  key: string;
  previewUrl: string;
  downloadUrl320: string;
};

export function getSongs(): Song[] {
  return rawSongs as Song[];
}

