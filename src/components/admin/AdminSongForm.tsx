import { useEffect, useMemo, useState } from "react";
import type { Song } from "../../lib/songs";
import { toDriveDirectDownloadUrl } from "../../lib/drive";

const DEFAULT_DRIVE_FOLDER_URL =
  "https://drive.google.com/drive/u/1/folders/1JtrF35u5EncDBNgbhRimoS8-RXdIIaOW";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

function ensureUniqueId(base: string, existing: Set<string>) {
  if (!existing.has(base)) return base;
  let i = 2;
  while (existing.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
}

export function AdminSongForm(props: {
  existingIds: Set<string>;
  initial?: Song | null;
  onAdd: (song: Song) => void;
  onUpdate: (song: Song) => void;
  onCancelEdit: () => void;
}) {
  const [title, setTitle] = useState("");
  const [bpm, setBpm] = useState<string>("");
  const [keySig, setKeySig] = useState("");
  const [previewInput, setPreviewInput] = useState("");
  const [downloadInput, setDownloadInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(props.initial);

  useEffect(() => {
    if (!props.initial) return;
    setTitle(props.initial.title);
    setBpm(String(props.initial.bpm));
    setKeySig(props.initial.key);
    setPreviewInput(props.initial.previewUrl);
    setDownloadInput(props.initial.downloadUrl320);
    setError(null);
  }, [props.initial]);

  const suggested = useMemo(() => {
    const base = slugify(title || "track");
    return {
      preview: `${base}.mp3`,
      hi320: `${base}-320.mp3`,
    };
  }, [title]);

  function resetForm() {
    setTitle("");
    setBpm("");
    setKeySig("");
    setPreviewInput("");
    setDownloadInput("");
    setError(null);
  }

  function onSubmit() {
    setError(null);

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return setError("Title is required");

    const bpmNum = Number(bpm);
    if (!Number.isFinite(bpmNum)) return setError("BPM must be a number");
    if (bpmNum < 40 || bpmNum > 220) return setError("BPM must be in range 40–220");

    const k = keySig.trim();
    if (!k) return setError("Key is required");

    const p = toDriveDirectDownloadUrl(previewInput) ?? toDriveDirectDownloadUrl(previewInput.trim());
    if (!p) return setError("Preview must be a Google Drive URL or File ID");

    const d = toDriveDirectDownloadUrl(downloadInput) ?? toDriveDirectDownloadUrl(downloadInput.trim());
    if (!d) return setError("320kbps must be a Google Drive URL or File ID");

    const baseId = slugify(trimmedTitle);
    if (!baseId) return setError("Cannot create id from title");

    const nextId = isEditing && props.initial ? props.initial.id : ensureUniqueId(baseId, props.existingIds);

    const next: Song = {
      id: nextId,
      title: trimmedTitle,
      bpm: bpmNum,
      key: k,
      previewUrl: p,
      downloadUrl320: d,
    };

    if (isEditing) {
      props.onUpdate(next);
      resetForm();
      props.onCancelEdit();
      return;
    }

    props.onAdd(next);
    resetForm();
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs uppercase tracking-[0.18em] text-white/70">{isEditing ? "Edit Song" : "Add Song"}</div>
          <div className="mt-1 text-xs text-white/45">Paste Drive URL or File ID. Export songs.json to redeploy.</div>
        </div>
        <a
          href={DEFAULT_DRIVE_FOLDER_URL}
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
        >
          Open Drive Folder
        </a>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
        <label className="block">
          <div className="text-xs text-white/60">Title</div>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
            placeholder="Neon Runner"
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <div className="text-xs text-white/60">BPM</div>
            <input
              value={bpm}
              inputMode="numeric"
              onChange={(e) => setBpm(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
              placeholder="128"
            />
          </label>
          <label className="block">
            <div className="text-xs text-white/60">Key</div>
            <input
              value={keySig}
              onChange={(e) => setKeySig(e.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
              placeholder="8A"
            />
          </label>
        </div>

        <label className="block md:col-span-2">
          <div className="text-xs text-white/60">Preview (Drive URL or File ID)</div>
          <input
            value={previewInput}
            onChange={(e) => setPreviewInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
            placeholder={`Suggested filename: ${suggested.preview}`}
          />
        </label>

        <label className="block md:col-span-2">
          <div className="text-xs text-white/60">320kbps (Drive URL or File ID)</div>
          <input
            value={downloadInput}
            onChange={(e) => setDownloadInput(e.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
            placeholder={`Suggested filename: ${suggested.hi320}`}
          />
        </label>
      </div>

      {error ? <div className="mt-3 text-sm text-red-300">{error}</div> : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
          onClick={onSubmit}
        >
          {isEditing ? "Save changes" : "Add to staging"}
        </button>
        {isEditing ? (
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
            onClick={() => {
              resetForm();
              props.onCancelEdit();
            }}
          >
            Cancel
          </button>
        ) : null}
      </div>
    </div>
  );
}

