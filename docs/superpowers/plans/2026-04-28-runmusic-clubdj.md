# RunMusic-ClubDj Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** สร้างเว็บ React + Tailwind โทน Dark high-energy ที่มี Song List (ชื่อ/BPM/Key), ฟัง preview ได้, และล็อกการดาวน์โหลด 320kbps ด้วยสมาชิกแบบ mock (Free/Pro)

**Architecture:** Frontend-only MVP: ข้อมูลเพลงจาก static JSON + ใช้ HTMLAudioElement สำหรับ player. Session (login/tier) เก็บใน localStorage ผ่าน service เดียวเพื่ออัปเกรดไป backend/auth จริงภายหลังได้ง่าย.

**Tech Stack:** React, Tailwind CSS, Vite, TypeScript, Vitest + Testing Library, Playwright (optional E2E)

---

## File Structure (ที่จะสร้าง/แก้)

**Create**
- `package.json`
- `vite.config.ts`
- `tailwind.config.js`
- `postcss.config.js`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/styles.css`
- `src/lib/songs.ts`
- `src/lib/session.ts`
- `src/lib/download.ts`
- `src/data/songs.json`
- `src/components/layout/TopNav.tsx`
- `src/components/songs/SongList.tsx`
- `src/components/songs/SongRow.tsx`
- `src/components/player/NowPlayingPanel.tsx`
- `src/components/player/AudioPlayer.tsx`
- `src/routes/Login.tsx`
- `src/routes/Home.tsx`
- `src/routes/Account.tsx`

**Public assets (demo)**
- `public/audio/previews/<...>.mp3`
- `public/audio/hi320/<...>.mp3`

**Test**
- `src/lib/session.test.ts`
- `src/lib/songs.test.ts`
- `src/lib/download.test.ts`
- `src/components/player/AudioPlayer.test.tsx`
- `src/components/songs/SongList.test.tsx`

---

### Task 1: Scaffold React + Tailwind (Vite + TS) และหน้าเริ่มต้น

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `tailwind.config.js`
- Create: `postcss.config.js`

- [ ] **Step 1: สร้าง `package.json` พร้อม dependencies**

```json
{
  "name": "runmusic-clubdj",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "lint": "eslint .",
    "format": "prettier -w ."
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/react": "^16.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.0.0",
    "eslint": "^9.0.0",
    "eslint-plugin-react-hooks": "^5.0.0",
    "eslint-plugin-react-refresh": "^0.4.0",
    "jsdom": "^26.0.0",
    "postcss": "^8.0.0",
    "prettier": "^3.0.0",
    "tailwindcss": "^3.0.0",
    "typescript": "^5.0.0",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: สร้าง `vite.config.ts`**

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
});
```

- [ ] **Step 3: สร้าง `tailwind.config.js` และ `postcss.config.js`**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060b",
          900: "#07090f",
          850: "#0b1020"
        }
      }
    }
  },
  plugins: []
};
```

```js
// postcss.config.js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};
```

- [ ] **Step 4: สร้าง `src/styles.css` (tailwind base + ธีมพื้นหลัง)**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html,
body {
  height: 100%;
}

body {
  background:
    radial-gradient(1200px 600px at 20% -10%, rgba(73, 214, 255, 0.25), transparent 55%),
    radial-gradient(900px 500px at 85% 10%, rgba(165, 255, 77, 0.18), transparent 55%),
    linear-gradient(180deg, #07090f 0%, #05060b 100%);
}
```

- [ ] **Step 5: สร้าง `index.html`, `src/main.tsx`, `src/App.tsx`**

```html
<!doctype html>
<html lang="th">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>RunMusic-ClubDj</title>
  </head>
  <body class="text-white/90">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles.css";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

```tsx
export function App() {
  return (
    <div className="min-h-dvh">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
          <div className="text-xs tracking-[0.18em] uppercase text-white/70">RunMusic-ClubDj</div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">MVP scaffold</h1>
          <p className="mt-2 text-white/60">Next: Song List + Player + Members (mock)</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 6: ติดตั้งและรัน dev**

Run:
```bash
npm install
npm run dev
```

Expected: เปิดหน้าเว็บเห็น “MVP scaffold”

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts tailwind.config.js postcss.config.js index.html src/main.tsx src/App.tsx src/styles.css
git commit -m "chore: scaffold react + tailwind"
```

---

### Task 2: สร้าง data model เพลง (static JSON) + loader function

**Files:**
- Create: `src/data/songs.json`
- Create: `src/lib/songs.ts`
- Test: `src/lib/songs.test.ts`

- [ ] **Step 1: เขียนเทสสำหรับ loader**

```ts
import { describe, expect, it } from "vitest";
import { getSongs } from "./songs";

describe("getSongs", () => {
  it("returns songs with required fields", () => {
    const songs = getSongs();
    expect(songs.length).toBeGreaterThanOrEqual(10);
    expect(songs[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        bpm: expect.any(Number),
        key: expect.any(String),
        previewUrl: expect.any(String),
        downloadUrl320: expect.any(String),
      }),
    );
  });
});
```

- [ ] **Step 2: รันเทสให้ fail**

Run:
```bash
npm run test:run
```

Expected: FAIL เพราะยังไม่มี `getSongs`

- [ ] **Step 3: สร้าง `src/data/songs.json` (อย่างน้อย 10 เพลง)**

```json
[
  { "id": "neon-runner", "title": "Neon Runner", "bpm": 128, "key": "8A", "previewUrl": "/audio/previews/neon-runner.mp3", "downloadUrl320": "/audio/hi320/neon-runner-320.mp3" },
  { "id": "midnight-bounce", "title": "Midnight Bounce", "bpm": 124, "key": "6B", "previewUrl": "/audio/previews/midnight-bounce.mp3", "downloadUrl320": "/audio/hi320/midnight-bounce-320.mp3" },
  { "id": "hyperline", "title": "Hyperline", "bpm": 140, "key": "9A", "previewUrl": "/audio/previews/hyperline.mp3", "downloadUrl320": "/audio/hi320/hyperline-320.mp3" },
  { "id": "strobe-season", "title": "Strobe Season", "bpm": 132, "key": "10A", "previewUrl": "/audio/previews/strobe-season.mp3", "downloadUrl320": "/audio/hi320/strobe-season-320.mp3" },
  { "id": "acid-signal", "title": "Acid Signal", "bpm": 126, "key": "7B", "previewUrl": "/audio/previews/acid-signal.mp3", "downloadUrl320": "/audio/hi320/acid-signal-320.mp3" },
  { "id": "club-velocity", "title": "Club Velocity", "bpm": 130, "key": "9B", "previewUrl": "/audio/previews/club-velocity.mp3", "downloadUrl320": "/audio/hi320/club-velocity-320.mp3" },
  { "id": "afterhours-arc", "title": "Afterhours Arc", "bpm": 122, "key": "5A", "previewUrl": "/audio/previews/afterhours-arc.mp3", "downloadUrl320": "/audio/hi320/afterhours-arc-320.mp3" },
  { "id": "laser-lane", "title": "Laser Lane", "bpm": 138, "key": "11A", "previewUrl": "/audio/previews/laser-lane.mp3", "downloadUrl320": "/audio/hi320/laser-lane-320.mp3" },
  { "id": "pulse-magnet", "title": "Pulse Magnet", "bpm": 128, "key": "8B", "previewUrl": "/audio/previews/pulse-magnet.mp3", "downloadUrl320": "/audio/hi320/pulse-magnet-320.mp3" },
  { "id": "darkroom-swing", "title": "Darkroom Swing", "bpm": 125, "key": "6A", "previewUrl": "/audio/previews/darkroom-swing.mp3", "downloadUrl320": "/audio/hi320/darkroom-swing-320.mp3" }
]
```

- [ ] **Step 4: สร้าง `src/lib/songs.ts`**

```ts
import rawSongs from "../data/songs.json";

export type Song = {
  id: string;
  title: string;
  bpm: number;
  key: string;
  previewUrl: string;
  downloadUrl320: string;
};

export function getSongs(): Song[] {
  return rawSongs as Song[];
}
```

- [ ] **Step 5: รันเทสให้ผ่าน**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/data/songs.json src/lib/songs.ts src/lib/songs.test.ts
git commit -m "feat: add static song catalog"
```

---

### Task 3: Session service (mock login + tier Free/Pro) ด้วย localStorage

**Files:**
- Create: `src/lib/session.ts`
- Test: `src/lib/session.test.ts`

- [ ] **Step 1: เขียนเทสพฤติกรรม session**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { getSession, setTier, signIn, signOut } from "./session";

describe("session", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to logged out + free", () => {
    expect(getSession()).toEqual({ isLoggedIn: false, tier: "free" });
  });

  it("signIn sets isLoggedIn true", () => {
    signIn();
    expect(getSession().isLoggedIn).toBe(true);
  });

  it("setTier persists tier", () => {
    signIn();
    setTier("pro");
    expect(getSession()).toEqual({ isLoggedIn: true, tier: "pro" });
  });

  it("signOut clears session", () => {
    signIn();
    setTier("pro");
    signOut();
    expect(getSession()).toEqual({ isLoggedIn: false, tier: "free" });
  });
});
```

- [ ] **Step 2: รันเทสให้ fail**

Run:
```bash
npm run test:run
```

Expected: FAIL เพราะยังไม่มี `session.ts`

- [ ] **Step 3: เขียน `src/lib/session.ts`**

```ts
export type Tier = "free" | "pro";

export type Session = {
  isLoggedIn: boolean;
  tier: Tier;
};

const KEY = "rmcdj_session_v1";

function readRaw(): unknown {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRaw(value: Session) {
  localStorage.setItem(KEY, JSON.stringify(value));
}

export function getSession(): Session {
  const raw = readRaw();
  if (
    raw &&
    typeof raw === "object" &&
    "isLoggedIn" in raw &&
    "tier" in raw &&
    typeof (raw as any).isLoggedIn === "boolean" &&
    ((raw as any).tier === "free" || (raw as any).tier === "pro")
  ) {
    return raw as Session;
  }
  return { isLoggedIn: false, tier: "free" };
}

export function signIn() {
  const s = getSession();
  writeRaw({ ...s, isLoggedIn: true });
}

export function signOut() {
  localStorage.removeItem(KEY);
}

export function setTier(tier: Tier) {
  const s = getSession();
  writeRaw({ ...s, isLoggedIn: true, tier });
}
```

- [ ] **Step 4: รันเทสให้ผ่าน**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/session.ts src/lib/session.test.ts
git commit -m "feat: add mock session (free/pro)"
```

---

### Task 4: Download gate helper (UI/UX lock) + unit tests

**Files:**
- Create: `src/lib/download.ts`
- Test: `src/lib/download.test.ts`

- [ ] **Step 1: เขียนเทสสำหรับเงื่อนไขดาวน์โหลด**

```ts
import { describe, expect, it } from "vitest";
import { getDownloadAction } from "./download";

describe("getDownloadAction", () => {
  it("blocks when logged out", () => {
    expect(getDownloadAction({ isLoggedIn: false, tier: "free" })).toEqual({
      allowed: false,
      reason: "login",
    });
  });

  it("blocks when free", () => {
    expect(getDownloadAction({ isLoggedIn: true, tier: "free" })).toEqual({
      allowed: false,
      reason: "upgrade",
    });
  });

  it("allows when pro", () => {
    expect(getDownloadAction({ isLoggedIn: true, tier: "pro" })).toEqual({
      allowed: true,
    });
  });
});
```

- [ ] **Step 2: รันเทสให้ fail**

Run:
```bash
npm run test:run
```

Expected: FAIL เพราะยังไม่มี `download.ts`

- [ ] **Step 3: เขียน `src/lib/download.ts`**

```ts
import type { Session } from "./session";

export type DownloadAction =
  | { allowed: true }
  | { allowed: false; reason: "login" | "upgrade" };

export function getDownloadAction(session: Session): DownloadAction {
  if (!session.isLoggedIn) return { allowed: false, reason: "login" };
  if (session.tier !== "pro") return { allowed: false, reason: "upgrade" };
  return { allowed: true };
}
```

- [ ] **Step 4: รันเทสให้ผ่าน**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/download.ts src/lib/download.test.ts
git commit -m "feat: add download gate helper"
```

---

### Task 5: สร้าง UI Layout + Routing (Home/Login/Account)

**Files:**
- Modify: `src/App.tsx`
- Create: `src/routes/Home.tsx`
- Create: `src/routes/Login.tsx`
- Create: `src/routes/Account.tsx`
- Create: `src/components/layout/TopNav.tsx`

- [ ] **Step 1: เพิ่ม dependency routing**

Update `package.json` dependencies:
```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0"
  }
}
```

- [ ] **Step 2: ติดตั้งและรัน typecheck/build**

Run:
```bash
npm install
npm run build
```

Expected: build สำเร็จ

- [ ] **Step 3: สร้าง TopNav + routes**

```tsx
// src/components/layout/TopNav.tsx
import { Link, NavLink } from "react-router-dom";
import { getSession } from "../../lib/session";

export function TopNav() {
  const s = getSession();
  return (
    <div className="sticky top-3 z-20 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl border border-white/15 bg-white/10" />
          <div>
            <div className="text-xs tracking-[0.18em] uppercase">RunMusic-ClubDj</div>
            <div className="text-xs text-white/60">Dark theme • club tools</div>
          </div>
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-full border px-3 py-2 ${isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70"}`
            }
          >
            Songs
          </NavLink>
          <NavLink
            to="/account"
            className={({ isActive }) =>
              `rounded-full border px-3 py-2 ${isActive ? "border-white/25 bg-white/10" : "border-white/10 bg-white/5 text-white/70"}`
            }
          >
            Account
          </NavLink>
          <NavLink
            to="/login"
            className={() =>
              `rounded-full border px-3 py-2 ${s.isLoggedIn ? "border-white/10 bg-white/5 text-white/60" : "border-emerald-400/40 bg-emerald-400/10"}`
            }
          >
            {s.isLoggedIn ? "Logged In" : "Login"}
          </NavLink>
        </div>
      </div>
    </div>
  );
}
```

```tsx
// src/routes/Home.tsx
export function Home() {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
      <div className="text-sm text-white/70">Home (placeholder)</div>
    </div>
  );
}
```

```tsx
// src/routes/Login.tsx
import { useNavigate } from "react-router-dom";
import { setTier, signIn } from "../lib/session";

export function Login() {
  const nav = useNavigate();
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-semibold tracking-tight">Login (Mock)</h1>
      <p className="mt-2 text-white/60">เลือกแผนเพื่อเดโม่สิทธิ์ดาวน์โหลด</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <button
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm"
          onClick={() => {
            signIn();
            setTier("free");
            nav("/");
          }}
        >
          Continue as Free
        </button>
        <button
          className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm"
          onClick={() => {
            signIn();
            setTier("pro");
            nav("/");
          }}
        >
          Continue as Pro
        </button>
      </div>
    </div>
  );
}
```

```tsx
// src/routes/Account.tsx
import { useNavigate } from "react-router-dom";
import { getSession, signOut } from "../lib/session";

export function Account() {
  const nav = useNavigate();
  const s = getSession();
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-semibold tracking-tight">Account</h1>
      <div className="mt-3 text-sm text-white/70">
        Status: {s.isLoggedIn ? "Logged In" : "Logged Out"} • Tier: {s.tier.toUpperCase()}
      </div>
      <div className="mt-4">
        <button
          className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm"
          onClick={() => {
            signOut();
            nav("/");
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
```

```tsx
// src/App.tsx
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/layout/TopNav";
import { Account } from "./routes/Account";
import { Home } from "./routes/Home";
import { Login } from "./routes/Login";

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-dvh">
        <div className="mx-auto max-w-6xl px-4 py-6">
          <TopNav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/account" element={<Account />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
```

- [ ] **Step 4: รัน dev เพื่อเช็ค route**

Run:
```bash
npm run dev
```

Expected: เข้า `/login` แล้วเลือก Free/Pro ได้, `/account` แสดง tier

- [ ] **Step 5: Commit**

```bash
git add package.json src/App.tsx src/components/layout/TopNav.tsx src/routes/Home.tsx src/routes/Login.tsx src/routes/Account.tsx
git commit -m "feat: add routes and mock login"
```

---

### Task 6: Song List (Search + Select) และ Now Playing state

**Files:**
- Modify: `src/routes/Home.tsx`
- Create: `src/components/songs/SongList.tsx`
- Create: `src/components/songs/SongRow.tsx`
- Create: `src/components/player/NowPlayingPanel.tsx`
- Test: `src/components/songs/SongList.test.tsx`

- [ ] **Step 1: เขียน UI test สำหรับ SongList (render + search)**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { SongList } from "./SongList";

describe("SongList", () => {
  it("filters by search input", async () => {
    const user = userEvent.setup();
    render(<SongList currentSongId={null} onSelect={() => {}} />);
    const input = screen.getByPlaceholderText("Search songs");
    await user.type(input, "Neon");
    expect(screen.getByText("Neon Runner")).toBeInTheDocument();
    expect(screen.queryByText("Midnight Bounce")).toBeNull();
  });
});
```

- [ ] **Step 2: รันเทสให้ fail**

Run:
```bash
npm run test:run
```

Expected: FAIL เพราะยังไม่มี `SongList`

- [ ] **Step 3: Implement `SongList` + `SongRow`**

```tsx
// src/components/songs/SongList.tsx
import { useMemo, useState } from "react";
import { getSongs } from "../../lib/songs";
import { SongRow } from "./SongRow";

export function SongList(props: { currentSongId: string | null; onSelect: (id: string) => void }) {
  const [q, setQ] = useState("");
  const songs = useMemo(() => getSongs(), []);
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return songs;
    return songs.filter((s) => s.title.toLowerCase().includes(needle));
  }, [q, songs]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-xs tracking-[0.18em] uppercase text-white/70">Song List</div>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search songs"
          className="w-56 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-sm text-white/85 outline-none placeholder:text-white/35 focus:border-emerald-400/40"
        />
      </div>
      <div className="mt-3 space-y-2">
        {filtered.map((s) => (
          <SongRow key={s.id} song={s} isActive={s.id === props.currentSongId} onSelect={() => props.onSelect(s.id)} />
        ))}
      </div>
    </div>
  );
}
```

```tsx
// src/components/songs/SongRow.tsx
import type { Song } from "../../lib/songs";

export function SongRow(props: { song: Song; isActive: boolean; onSelect: () => void }) {
  const { song } = props;
  return (
    <button
      onClick={props.onSelect}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-left transition",
        props.isActive
          ? "border-emerald-400/35 bg-emerald-400/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10",
      ].join(" ")}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium">{song.title}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-white/60">
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">BPM {song.bpm}</span>
            <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">Key {song.key}</span>
          </div>
        </div>
        <div className="text-xs text-white/50">Select</div>
      </div>
    </button>
  );
}
```

- [ ] **Step 4: Implement NowPlayingPanel placeholder**

```tsx
// src/components/player/NowPlayingPanel.tsx
import type { Song } from "../../lib/songs";

export function NowPlayingPanel(props: { song: Song | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs tracking-[0.18em] uppercase text-white/70">Now Playing</div>
      <div className="mt-3 text-sm text-white/70">{props.song ? props.song.title : "Select a song"}</div>
    </div>
  );
}
```

- [ ] **Step 5: เชื่อม Home layout (ซ้าย list, ขวา now playing)**

```tsx
// src/routes/Home.tsx
import { useMemo, useState } from "react";
import { NowPlayingPanel } from "../components/player/NowPlayingPanel";
import { SongList } from "../components/songs/SongList";
import { getSongs } from "../lib/songs";

export function Home() {
  const songs = useMemo(() => getSongs(), []);
  const [currentId, setCurrentId] = useState<string | null>(songs[0]?.id ?? null);
  const currentSong = songs.find((s) => s.id === currentId) ?? null;

  return (
    <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-12">
      <div className="lg:col-span-7">
        <SongList currentSongId={currentId} onSelect={setCurrentId} />
      </div>
      <div className="lg:col-span-5">
        <NowPlayingPanel song={currentSong} />
      </div>
    </div>
  );
}
```

- [ ] **Step 6: รันเทส**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 7: Commit**

```bash
git add src/routes/Home.tsx src/components/songs/SongList.tsx src/components/songs/SongRow.tsx src/components/player/NowPlayingPanel.tsx src/components/songs/SongList.test.tsx
git commit -m "feat: add song list and now playing layout"
```

---

### Task 7: Audio Player (preview) + test (play/pause UI state)

**Files:**
- Create: `src/components/player/AudioPlayer.tsx`
- Modify: `src/components/player/NowPlayingPanel.tsx`
- Test: `src/components/player/AudioPlayer.test.tsx`

- [ ] **Step 1: เขียนเทส UI play/pause (mock audio element)**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AudioPlayer } from "./AudioPlayer";

describe("AudioPlayer", () => {
  it("toggles play/pause", async () => {
    const user = userEvent.setup();
    const play = vi.fn().mockResolvedValue(undefined);
    const pause = vi.fn();

    vi.spyOn(window, "Audio").mockImplementation(() => {
      return {
        play,
        pause,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        currentTime: 0,
        src: "",
      } as any;
    });

    render(<AudioPlayer src="/audio/previews/neon-runner.mp3" />);
    await user.click(screen.getByRole("button", { name: "Play" }));
    expect(play).toHaveBeenCalled();
    await user.click(screen.getByRole("button", { name: "Pause" }));
    expect(pause).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: รันเทสให้ fail**

Run:
```bash
npm run test:run
```

Expected: FAIL เพราะยังไม่มี `AudioPlayer`

- [ ] **Step 3: Implement `AudioPlayer` แบบ minimal**

```tsx
import { useEffect, useMemo, useState } from "react";

export function AudioPlayer(props: { src: string }) {
  const audio = useMemo(() => new Audio(), []);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    audio.src = props.src;
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [audio, props.src]);

  async function onToggle() {
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      await audio.play();
      setIsPlaying(true);
    }
  }

  return (
    <div className="mt-3 flex items-center gap-2">
      <button
        type="button"
        aria-label={isPlaying ? "Pause" : "Play"}
        onClick={onToggle}
        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm"
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
      <div className="text-xs text-white/55">Preview</div>
    </div>
  );
}
```

- [ ] **Step 4: ใช้ `AudioPlayer` ใน `NowPlayingPanel`**

```tsx
import type { Song } from "../../lib/songs";
import { AudioPlayer } from "./AudioPlayer";

export function NowPlayingPanel(props: { song: Song | null }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="text-xs tracking-[0.18em] uppercase text-white/70">Now Playing</div>
      <div className="mt-3">
        {props.song ? (
          <>
            <div className="text-base font-medium">{props.song.title}</div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-white/60">
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">BPM {props.song.bpm}</span>
              <span className="rounded-full border border-white/10 bg-black/20 px-2 py-1">Key {props.song.key}</span>
            </div>
            <AudioPlayer src={props.song.previewUrl} />
          </>
        ) : (
          <div className="text-sm text-white/70">Select a song</div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: รันเทสให้ผ่าน**

Run:
```bash
npm run test:run
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/components/player/AudioPlayer.tsx src/components/player/NowPlayingPanel.tsx src/components/player/AudioPlayer.test.tsx
git commit -m "feat: add preview audio player"
```

---

### Task 8: Download CTA ใน Now Playing (ล็อกตาม Free/Pro)

**Files:**
- Modify: `src/components/player/NowPlayingPanel.tsx`

- [ ] **Step 1: Implement CTA logic**

Update `NowPlayingPanel` ให้ใช้:
- `getSession()` เพื่ออ่าน tier
- `getDownloadAction(session)` เพื่อรู้ว่ากดได้ไหม

ตัวอย่างโค้ดที่ใส่เพิ่มใน `NowPlayingPanel`:

```tsx
import { Link } from "react-router-dom";
import { getDownloadAction } from "../../lib/download";
import { getSession } from "../../lib/session";
```

และในส่วน render:

```tsx
const session = getSession();
const action = getDownloadAction(session);
```

จากนั้นแสดงปุ่ม:

```tsx
<div className="mt-4 flex flex-wrap items-center gap-2">
  {props.song ? (
    action.allowed ? (
      <a
        href={props.song.downloadUrl320}
        download
        className="rounded-xl border border-emerald-400/40 bg-emerald-400/10 px-4 py-2 text-sm"
      >
        Download 320kbps
      </a>
    ) : (
      <Link
        to="/login"
        className="rounded-xl border border-white/15 bg-white/10 px-4 py-2 text-sm"
      >
        {action.reason === "login" ? "Login to download" : "Upgrade to Pro"}
      </Link>
    )
  ) : null}
  <div className="text-xs text-white/50">Tier: {session.tier.toUpperCase()}</div>
</div>
```

- [ ] **Step 2: รัน dev เช็ค flow**

Run:
```bash
npm run dev
```

Expected:
- Logged out/Free: เห็น “Login/Upgrade”
- Pro: เห็นปุ่ม Download และกดดาวน์โหลดไฟล์ได้

- [ ] **Step 3: Commit**

```bash
git add src/components/player/NowPlayingPanel.tsx
git commit -m "feat: gate 320kbps download by membership tier"
```

---

### Task 9: เติม “บรรยากาศ banger” (UI polish) แบบ Tailwind-only

**Files:**
- Modify: `src/components/songs/SongRow.tsx`
- Modify: `src/components/layout/TopNav.tsx`
- Modify: `src/components/player/NowPlayingPanel.tsx`
- Modify: `src/routes/Home.tsx`

- [ ] **Step 1: เพิ่ม accent gradients/glow**

เพิ่ม utility เช่น:
- hover glow ด้วย `shadow-[...]`
- accent borders (emerald/cyan) เฉพาะ state สำคัญ
- typography tracking uppercase ใน section headings

- [ ] **Step 2: ตรวจ reduced motion**

หลีกเลี่ยง animation หนัก และใช้ transition สั้น ๆ

- [ ] **Step 3: รัน build**

Run:
```bash
npm run build
```

Expected: PASS

- [ ] **Step 4: Commit**

```bash
git add src/components/songs/SongRow.tsx src/components/layout/TopNav.tsx src/components/player/NowPlayingPanel.tsx src/routes/Home.tsx
git commit -m "style: dark neon polish"
```

---

### Task 10: เพิ่มไฟล์เสียงเดโม่ + ตรวจการเล่นเสียงจริง

**Files:**
- Create: `public/audio/previews/*.mp3`
- Create: `public/audio/hi320/*.mp3`

- [ ] **Step 1: เพิ่มไฟล์เสียงเดโม่อย่างน้อย 1–2 ไฟล์**

ใส่ชื่อให้ตรงกับ `songs.json` อย่างน้อย:
- `public/audio/previews/neon-runner.mp3`
- `public/audio/hi320/neon-runner-320.mp3`

- [ ] **Step 2: รัน dev และลอง play/ดาวน์โหลด**

Run:
```bash
npm run dev
```

Expected:
- Play preview ได้จริง
- Pro ดาวน์โหลดไฟล์ได้จริง

- [ ] **Step 3: Commit (ถ้าต้องการเก็บไฟล์เดโม่ใน repo)**

```bash
git add public/audio
git commit -m "chore: add demo audio assets"
```

---

## Self-Review (against spec)

- Home: มี song list + แสดง title/BPM/Key (Task 6)
- Preview player: HTMLAudioElement + play/pause (Task 7)
- Membership: Free/Pro mock localStorage (Task 3 + Task 5)
- Download 320kbps: gate ตาม tier (Task 4 + Task 8)
- Dark theme high-energy: Tailwind + gradients/glow (Task 1 + Task 9)
- Data: static JSON (Task 2)

