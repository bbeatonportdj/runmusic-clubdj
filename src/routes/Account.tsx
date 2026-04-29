import { signOut, useSession } from "../lib/session";
import { disableAdminMode, enableAdminMode, useIsAdmin } from "../lib/admin";
import { useEntitlements } from "../lib/entitlements";
import { getSongs } from "../lib/songs";

export function Account() {
  const s = useSession();
  const isAdmin = useIsAdmin();
  const entitlements = useEntitlements();
  const songs = getSongs();
  const byId = new Map(songs.map((song) => [song.id, song]));
  const purchased = entitlements.purchasedSongIds.map((id) => byId.get(id)).filter(Boolean);
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <h1 className="text-xl font-semibold tracking-tight">Account</h1>
      <div className="mt-3 text-sm text-white/70">
        Status: {s.isLoggedIn ? "Logged In" : "Logged Out"} • Tier: {s.tier.toUpperCase()}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-white/70">Purchased</div>
        <div className="mt-1 text-sm text-white/60">{purchased.length ? `${purchased.length} track(s)` : "None"}</div>
        {purchased.length ? (
          <div className="mt-3 space-y-2">
            {purchased.map((song) => (
              <div
                key={song!.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">{song!.title}</div>
                  <div className="mt-1 text-xs text-white/60">
                    BPM {song!.bpm} • Key {song!.key}
                  </div>
                </div>
                <div className="text-xs text-white/55">Unlocked</div>
              </div>
            ))}
          </div>
        ) : null}
      </div>

      <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
        <div className="text-xs uppercase tracking-[0.18em] text-white/70">Admin Mode</div>
        <div className="mt-1 text-sm text-white/60">{isAdmin ? "Enabled" : "Disabled"}</div>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
            onClick={() => enableAdminMode()}
          >
            Enable
          </button>
          <button
            type="button"
            className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
            onClick={() => disableAdminMode()}
          >
            Disable
          </button>
        </div>
      </div>

      <div className="mt-4">
        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
