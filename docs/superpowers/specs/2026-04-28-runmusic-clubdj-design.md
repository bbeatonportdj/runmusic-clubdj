# RunMusic-ClubDj — Design (MVP)

## 1) เป้าหมาย

- สร้างเว็บ RunMusic-ClubDj โทน Dark Theme high-energy (inspired vibe) ด้วย React + Tailwind CSS
- หน้าแรกมีรายการเพลง (Song List) แสดง Song Name, BPM, Key และกดฟังตัวอย่างได้
- มี Audio Player สำหรับฟังตัวอย่างเพลง (preview)
- ระบบสมาชิก 2 ระดับ (Free/Pro)
  - Free: ฟัง preview ได้
  - Pro: ดาวน์โหลดไฟล์คุณภาพสูง 320kbps ได้

## 2) ขอบเขตงาน (MVP)

### In-scope (ทำในรอบแรก)

- UI หน้า Home แบบ Hybrid “Split View (B) + Visual Cards (C)”
  - Desktop: ซ้ายเป็น Song List, ขวาเป็น Now Playing + รายละเอียด + ปุ่มดาวน์โหลด
  - Mobile: Song List ก่อน แล้วเปิดแผง Player/Details แบบ bottom sheet หรือหน้ารายละเอียด
- ข้อมูลเพลงแบบง่ายที่สุด: static JSON ภายในโปรเจกต์
- ไฟล์เสียง
  - preview: ไฟล์เสียงสั้น/ตัวอย่าง อยู่ในโปรเจกต์ (หรือ public assets)
  - 320kbps: ไฟล์ placeholder อยู่ในโปรเจกต์เพื่อเดโม่การดาวน์โหลด
- Auth แบบง่าย (frontend-only)
  - login mock: เก็บสถานะ user และ pro ใน localStorage
  - UI แสดงสิทธิ์การดาวน์โหลดตามสถานะ
- ระบบค้นหา/กรองขั้นพื้นฐาน
  - search by song name
  - filter by BPM range (optional ใน MVP ถ้าทัน)
  - filter by Key (optional ใน MVP ถ้าทัน)

### Out-of-scope (ยังไม่ทำในรอบแรก)

- Backend จริง, database, admin dashboard, upload เพลง, payment, signed URL
- การป้องกันดาวน์โหลดแบบ “ล็อกจริง” (ใน MVP จะเป็นการล็อกเชิง UI/UX เท่านั้น)
- Analytics, ระบบโควต้า/จำกัดดาวน์โหลด, watermark, DRM

## 3) แนวทางโครงสร้างระบบ (เพื่ออัปเกรดไปของจริงภายหลัง)

- แยกส่วน “การอนุญาตให้ดาวน์โหลด” ออกเป็น service ชั้นเดียว (เช่น `entitlements`)
  - วันนี้อ่านจาก localStorage
  - ภายหลังสลับไปอ่านจาก Auth provider / API ได้โดย UI ไม่ต้องเปลี่ยน
- แยก data layer สำหรับ `songs` ออกเป็น datasource
  - วันนี้อ่านจาก `songs.json`
  - ภายหลังเปลี่ยนเป็น `GET /songs` ได้

## 4) Information Architecture

- `/` Home
  - Song List + Search/Filters
  - Now Playing panel (player + metadata + download CTA)
- `/login` (mock)
  - กด Login เพื่อจำลอง session
  - toggle เป็น Pro (เพื่อเดโม่)
- `/account` (optional ใน MVP)
  - แสดงสถานะ Free/Pro และปุ่ม Logout

## 5) UI/UX ดีไซน์

### 5.1 Visual Language

- Background: deep black/blue + radial gradients
- Accent: neon green + neon cyan (ใช้เป็น highlights, focus, progress)
- Surfaces: glassy cards (semi-transparent), thin borders, subtle glow
- Typography: modern sans (system) + letter spacing แบบ club UI

### 5.2 หน้า Home (Hybrid B + C)

#### Left: Song List

- แต่ละแถวเป็น “card row” ที่อ่านง่าย
  - Title
  - BPM badge
  - Key badge
  - actions: Preview / Select
- รองรับ keyboard navigation (focus ring ชัด)

#### Right: Now Playing / Details

- Track title, BPM, Key, tags (optional)
- Audio player controls
  - play/pause
  - scrub/progress
  - duration/current time (ถ้าทำทัน)
  - volume (optional)
- Download section
  - ถ้าเป็น Free: แสดง CTA “Upgrade to Pro” / “Login”
  - ถ้าเป็น Pro: ปุ่ม “Download 320kbps”

### 5.3 Sticky/Bottom Player (Mobile)

- เมื่อเลือกเพลง แสดง player แบบ bottom sheet
- คงปุ่ม Download / Upgrade ให้อยู่ใน viewport เสมอ

## 6) Data Model (MVP)

### Song

- `id`: string
- `title`: string
- `bpm`: number
- `key`: string (เช่น `8A`, `6B`, หรือ `Am`)
- `previewUrl`: string (path ใน `public/`)
- `downloadUrl320`: string (path ใน `public/`)
- `artwork` (optional): สี/gradient seed หรือ URL (MVP ใช้ gradient)

### Session (Mock)

- `isLoggedIn`: boolean
- `tier`: `free | pro`

## 7) Behavior Specs

- เลือกเพลงจาก list → set เป็น current track → player โหลด previewUrl
- ถ้า track เปลี่ยนระหว่างเล่น
  - pause แล้วเริ่มเล่นใหม่ (หรือ autoplay ตาม config)
- กด Download
  - ถ้า `tier !== pro` → เปิด modal/route ไป login/upgrade
  - ถ้า `tier === pro` → trigger download ของไฟล์ 320kbps (anchor download)

## 8) Accessibility / Quality Bar

- สี contrast สำหรับ text/badges ไม่ต่ำเกินไป
- focus-visible ชัดทุก interactive element
- ปุ่ม player มี label ชัด (aria-label)
- รองรับ reduced motion (animation เล็กน้อยและไม่รบกวน)

## 9) Tech Stack / Tooling

- React + Tailwind CSS
- Build tool: เลือกตามสิ่งที่มีใน repo (ถ้ายังไม่มี แนะนำ Vite)
- Audio: HTMLAudioElement (ไม่พึ่ง lib ภายนอกใน MVP)

## 10) Acceptance Criteria (MVP)

- เปิดหน้า Home เห็นรายการเพลงอย่างน้อย 10 เพลง พร้อม BPM/Key
- กดเลือกเพลงแล้วเล่น preview ได้ (play/pause ทำงาน)
- ระบบ Login mock เปลี่ยนสถานะ Free/Pro ได้
- ปุ่ม Download 320kbps ใช้งานได้เมื่อเป็น Pro และถูกล็อกเมื่อเป็น Free

