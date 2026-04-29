import { Link } from "react-router-dom";
import { addToCart, removeFromCart, useCart } from "../../lib/cart";
import { getDownloadAction } from "../../lib/download";
import { useEntitlements } from "../../lib/entitlements";
import type { Song } from "../../lib/songs";
import { useSession } from "../../lib/session";
import { AudioPlayer } from "./AudioPlayer";

export function NowPlayingPanel(props: { song: Song | null }) {
  const session = useSession();
  const entitlements = useEntitlements();
  const cart = useCart();

  const action = props.song
    ? getDownloadAction(session, { songId: props.song.id, purchasedSongIds: entitlements.purchasedSongIds })
    : null;
  const inCart = props.song ? cart.songIds.includes(props.song.id) : false;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs uppercase tracking-[0.18em] text-white/70">Now Playing</div>
        <div className="text-xs text-white/50">{session.isLoggedIn ? `Tier ${session.tier.toUpperCase()}` : "Guest"}</div>
      </div>

      {props.song ? (
        <div className="mt-3">
          <div className="text-base font-medium">{props.song.title}</div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">BPM {props.song.bpm}</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">Key {props.song.key}</span>
          </div>

          <AudioPlayer src={props.song.previewUrl} />

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (!props.song) return;
                if (inCart) {
                  removeFromCart(props.song.id);
                } else {
                  addToCart(props.song.id);
                }
              }}
              className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
            >
              {inCart ? "Remove from cart" : "Add to cart"}
            </button>

            {action?.allowed ? (
              <a
                href={props.song.downloadUrl320}
                download
                className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
              >
                Download 320kbps
              </a>
            ) : (
              <>
                {action?.reason === "login" ? (
                  <Link
                    to="/login"
                    className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
                  >
                    Login to download
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/cart"
                      className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
                    >
                      Go to cart
                    </Link>
                    <Link
                      to="/checkout?mode=upgrade"
                      className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
                    >
                      Upgrade to Pro
                    </Link>
                  </>
                )}
              </>
            )}
            <div className="text-xs text-white/50">
              {action?.allowed ? "Unlocked" : action?.reason === "login" ? "Members only" : "Purchase or Pro"}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-3 text-sm text-white/70">Select a song</div>
      )}
    </div>
  );
}
