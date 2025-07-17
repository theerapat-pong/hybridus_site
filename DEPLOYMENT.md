# Mahabote Astrology - SlipOK Integration

## การแก้ไขปัญหา Dependency Conflict

### ปัญหาที่พบ:
- React 19 ไม่รองรับ qrcode.react
- Vercel deployment ล้มเหลวเนื่องจาก ERESOLVE error

### การแก้ไข:
1. เปลี่ยนจาก `qrcode.react` เป็น `qrcode`
2. สร้าง QRCodeComponent ใหม่
3. เพิ่ม `.npmrc` สำหรับ legacy-peer-deps
4. ปรับปรุง vercel.json

## การ Deploy บน Vercel

### ขั้นตอนที่ 1: ตรวจสอบไฟล์
```bash
# ตรวจสอบว่าไฟล์เหล่านี้มีอยู่:
- .npmrc
- vercel.json
- api/verify-slip.ts
```

### ขั้นตอนที่ 2: ตั้งค่า Environment Variables บน Vercel
1. เข้า Vercel Dashboard
2. เลือกโปรเจค
3. ไป Settings > Environment Variables
4. เพิ่มตัวแปร:
   - `SLIPOK_API_KEY` = `SLIPOKE0ICAL1`
   - `SLIPOK_BRANCH_ID` = `49571`

### ขั้นตอนที่ 3: Deploy
```bash
# ผ่าน Git (แนะนำ)
git add .
git commit -m "Fix dependency conflicts and SlipOK integration"
git push

# หรือผ่าน Vercel CLI
vercel --prod
```

## การทดสอบ

### Local Testing:
```bash
npm run dev
# เปิด http://localhost:5173/test-slip.html
```

### Production Testing:
1. อัปโหลดสลิปการโอนเงิน
2. ใส่จำนวนเงินที่ตรงกับสลิป
3. ตรวจสอบ Console ใน Developer Tools
4. ดู Vercel Functions logs ใน Dashboard

## API Endpoints

- `/api/verify-slip` - Production API for slip verification
- `/api/debug-slip` - Debug API with extended logging
- `/api/verify-slip-prod` - Production API with environment variables

## SlipOK API Configuration

```
API URL: https://api.slipok.com/api/line/apikey/49571
API Key: SLIPOKE0ICAL1
Branch ID: 49571
```

## Error Handling

API จะส่งกลับ error codes:
- 1001: No branch found
- 1002: Incorrect Authorization Header
- 1005: Not image file
- 1006: Incorrect image
- 1007: No QR Code image
- 1012: Repeated slip
- 1013: Amount mismatch
