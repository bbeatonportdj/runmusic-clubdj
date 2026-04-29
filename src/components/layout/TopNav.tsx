import { Link, NavLink } from "react-router-dom";
import { useIsAdmin } from "../../lib/admin";
import { useCart } from "../../lib/cart";
import { useSession } from "../../lib/session";

export function TopNav() {
  const s = useSession();
  const isAdmin = useIsAdmin();
  const cart = useCart();
  return (
    <div className="sticky top-3 z-20 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-white/15 bg-gradient-to-br from-emerald-400/35 via-white/10 to-cyan-300/35" />
          <div>
            <div className="text-xs uppercase tracking-[0.18em]">RunMusic-ClubDj</div>
            <div className="text-xs text-white/60">dark • neon • club tools</div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <NavLink
            to="/"
            className={({ isActive }) =>
              [
                "rounded-full border px-3 py-2 transition",
                isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
              ].join(" ")
            }
          >
            Songs
          </NavLink>
          <NavLink
            to="/cart"
            className={({ isActive }) =>
              [
                "rounded-full border px-3 py-2 transition",
                isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
              ].join(" ")
            }
          >
            {cart.songIds.length ? `Cart (${cart.songIds.length})` : "Cart"}
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              [
                "rounded-full border px-3 py-2 transition",
                isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
              ].join(" ")
            }
          >
            Account
          </NavLink>
          {isAdmin ? (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                [
                  "rounded-full border px-3 py-2 transition",
                  isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70 hover:border-white/20",
                ].join(" ")
              }
            >
              Admin
            </NavLink>
          ) : null}
          <NavLink
            to="/login"
            className={({ isActive }) =>
              [
                "rounded-full border px-3 py-2 transition",
                isActive ? "border-white/25 bg-white/10" : "",
                s.isLoggedIn ? "border-white/10 bg-white/5 text-white/60" : "border-emerald-400/40 bg-emerald-400/10",
              ].join(" ")
            }
          >
            {s.isLoggedIn ? `Tier: ${s.tier.toUpperCase()}` : "Login"}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
