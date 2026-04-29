import { useNavigate } from "react-router-dom";
import { signIn } from "../lib/session";

export function Login() {
  const nav = useNavigate();
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
      <h1 className="text-xl font-semibold tracking-tight">Login (Mock)</h1>
      <p className="mt-2 text-white/60">เลือกแพ็กเพื่อเดโม่สิทธิ์ดาวน์โหลดไฟล์ 320kbps</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          type="button"
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm transition hover:border-white/25 hover:bg-white/15"
          onClick={() => {
            signIn("free");
            nav("/");
          }}
        >
          Continue as Free
        </button>
        <button
          type="button"
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm transition hover:border-emerald-400/55 hover:bg-emerald-400/15"
          onClick={() => {
            signIn("pro");
            nav("/");
          }}
        >
          Continue as Pro
        </button>
      </div>
    </div>
  );
}

