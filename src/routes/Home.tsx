import { useMemo, useState } from "react";
import { NowPlayingPanel } from "../components/player/NowPlayingPanel";
import { SongList } from "../components/songs/SongList";
import { getSongs } from "../lib/songs";

export function Home() {
  const songs = useMemo(() => getSongs(), []);
  const [currentId, setCurrentId] = useState<string | null>(songs[0]?.id ?? null);
  const currentSong = songs.find((s) => s.id === currentId) ?? null;

  return (
    <div className="mt-5">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">RunMusic-ClubDj</h1>
            <p className="mt-1 text-sm text-white/60">Song list + BPM/Key + preview player + Pro download (mock)</p>
          </div>
          <div className="text-xs text-white/45">Hybrid layout: Split View + Card energy</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <SongList currentSongId={currentId} onSelect={setCurrentId} />
        </div>
        <div className="lg:col-span-5">
          <NowPlayingPanel song={currentSong} />
        </div>
      </div>
    </div>
  );
}

