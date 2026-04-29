import { useEffect, useMemo, useRef, useState } from "react";

function formatTime(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function AudioPlayer(props: { src: string }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);

  const pct = useMemo(() => {
    if (!d) return 0;
    return Math.min(100, Math.max(0, (t / d) * 100));
  }, [t, d]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    a.pause();
    a.currentTime = 0;
    setIsPlaying(false);

    const onTime = () => setT(a.currentTime || 0);
    const onMeta = () => setD(a.duration || 0);
    const onEnd = () => setIsPlaying(false);

    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("ended", onEnd);
    return () => {
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("ended", onEnd);
    };
  }, [props.src]);

  async function onToggle() {
    const a = audioRef.current;
    if (!a) return;
    if (isPlaying) {
      a.pause();
      setIsPlaying(false);
      return;
    }
    try {
      await a.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  function onSeek(nextPct: number) {
    const a = audioRef.current;
    if (!a || !d) return;
    a.currentTime = (nextPct / 100) * d;
  }

  return (
    <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
      <audio ref={audioRef} src={props.src} preload="metadata" />

      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={isPlaying ? "Pause" : "Play"}
          onClick={onToggle}
          className={[
            "rounded-xl border px-4 py-2 text-sm transition",
            "border-white/15 bg-white/10 hover:border-white/25 hover:bg-white/15",
          ].join(" ")}
        >
          {isPlaying ? "Pause" : "Play"}
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between text-xs text-white/55">
            <div>{formatTime(t)}</div>
            <div>{formatTime(d)}</div>
          </div>
          <input
            aria-label="Seek"
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => onSeek(Number(e.target.value))}
            className="mt-1 w-full accent-emerald-300"
          />
        </div>
      </div>
    </div>
  );
}

