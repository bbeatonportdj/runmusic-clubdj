import { useRef, useState } from "react";
import type { Song } from "../../lib/songs";
import { toPrettyJson } from "../../lib/jsonExport";

function isSong(v: any): v is Song {
  return (
    v &&
    typeof v === "object" &&
    typeof v.id === "string" &&
    typeof v.title === "string" &&
    typeof v.bpm === "number" &&
    typeof v.key === "string" &&
    typeof v.previewUrl === "string" &&
    typeof v.downloadUrl320 === "string"
  );
}

export function AdminImportExport(props: { songs: Song[]; onReplaceSongs: (next: Song[]) => void }) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [err, setErr] = useState<string | null>(null);

  function onExport() {
    setErr(null);
    const json = toPrettyJson(props.songs);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "songs.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function onImportFile(file: File) {
    setErr(null);
    const raw = await file.text();
    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      setErr("Invalid JSON file");
      return;
    }
    if (!Array.isArray(parsed)) {
      setErr("JSON must be an array");
      return;
    }
    if (!parsed.every(isSong)) {
      setErr("JSON items must match Song shape");
      return;
    }
    props.onReplaceSongs(parsed);
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/70">Import / Export</div>
          <div className="mt-1 text-xs text-white/45">Export แล้วนำไปแทนที่ src/data/songs.json จากนั้น build/deploy</div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
            onClick={onExport}
          >
            Export songs.json
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
            onClick={() => fileRef.current?.click()}
          >
            Import songs.json
          </button>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void onImportFile(file);
          e.target.value = "";
        }}
      />

      {err ? <div className="mt-3 text-sm text-red-300">{err}</div> : null}
    </div>
  );
}

