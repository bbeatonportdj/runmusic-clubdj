import { Link } from "react-router-dom";

export function NotAuthorized(props: { title: string; hint?: string }) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <h1 className="text-xl font-semibold tracking-tight">{props.title}</h1>
      {props.hint ? <p className="mt-2 text-white/60">{props.hint}</p> : null}
      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          to="/"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
        >
          Back to Home
        </Link>
        <Link
          to="/account"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
        >
          Account
        </Link>
      </div>
    </div>
  );
}

