# Smart Clinic AI Triage (VibeCode MVP)

## วิธีรันโปรเจกต์ (How to run)
1. ตรวจสอบว่าเครื่องของคุณมีการติดตั้ง Node.js เรียบร้อยแล้ว
2. เปิด Terminal และเข้าไปที่โฟลเดอร์โปรเจกต์
3. รันคำสั่ง `npm install` เพื่อติดตั้ง Dependencies ทั้งหมด
4. รันคำสั่ง `npm run dev` เพื่อเริ่มต้นเซิร์ฟเวอร์
5. เปิดเบราว์เซอร์ไปที่ `http://localhost:3000` (สำหรับหน้าคนไข้) 
6. ไปที่ `http://localhost:3000/dashboard` (สำหรับหน้าพยาบาล)

---

## Team Contribution Log (สมาชิกกลุ่ม 4 คน)
* **นายจิรายุ งามสง่า (เอิร์ธ):** พัฒนา Frontend ด้วย v0.dev, ออกแบบ UI/UX หน้าคนไข้และแดชบอร์ดพยาบาล และจัดการ State (Context API)
* **นายณัฐพล ไวยวิลา:** พัฒนา Backend API, เขียน Prompt จำลอง AI (Classify อาการ 1-5) และสร้าง Guardrail ป้องกันข้อผิดพลาด
* **นายรวิภาส เขียนอักษร:** จัดทำเอกสาร Problem Statement, ออกแบบ Workflow ก่อน/หลัง, ทำสไลด์นำเสนอ 6-8 หน้า และวิเคราะห์ KPI
* **นายกฤตเมธ ทองเลี่ยมนาค:** จัดการระบบ Database (Mock data), ทดสอบระบบ (QA), ดูแล Source Code (GitHub) และถ่าย/ตัดต่อวิดีโอ Demo 60-90 วินาที