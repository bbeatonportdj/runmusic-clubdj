# RunMusic-ClubDj Admin Upload Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** เพิ่มหน้า `/admin` สำหรับแอดมินเพื่อเพิ่มเพลงใหม่ (metadata + ลิงก์/ไฟล์ไอดี Google Drive) และ export/import `songs.json` สำหรับรีดีพลอย

**Architecture:** Frontend-only: Admin gate เป็น mock (localStorage) + staging list เก็บใน state (และ persist ใน localStorage เพื่อกันข้อมูลหาย). มี utility สำหรับ parse/normalize Google Drive URL/ID เป็น direct link รูปแบบ `uc?export=download&id=...`. Export ทำผ่านการสร้าง Blob แล้ว trigger download.

**Tech Stack:** React, TypeScript, react-router-dom, Tailwind CSS, Vitest

---

## File Structure (ที่จะสร้าง/แก้)

**Create**
- `src/lib/admin.ts`
- `src/lib/drive.ts`
- `src/lib/jsonExport.ts`
- `src/routes/Admin.tsx`
- `src/routes/NotAuthorized.tsx` (หรือรวมไว้ใน Admin page ก็ได้ แต่แยกจะอ่านง่าย)
- `src/components/admin/AdminSongForm.tsx`
- `src/components/admin/AdminSongTable.tsx`
- `src/components/admin/AdminImportExport.tsx`
- `src/lib/drive.test.ts`
- `src/lib/admin.test.ts`
- `src/lib/jsonExport.test.ts`

**Modify**
- `src/App.tsx`
- `src/components/layout/TopNav.tsx` (เลือกว่าจะโชว์ลิงก์ Admin เฉพาะเมื่อเป็น admin)
- `src/routes/Account.tsx` (เพิ่ม toggle “Enable Admin Mode”)
- `src/lib/songs.ts` (เพิ่ม `SongInput` type helper ถ้าจำเป็น)

---

### Task 1: Admin mode (mock) + hook สำหรับอ่านสถานะ admin

**Files:**
- Create: `src/lib/admin.ts`
- Test: `src/lib/admin.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { beforeEach, describe, expect, it } from "vitest";
import { disableAdminMode, enableAdminMode, getIsAdmin } from "./admin";

describe("admin mode", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("defaults to false", () => {
    expect(getIsAdmin()).toBe(false);
  });

  it("enable/disable toggles value", () => {
    enableAdminMode();
    expect(getIsAdmin()).toBe(true);
    disableAdminMode();
    expect(getIsAdmin()).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests to verify RED**

Run:
```bash
npx vitest run src/lib/admin.test.ts
```

Expected: FAIL (module not found)

- [ ] **Step 3: Minimal implementation**

```ts
const KEY = "rmcdj_admin_mode_v1";

export function getIsAdmin(): boolean {
  return localStorage.getItem(KEY) === "true";
}

export function enableAdminMode() {
  localStorage.setItem(KEY, "true");
}

export function disableAdminMode() {
  localStorage.removeItem(KEY);
}
```

- [ ] **Step 4: Run tests to verify GREEN**

Run:
```bash
npx vitest run src/lib/admin.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/admin.ts src/lib/admin.test.ts
git commit -m "feat: add admin mode (mock)"
```

---

### Task 2: Google Drive link parsing + normalization (URL หรือ File ID → direct link)

**Files:**
- Create: `src/lib/drive.ts`
- Test: `src/lib/drive.test.ts`

- [ ] **Step 1: Write failing tests**

```ts
import { describe, expect, it } from "vitest";
import { extractDriveFileId, toDriveDirectDownloadUrl } from "./drive";

describe("drive link handling", () => {
  it("accepts a file id", () => {
    expect(extractDriveFileId("1AbC")).toBe("1AbC");
  });

  it("extracts id from /file/d/<id>/view", () => {
    expect(extractDriveFileId("https://drive.google.com/file/d/1AAA/view?usp=sharing")).toBe("1AAA");
  });

  it("extracts id from open?id=", () => {
    expect(extractDriveFileId("https://drive.google.com/open?id=1BBB")).toBe("1BBB");
  });

  it("extracts id from uc?id=", () => {
    expect(extractDriveFileId("https://drive.google.com/uc?id=1CCC&export=download")).toBe("1CCC");
  });

  it("builds direct download url", () => {
    expect(toDriveDirectDownloadUrl("1ZZZ")).toBe("https://drive.google.com/uc?export=download&id=1ZZZ");
  });
});
```

- [ ] **Step 2: Verify RED**

Run:
```bash
npx vitest run src/lib/drive.test.ts
```

Expected: FAIL

- [ ] **Step 3: Minimal implementation**

```ts
const FILE_ID_RE = /^[a-zA-Z0-9_-]{10,}$/;

export function extractDriveFileId(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (FILE_ID_RE.test(s) && !s.startsWith("http")) return s;

  try {
    const u = new URL(s);
    const idParam = u.searchParams.get("id");
    if (idParam && FILE_ID_RE.test(idParam)) return idParam;

    const m = u.pathname.match(/\/file\/d\/([^/]+)\//);
    if (m?.[1] && FILE_ID_RE.test(m[1])) return m[1];

    const idParam2 = u.searchParams.get("id");
    if (idParam2 && FILE_ID_RE.test(idParam2)) return idParam2;

    const ucId = u.searchParams.get("id");
    if (ucId && FILE_ID_RE.test(ucId)) return ucId;
  } catch {}

  return null;
}

export function toDriveDirectDownloadUrl(idOrUrl: string): string | null {
  const id = extractDriveFileId(idOrUrl);
  if (!id) return null;
  return `https://drive.google.com/uc?export=download&id=${id}`;
}
```

- [ ] **Step 4: Verify GREEN**

Run:
```bash
npx vitest run src/lib/drive.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/drive.ts src/lib/drive.test.ts
git commit -m "feat: add google drive url normalization"
```

---

### Task 3: JSON export helper (Blob → download)

**Files:**
- Create: `src/lib/jsonExport.ts`
- Test: `src/lib/jsonExport.test.ts`

- [ ] **Step 1: Write failing tests (pure function)**

```ts
import { describe, expect, it } from "vitest";
import { toPrettyJson } from "./jsonExport";

describe("toPrettyJson", () => {
  it("serializes with 2-space indent and trailing newline", () => {
    const s = toPrettyJson([{ a: 1 }]);
    expect(s).toBe('[\\n  {\\n    \"a\": 1\\n  }\\n]\\n');
  });
});
```

- [ ] **Step 2: Verify RED**

Run:
```bash
npx vitest run src/lib/jsonExport.test.ts
```

Expected: FAIL

- [ ] **Step 3: Minimal implementation**

```ts
export function toPrettyJson(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}
```

- [ ] **Step 4: Verify GREEN**

Run:
```bash
npx vitest run src/lib/jsonExport.test.ts
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/jsonExport.ts src/lib/jsonExport.test.ts
git commit -m "feat: add json export helper"
```

---

### Task 4: Admin route + guard (not authorized state)

**Files:**
- Create: `src/routes/Admin.tsx`
- Create: `src/routes/NotAuthorized.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 1: Create NotAuthorized**

```tsx
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
```

- [ ] **Step 2: Create Admin route skeleton**

```tsx
import { NotAuthorized } from "./NotAuthorized";
import { getIsAdmin } from "../lib/admin";

export function Admin() {
  if (!getIsAdmin()) {
    return <NotAuthorized title="Not authorized" hint="Enable Admin Mode to access /admin" />;
  }
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-6">
      <h1 className="text-xl font-semibold tracking-tight">Admin</h1>
    </div>
  );
}
```

- [ ] **Step 3: Wire route in App**

Update `src/App.tsx` routes:
```tsx
import { Admin } from "./routes/Admin";
...
<Route path="/admin" element={<Admin />} />
```

- [ ] **Step 4: Verify manually**

Run:
```bash
npm run dev
```

Expected:
- ไป `/admin` แล้วเห็น Not authorized

- [ ] **Step 5: Commit**

```bash
git add src/routes/Admin.tsx src/routes/NotAuthorized.tsx src/App.tsx
git commit -m "feat: add admin route with mock guard"
```

---

### Task 5: เพิ่ม toggle “Admin Mode” ในหน้า Account

**Files:**
- Modify: `src/routes/Account.tsx`

- [ ] **Step 1: Add toggle buttons**

เพิ่ม imports:
```tsx
import { disableAdminMode, enableAdminMode, getIsAdmin } from "../lib/admin";
```

เพิ่ม UI:
```tsx
const isAdmin = getIsAdmin();
...
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
```

- [ ] **Step 2: Verify manually**

Expected:
- กด Enable แล้วไป `/admin` ได้

- [ ] **Step 3: Commit**

```bash
git add src/routes/Account.tsx
git commit -m "feat: add admin mode toggle in account"
```

---

### Task 6: Admin UI — Song form + staging list + validation

**Files:**
- Create: `src/components/admin/AdminSongForm.tsx`
- Create: `src/components/admin/AdminSongTable.tsx`
- Modify: `src/routes/Admin.tsx`

- [ ] **Step 1: Implement helpers in Admin route**

ใน `Admin.tsx`:
- โหลด songs เริ่มต้นจาก `getSongs()`
- เก็บ staging เป็น `useState<Song[]>`
- Persist staging ลง localStorage เช่น `rmcdj_admin_staging_v1`

- [ ] **Step 2: AdminSongForm (controlled form)**

Fields:
- Title (string)
- BPM (number)
- Key (string)
- Preview input (string: URL หรือ File ID)
- 320 input (string: URL หรือ File ID)

On submit:
- validate ตาม spec
- สร้าง `id` จาก title (slug) + de-dup suffix
- แปลง preview/download ด้วย `toDriveDirectDownloadUrl(...)` ถ้าแปลงไม่ได้ให้ error
- push เข้า staging list

- [ ] **Step 3: AdminSongTable**

- แสดง table rows ของ staging: title/bpm/key + ลิงก์ preview/320
- ปุ่ม Remove ต่อแถว

- [ ] **Step 4: Verify manually**

Expected:
- เพิ่มเพลงแล้วเห็นในตาราง
- ลิงก์ที่กรอกเป็น “File ID” ถูกแปลงเป็น `uc?export=download&id=...`

- [ ] **Step 5: Commit**

```bash
git add src/routes/Admin.tsx src/components/admin/AdminSongForm.tsx src/components/admin/AdminSongTable.tsx
git commit -m "feat: admin staging song list"
```

---

### Task 7: Import/Export `songs.json` (download + upload)

**Files:**
- Create: `src/components/admin/AdminImportExport.tsx`
- Modify: `src/routes/Admin.tsx`

- [ ] **Step 1: Export**

- ใช้ `toPrettyJson(stagingSongs)` และสร้าง `Blob`
- สร้าง `a.href = URL.createObjectURL(blob)` + `download="songs.json"`
- click แล้ว revoke

- [ ] **Step 2: Import**

- `<input type="file" accept="application/json">`
- อ่านไฟล์ด้วย `file.text()` แล้ว parse เป็น array
- basic validate structure แล้ว set เป็น staging

- [ ] **Step 3: Verify manually**

Expected:
- export ได้ไฟล์ `songs.json`
- import ไฟล์เดิมกลับมาแล้วตารางแสดงรายการ

- [ ] **Step 4: Commit**

```bash
git add src/components/admin/AdminImportExport.tsx src/routes/Admin.tsx
git commit -m "feat: admin import/export songs.json"
```

---

### Task 8: UI polish + TopNav behavior

**Files:**
- Modify: `src/components/layout/TopNav.tsx`

- [ ] **Step 1: แสดงลิงก์ Admin เฉพาะเมื่อเป็น admin**

- import `getIsAdmin()` แล้วแสดง `<NavLink to="/admin">Admin</NavLink>` เฉพาะเมื่อ true

- [ ] **Step 2: Verify manually**

Expected:
- ไม่เป็น admin: ไม่เห็นเมนู Admin
- เป็น admin: เห็นเมนู Admin

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/TopNav.tsx
git commit -m "feat: show admin nav link only for admin mode"
```

---

## Self-Review (against spec)

- `/admin` guarded ด้วย admin mode mock (Task 4 + 5)
- รองรับ URL/ไฟล์ไอดี Drive และแปลงเป็น direct link (Task 2)
- มี staging list + เพิ่ม/ลบ (Task 6)
- Export/Import songs.json (Task 7)
- ปุ่ม Open Drive Folder ใช้ URL ที่กำหนดใน spec (Task 6 UI)

