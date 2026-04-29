import type { Song } from "../../lib/songs";

export function SongRow(props: { song: Song; isActive: boolean; onSelect: () => void }) {
  const { song } = props;
  return (
    <button
      type="button"
      onClick={props.onSelect}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition",
        "shadow-[0_10px_30px_rgba(0,0,0,0.25)]",
        props.isActive
          ? "border-emerald-400/35 bg-emerald-400/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{song.title}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">BPM {song.bpm}</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">Key {song.key}</span>
          </div>
        </div>
        <div className="text-xs text-white/50">{props.isActive ? "Playing" : "Select"}</div>
      </div>
    </button>
  );
}

