import { useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { clearCart, useCart } from "../lib/cart";
import { grantPurchasedSongs, useEntitlements } from "../lib/entitlements";
import { getSongs } from "../lib/songs";
import { setTier, useSession } from "../lib/session";

export function Checkout() {
  const [sp] = useSearchParams();
  const mode = sp.get("mode") === "upgrade" ? "upgrade" : "purchase";
  const nav = useNavigate();

  const session = useSession();
  const cart = useCart();
  useEntitlements();

  const songs = useMemo(() => getSongs(), []);
  const byId = useMemo(() => new Map(songs.map((s) => [s.id, s])), [songs]);
  const items = cart.songIds.map((id) => byId.get(id)).filter(Boolean);

  function requireLogin() {
    if (!session.isLoggedIn) {
      nav("/login");
      return false;
    }
    return true;
  }

  function onPay() {
    if (!requireLogin()) return;
    if (mode === "upgrade") {
      setTier("pro");
      nav("/account");
      return;
    }
    const ids = items.map((s) => s!.id);
    grantPurchasedSongs(ids);
    clearCart();
    nav("/account");
  }

  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Checkout (Mock)</h1>
          <p className="mt-1 text-sm text-white/60">
            Mode: {mode === "upgrade" ? "Upgrade Pro" : "Purchase tracks"} •{" "}
            {session.isLoggedIn ? `Tier ${session.tier.toUpperCase()}` : "Guest"}
          </p>
        </div>
        <Link to="/cart" className="text-sm text-white/70 underline underline-offset-4">
          Back to cart
        </Link>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
        {mode === "upgrade" ? (
          <div className="text-sm text-white/80">Pay (mock) to upgrade your account to Pro. This unlocks HQ downloads for all songs.</div>
        ) : items.length ? (
          <div className="space-y-2">
            {items.map((s) => (
              <div key={s!.id} className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{s!.title}</div>
                  <div className="mt-1 text-xs text-white/60">
                    BPM {s!.bpm} • Key {s!.key}
                  </div>
                </div>
                <div className="text-xs text-white/55">Included</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-white/70">No tracks in cart</div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onPay}
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
        >
          Pay (Mock)
        </button>
        {!session.isLoggedIn ? <div className="text-xs text-white/55">You will be sent to Login first.</div> : null}
      </div>
    </div>
  );
}

