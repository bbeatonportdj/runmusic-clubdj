import { useEffect, useMemo, useState } from "react";
import { AdminImportExport } from "../components/admin/AdminImportExport";
import { AdminSongForm } from "../components/admin/AdminSongForm";
import { AdminSongTable } from "../components/admin/AdminSongTable";
import { useIsAdmin } from "../lib/admin";
import { getSongs, type Song } from "../lib/songs";
import { NotAuthorized } from "./NotAuthorized";

const STAGING_KEY = "rmcdj_admin_staging_v1";

function parseSongs(raw: string | null): Song[] | null {
  if (!raw) return null;
  try {
    const v = JSON.parse(raw) as unknown;
    if (!Array.isArray(v)) return null;
    const ok = v.every(
      (s: any) =>
        s &&
        typeof s === "object" &&
        typeof s.id === "string" &&
        typeof s.title === "string" &&
        typeof s.bpm === "number" &&
        typeof s.key === "string" &&
        typeof s.previewUrl === "string" &&
        typeof s.downloadUrl320 === "string",
    );
    return ok ? (v as Song[]) : null;
  } catch {
    return null;
  }
}

export function Admin() {
  const isAdmin = useIsAdmin();
  if (!isAdmin) {
    return <NotAuthorized title="Not authorized" hint="Enable Admin Mode to access /admin" />;
  }

  const initial = useMemo(() => parseSongs(localStorage.getItem(STAGING_KEY)) ?? getSongs(), []);
  const [songs, setSongs] = useState<Song[]>(initial);
  const [editing, setEditing] = useState<Song | null>(null);

  useEffect(() => {
    localStorage.setItem(STAGING_KEY, JSON.stringify(songs));
  }, [songs]);

  const ids = useMemo(() => new Set(songs.map((s) => s.id)), [songs]);

  return (
    <div className="mt-5 space-y-4">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
        <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
        <p className="mt-1 text-sm text-white/60">Add songs (Drive URL/ID) → Export songs.json → replace src/data/songs.json → redeploy</p>
      </div>

      <AdminSongForm
        existingIds={ids}
        initial={editing}
        onAdd={(song) => setSongs((prev) => [song, ...prev])}
        onUpdate={(song) => setSongs((prev) => prev.map((s) => (s.id === song.id ? song : s)))}
        onCancelEdit={() => setEditing(null)}
      />

      <AdminImportExport songs={songs} onReplaceSongs={(next) => setSongs(next)} />

      <AdminSongTable
        songs={songs}
        onEdit={(song) => setEditing(song)}
        onRemove={(id) => {
          setSongs((prev) => prev.filter((s) => s.id !== id));
          setEditing((cur) => (cur?.id === id ? null : cur));
        }}
      />
    </div>
  );
}
