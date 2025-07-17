# Mahabote Astrology - SlipOK Integration

## การแก้ไขปัญหา "duplex option is required" บน Vercel

### ปัญหาที่พบ:
- Node.js 18+ ต้องการ `duplex: 'half'` option เมื่อส่ง body ใน fetch
- Vercel Functions ล้มเหลวด้วย error: "RequestInit: duplex option is required when sending a body"

### การแก้ไข:
1. สร้าง API routes หลายตัวเพื่อจัดการ multipart data
2. เพิ่ม `duplex: 'half'` ใน fetch options
3. ใช้ Buffer และ Uint8Array สำหรับ body data
4. เพิ่ม error handling และ logging

## API Routes Available

### `/api/verify-slip-v3.ts` (แนะนำ)
- ใช้ Buffer collection จาก request
- รองรับ Node.js 18+ duplex requirement
- Error handling ครอบคลุม

### `/api/verify-slip-v2.ts` (ทางเลือก)
- ใช้ multiparty library
- Parse multipart form data
- สร้าง FormData ใหม่สำหรับ SlipOK API

### `/api/verify-slip.ts` (เดิม)
- ใช้ ReadableStream
- อาจยังมีปัญหาบางกรณี

## การ Deploy บน Vercel

### ขั้นตอนที่ 1: Push โค้ดล่าสุด
```bash
git add .
git commit -m "Fix duplex option error for Node.js 18+ on Vercel"
git push origin main
```

### ขั้นตอนที่ 2: ตรวจสอบ Environment Variables
- `SLIPOK_API_KEY` = `SLIPOKE0ICAL1`
- `SLIPOK_BRANCH_ID` = `49571`

### ขั้นตอนที่ 3: Deploy
Deploy จะทำงานอัตโนมัติจาก GitHub หรือใช้:
```bash
vercel --prod
```

## การทดสอบ

### ตรวจสอบ API Response:
1. เปิด Developer Tools (F12)
2. ไปที่ Console tab
3. ทดสอบอัปโหลดสลิป
4. ดู logs:
   - `Verifying slip with SlipOK API:` - ข้อมูลที่ส่ง
   - `SlipOK API Response Status:` - HTTP status
   - `SlipOK API Response Data:` - ผลลัพธ์จาก API

### Expected Success Response:
```json
{
  "success": true,
  "data": {
    "success": true,
    // ... other SlipOK response data
  }
}
```

### Expected Error Responses:
```json
{
  "success": false,
  "code": 1013,
  "message": "The amount sent is not the same with the amount of the slip"
}
```

## SlipOK Error Codes
- `1001`: No branch found (ตรวจสอบ BRANCH_ID)
- `1002`: Incorrect Authorization Header (ตรวจสอบ API_KEY)
- `1005`: Not image file
- `1006`: Incorrect image
- `1007`: No QR Code image
- `1012`: Repeated slip (สลิปถูกใช้แล้ว)
- `1013`: Amount mismatch (ยอดเงินไม่ตรง)

## การ Debug บน Vercel

### ดู Function Logs:
1. เข้า Vercel Dashboard
2. เลือกโปรเจค
3. ไปที่ Functions tab
4. เลือก function ที่ต้องการดู logs
5. ดู Real-time logs

### Common Issues:
- **500 Error**: ตรวจสอบ Environment Variables
- **404 Error**: ตรวจสอบ API route path
- **CORS Error**: ตรวจสอบ CORS headers
- **Timeout**: เพิ่ม maxDuration ใน vercel.json
