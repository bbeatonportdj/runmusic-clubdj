# RunMusic-ClubDj — Admin Upload (Google Drive + Export songs.json)

## 1) Goal

- เพิ่มระบบจัดการ “เพิ่มเพลงใหม่” สำหรับแอดมินผ่านหน้า `/admin`
- เก็บไฟล์เพลงบน Google Drive (อัปไฟล์ใน Drive ด้วยมือ)
- เว็บช่วยสร้าง/ตรวจข้อมูล + แปลงลิงก์ Drive ให้ใช้กับเว็บ + Export เป็น `songs.json` เพื่อรีดีพลอย

## 2) Scope

### In-scope (MVP)

- Route `/admin` พร้อม UI เพิ่มเพลงใหม่ + รายการเพลงที่เตรียม export (staging)
- Admin gate แบบ mock (localStorage) เพื่อซ่อน/กันการเข้าถึง `/admin` เชิง UX
- รองรับการใส่ URL/ไฟล์ไอดีของ Google Drive สำหรับ:
  - preview (ตัวอย่าง)
  - 320kbps (ดาวน์โหลด)
- Export `songs.json` (download file) เพื่อนำไปแทนที่ `src/data/songs.json`
- Import `songs.json` เพื่อโหลดรายการเดิมเข้า staging (optional แต่ช่วย workflow)

### Out-of-scope

- อัปโหลดไฟล์ขึ้น Drive ผ่าน API (ไม่มี OAuth/Service Account)
- Backend/Database/ระบบสิทธิ์จริง (security-grade)
- ทำให้เพลง “เห็นกับทุกคนทันที” โดยไม่รีดีพลอย

## 3) Default Google Drive Folder

- ใช้เป็น default สำหรับปุ่ม “Open Drive Folder”
- URL:
  - `https://drive.google.com/drive/u/1/folders/1JtrF35u5EncDBNgbhRimoS8-RXdIIaOW`

## 4) User Experience

### 4.1 Admin Mode (Mock)

- เก็บ flag ใน localStorage เช่น `rmcdj_admin_mode_v1 = true`
- เงื่อนไข:
  - ถ้าไม่เป็น admin: route `/admin` แสดงข้อความ “Not authorized” + ปุ่มไป `/login` หรือกลับหน้าแรก
  - ถ้าเป็น admin: แสดง UI ทั้งหมด

### 4.2 Add Song Flow

1) แอดมินเปิด `/admin`
2) กด “Open Drive Folder” → อัปไฟล์ (preview + 320) ในโฟลเดอร์ Drive
3) กลับมาใส่ข้อมูลเพลง:
   - Title
   - BPM
   - Key
   - Preview (วาง URL หรือ File ID)
   - 320kbps (วาง URL หรือ File ID)
4) กด “Add to staging” → เพลงถูกเพิ่มเข้า staging list
5) กด “Export songs.json” → ได้ไฟล์ JSON ดาวน์โหลด
6) แอดมินแทนที่ `src/data/songs.json` แล้ว deploy

### 4.3 Staging List

- แสดงรายการเพลงที่กำลังจะ export (รวมของเดิม + ของใหม่)
- actions:
  - Edit (inline หรือ dialog)
  - Remove
  - Duplicate (optional)

## 5) Data Model

### 5.1 Song (คง format เดิม)

- `id`: string (slug จาก title; ถ้าซ้ำให้เติม suffix เช่น `-2`, `-3`)
- `title`: string
- `bpm`: number
- `key`: string
- `previewUrl`: string
- `downloadUrl320`: string

### 5.2 Admin Staging State

- เก็บใน memory ขณะใช้งานหน้า `/admin`
- (optional) persist ลง localStorage เพื่อกันรีเฟรชแล้วข้อมูลหาย

## 6) Google Drive Link Handling

### 6.1 Acceptable Inputs

- Share URL เช่น:
  - `https://drive.google.com/file/d/<FILE_ID>/view?usp=sharing`
  - `https://drive.google.com/open?id=<FILE_ID>`
  - `https://drive.google.com/uc?id=<FILE_ID>&export=download`
- File ID เพียว ๆ เช่น `1AbC...`

### 6.2 Normalization Output

- แปลงเป็นรูปแบบ:
  - `https://drive.google.com/uc?export=download&id=<FILE_ID>`

### 6.3 Validation Rules

- Title ต้องไม่ว่าง
- BPM ต้องเป็นเลขและอยู่ในช่วงสมเหตุสมผล (เช่น 40–220)
- Key ต้องไม่ว่าง
- preview/download ต้องมีอย่างน้อยอย่างละ 1 ค่า (URL หรือ ID)

### 6.4 Known Limitations

- บางเคส Google Drive อาจมีข้อจำกัดเรื่องการเล่นไฟล์ผ่าน `<audio>` หรือ redirect/CORS
- MVP เน้นให้ “มีลิงก์ดาวน์โหลดได้” และ “preview ทำงานเมื่อ Drive อนุญาต”
- แผนสำรอง: ให้ preview ใช้ไฟล์ local/public แต่ 320kbps ยังเป็น Drive

## 7) Routing / Pages

- `/admin`
  - guarded route
  - ฟอร์ม Add Song + staging list + import/export

## 8) Acceptance Criteria

- เข้า `/admin` แบบไม่เป็น admin เห็นข้อความไม่อนุญาต
- เข้า `/admin` แบบ admin สามารถ:
  - เพิ่มเพลงใหม่ด้วย title/bpm/key + ใส่ลิงก์/ไอดี Drive ได้
  - เพลงถูกเพิ่มใน staging list
  - Export `songs.json` และนำไปแทนที่ `src/data/songs.json` ได้
- Home page แสดงเพลงที่เพิ่มใหม่หลัง build/deploy ใหม่

