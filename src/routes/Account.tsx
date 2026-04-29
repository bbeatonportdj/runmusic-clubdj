import { signOut, useSession } from "../lib/session";
import { disableAdminMode, enableAdminMode, useIsAdmin } from "../lib/admin";

export function Account() {
  const s = useSession();
  const isAdmin = useIsAdmin();
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <h1 className="text-xl font-semibold tracking-tight">Account</h1>
      <div className="mt-3 text-sm text-white/70">
        Status: {s.isLoggedIn ? "Logged In" : "Logged Out"} • Tier: {s.tier.toUpperCase()}
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
