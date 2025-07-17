# การแก้ไขปัญหา SlipOK API บน Vercel

## 🔍 ปัญหาที่พบ:
```
RequestInit: duplex option is required when sending a body.
```

## ✅ การแก้ไข:

### 1. เพิ่ม `duplex: 'half'` ใน fetch options
```typescript
const response = await fetch(SLIPOK_API_URL, {
  method: 'POST',
  headers: {
    'x-authorization': SLIPOK_API_KEY,
    'content-type': contentType,
  },
  body: bodyData,
  duplex: 'half', // Required for Node.js 18+
} as RequestInit);
```

### 2. สร้าง API Routes หลายตัว:
- `/api/verify-slip-v3.ts` ✅ (แนะนำ) - ใช้ Buffer collection
- `/api/verify-slip-v2.ts` ⚠️ (ทางเลือก) - ใช้ multiparty
- `/api/verify-slip.ts` ❌ (เก่า) - ใช้ ReadableStream

### 3. การจัดการ Request Body:
```typescript
// Method 1: Buffer Collection (v3)
function collectRequestBody(req: VercelRequest): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on('data', (chunk: Buffer) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

// Use as Uint8Array for fetch
body: new Uint8Array(bodyBuffer)
```

## 🚀 ขั้นตอนการ Deploy:

```bash
# 1. Push การแก้ไข
git add .
git commit -m "Fix duplex option error for Node.js 18+"
git push origin main

# 2. Deploy จะทำงานอัตโนมัติ
# หรือใช้ Vercel CLI
vercel --prod
```

## 🧪 การทดสอบ:

### ตรวจสอบใน Console (F12):
```javascript
// ข้อมูลที่ส่ง
Verifying slip with SlipOK API: {
  amount: 5.15,
  fileName: 'slip.jpg',
  fileSize: 80268,
  apiUrl: '/api/verify-slip-v3'
}

// Response ที่ถูกต้อง
SlipOK API Response Status: 200
SlipOK API Response Data: {
  success: true,
  data: { success: true }
}
```

### ตรวจสอบใน Vercel Dashboard:
1. ไป Functions > verify-slip-v3
2. ดู Real-time logs
3. ตรวจสอบ errors และ response

## 📋 Checklist สำหรับ Production:

- [x] ไฟล์ `.npmrc` มี `legacy-peer-deps=true`
- [x] `vercel.json` มี build environment และ functions config
- [x] API routes ใช้ `duplex: 'half'` option
- [x] Error handling และ logging ครบถ้วน
- [x] CORS headers ถูกต้อง
- [ ] Environment Variables ตั้งค่าใน Vercel Dashboard
- [ ] ทดสอบ API ใน Production

## 🔧 Environment Variables ใน Vercel:
```
SLIPOK_API_KEY = SLIPOKE0ICAL1
SLIPOK_BRANCH_ID = 49571
```

หลังจากการแก้ไข API จะสามารถทำงานได้บน Vercel Node.js 18+ runtime!
