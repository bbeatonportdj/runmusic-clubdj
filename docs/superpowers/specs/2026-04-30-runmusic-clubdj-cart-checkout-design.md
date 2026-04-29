# RunMusic-ClubDj — Cart + Mock Checkout + Entitlements (Prototype Design)

## 1) เป้าหมาย

- ทำระบบขายเพลงสำหรับดีเจแบบ Prototype (frontend-only) ให้ UX ครบ: Preview → Add to Cart / Upgrade Pro → Mock Checkout → Download HQ
- รองรับโมเดลรายได้ 2 แบบในแอปเดียว
  - ซื้อเป็นเพลง (one-time purchase ต่อแทร็ก ผ่านตะกร้า)
  - สมาชิก Pro (subscription concept) เพื่อปลดล็อกดาวน์โหลดทุกเพลง
- ยังไม่ผูก Payment จริง/Backend/Database (เก็บสถานะด้วย localStorage)

## 2) ขอบเขตงาน (Prototype)

### In-scope

- ตะกร้าสินค้า (Cart) สำหรับ “ซื้อเป็นเพลง”
- Mock Checkout 2 โหมด
  - Checkout เพลงในตะกร้า → บันทึกสิทธิ์ว่าเพลงถูกซื้อแล้ว
  - Upgrade เป็น Pro → ตั้งค่า tier เป็น `pro`
- Entitlements สำหรับปลดล็อกดาวน์โหลด
  - ถ้าเป็น Pro ดาวน์โหลดได้ทุกเพลง
  - ถ้าไม่ใช่ Pro ดาวน์โหลดได้เฉพาะเพลงที่ซื้อแล้ว
- UI actions ในหน้า Home/Now Playing ให้ไหลลื่นตาม flow
  - Preview (ฟรี)
  - Add/Remove cart
  - Download CTA แสดงสถานะตามสิทธิ์ (login/ซื้อ/อัปเกรด)

### Out-of-scope

- Stripe/PromptPay/Payment gateway จริง
- Backend API / Webhook / Signed URL / DRM
- ระบบ user จริง (ใช้ session mock ใน localStorage)

## 3) แนวทางสถาปัตยกรรม (เพื่ออัปเกรดเป็นของจริงภายหลัง)

- แยก “การตัดสินใจว่าสามารถดาวน์โหลดได้ไหม” ออกจาก UI
  - วันนี้อ่านจาก localStorage
  - อนาคตสลับเป็นอ่านจาก API/DB ได้โดยกระทบ UI ต่ำ
- แยก state เป็น store เล็ก ๆ ที่ subscribe ได้ (pattern เดียวกับ session)

## 4) Information Architecture / Routes

- `/` Home
  - Song List + Now Playing (มีอยู่แล้ว)
  - เพิ่มปุ่ม Add to Cart / Download / Upgrade CTA ตามสิทธิ์
- `/cart`
  - รายการเพลงในตะกร้า, จำนวน, ยอดรวม (mock), ปุ่ม “Checkout”
- `/checkout`
  - Mock Checkout flow
  - โหมด `purchase` (ซื้อเพลงในตะกร้า)
  - โหมด `upgrade` (อัปเกรดเป็น Pro)
- `/account`
  - แสดง tier + เพลงที่ซื้อแล้ว (สำหรับ debug/ความชัดเจนใน prototype)

## 5) Data Model

### 5.1 Song (คงของเดิม)

อ้างอิง type ใน `src/lib/songs.ts`

- `id`: string
- `title`: string
- `bpm`: number
- `key`: string
- `previewUrl`: string
- `downloadUrl320`: string

### 5.2 Session (มีอยู่แล้ว)

อ้างอิง `src/lib/session.ts`

- `isLoggedIn`: boolean
- `tier`: `"free" | "pro"`

### 5.3 Cart (เพิ่มใหม่)

- `songIds`: string[]
- Storage key: `rmcdj_cart_v1`

Actions

- `addToCart(songId)`
- `removeFromCart(songId)`
- `clearCart()`

### 5.4 Entitlements (เพิ่มใหม่)

- `purchasedSongIds`: string[]
- Storage key: `rmcdj_entitlements_v1`

Actions

- `grantPurchasedSongs(songIds)`
- `hasPurchasedSong(songId)`
- `clearPurchases()` (optional, เพื่อ debug)

## 6) กติกา (Business Rules)

### 6.1 Download eligibility (HQ/320)

ผลลัพธ์ควรให้ UI ใช้ตัดสินใจได้ เช่น `allowed/reason`

- ถ้า `!session.isLoggedIn` → ไม่อนุญาต (reason: `login`)
- ถ้า `session.tier === "pro"` → อนุญาต
- ถ้า `purchasedSongIds` มี `songId` → อนุญาต
- อย่างอื่น → ไม่อนุญาต (reason: `purchase_or_upgrade`)

### 6.2 Checkout flows

- Purchase (Cart)
  - เงื่อนไข: ต้อง login
  - เมื่อ “จ่ายสำเร็จ (mock)”:
    - เพิ่มเพลงทั้งหมดใน cart ไปที่ `purchasedSongIds`
    - clear cart
    - พาไป Home/Account พร้อมข้อความสำเร็จ (ถ้ามี)
- Upgrade Pro
  - เงื่อนไข: ต้อง login
  - เมื่อ “จ่ายสำเร็จ (mock)”:
    - set tier เป็น `pro`

## 7) UI/UX Behavior Specs

### 7.1 หน้า Home / Now Playing

- Preview ใช้ `previewUrl` และเล่นได้ไม่ต้อง login
- ปุ่ม Add to Cart
  - อนุญาตให้ add ได้แม้ยังไม่ login (เพื่อให้เลือกเพลงได้ลื่น)
  - บังคับ login ตอนกด Checkout หรือกด Pay (mock)
  - กดแล้วสถานะเปลี่ยน (In cart) และไปหน้า `/cart` ได้
- ปุ่ม Download HQ
  - ถ้า allowed: trigger ดาวน์โหลด `downloadUrl320`
  - ถ้าไม่ allowed:
    - reason `login` → ลิงก์ไป `/login` หรือแสดง prompt (ขึ้นกับของเดิม)
    - reason `purchase_or_upgrade` → แสดง CTA 2 ทาง: ไป cart หรือ upgrade Pro

### 7.2 หน้า Cart

- แสดงรายการเพลงในตะกร้า (title/bpm/key)
- Remove item ได้
- CTA:
  - “Checkout เพลงในตะกร้า” → ไป `/checkout?mode=purchase`
  - “Upgrade เป็น Pro” → ไป `/checkout?mode=upgrade`

### 7.3 หน้า Checkout (Mock)

- แสดง summary ตาม mode
- ปุ่ม “Pay (Mock)” ทำการเปลี่ยน state ตามข้อ 6.2

## 8) Error Handling / Edge Cases

- ถ้าใน cart มี songId ที่หาไม่เจอใน `songs.json` ให้ข้ามและแสดงรายการที่เหลือ
- ป้องกันค่าซ้ำใน `songIds` และ `purchasedSongIds`
- ถ้า localStorage อ่านไม่ได้ (เช่น blocked) ให้ fallback เป็น in-memory ค่าเริ่มต้น (เหมือน session)

## 9) Acceptance Criteria (Prototype)

- เพิ่มเพลงลงตะกร้าได้จากหน้า Home และเห็นใน `/cart`
- Checkout เพลงแบบ mock แล้วดาวน์โหลด HQ ได้เฉพาะเพลงที่ซื้อ (แม้ยังเป็น Free)
- Upgrade เป็น Pro แบบ mock แล้วดาวน์โหลด HQ ได้ทุกเพลง
- สิทธิ์การดาวน์โหลดคงอยู่หลัง refresh (localStorage)
