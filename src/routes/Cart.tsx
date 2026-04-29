import { Link } from "react-router-dom";
import { removeFromCart, useCart } from "../lib/cart";
import { getSongs } from "../lib/songs";

export function Cart() {
  const cart = useCart();
  const songs = getSongs();
  const byId = new Map(songs.map((s) => [s.id, s]));
  const items = cart.songIds.map((id) => byId.get(id)).filter(Boolean);

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Cart</h1>
          <p className="mt-1 text-sm text-white/60">{items.length} track(s)</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            to="/checkout?mode=purchase"
            className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
          >
            Checkout tracks (mock)
          </Link>
          <Link
            to="/checkout?mode=upgrade"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
          >
            Upgrade to Pro (mock)
          </Link>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {items.length ? (
          items.map((s) => (
            <div
              key={s!.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-black/20 px-4 py-3"
            >
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{s!.title}</div>
                <div className="mt-1 text-xs text-white/60">
                  BPM {s!.bpm} • Key {s!.key}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeFromCart(s!.id)}
                className="rounded-xl border border-white/15 bg-white/10 px-3 py-2 text-xs transition hover:border-white/25 hover:bg-white/15"
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">Cart is empty</div>
        )}
      </div>
    </div>
  );
}

