import type { Song } from "../../lib/songs";

export function AdminSongTable(props: { songs: Song[]; onRemove: (id: string) => void; onEdit: (song: Song) => void }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <div className="text-xs uppercase tracking-[0.18em] text-white/70">Staging</div>
        <div className="text-xs text-white/50">{props.songs.length} tracks</div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[780px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.18em] text-white/55">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">BPM</th>
              <th className="px-4 py-3 font-medium">Key</th>
              <th className="px-4 py-3 font-medium">Preview</th>
              <th className="px-4 py-3 font-medium">320</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {props.songs.map((s) => (
              <tr key={s.id} className="border-b border-white/5 last:border-b-0">
                <td className="px-4 py-3">
                  <div className="font-medium">{s.title}</div>
                  <div className="mt-1 text-xs text-white/45">{s.id}</div>
                </td>
                <td className="px-4 py-3 text-white/80">{s.bpm}</td>
                <td className="px-4 py-3 text-white/80">{s.key}</td>
                <td className="px-4 py-3">
                  <a className="text-emerald-200/80 underline decoration-white/20 underline-offset-4" href={s.previewUrl} target="_blank" rel="noreferrer">
                    link
                  </a>
                </td>
                <td className="px-4 py-3">
                  <a className="text-emerald-200/80 underline decoration-white/20 underline-offset-4" href={s.downloadUrl320} target="_blank" rel="noreferrer">
                    link
                  </a>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs transition hover:border-white/25 hover:bg-white/15"
                      onClick={() => props.onEdit(s)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="rounded-xl border border-red-400/30 bg-red-400/10 px-3 py-2 text-xs transition hover:border-red-400/45 hover:bg-red-400/15"
                      onClick={() => props.onRemove(s.id)}
                    >
                      Remove
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {props.songs.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-sm text-white/60" colSpan={6}>
                  No songs in staging
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

