import { useMemo, useState } from "react";
import { getSongs } from "../../lib/songs";
import { SongRow } from "./SongRow";

export function SongList(props: { currentSongId: string | null; onSelect: (id: string) => void }) {
  const [q, setQ] = useState("");
  const songs = useMemo(() => getSongs(), []);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return songs;
    return songs.filter((s) => s.title.toLowerCase().includes(needle));
  }, [q, songs]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/70">Song List</div>
          <div className="mt-1 text-xs text-white/45">Search + click to load preview</div>
        </div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs"
          className="w-full max-w-xs rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
        />
      </div>

      <div className="mt-3 space-y-2">
        {filtered.map((s) => (
          <SongRow key={s.id} song={s} isActive={s.id === props.currentSongId} onSelect={() => props.onSelect(s.id)} />
        ))}
      </div>
    </div>
  );
}

