import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { symptoms } = body

    // --- [STEP 1: SYSTEM LOGIC CHECK] ---
    // เช็คคำวิกฤตแบบ Hard-coded (ไม่ผ่าน AI) เพื่อความชัวร์ 100%
    const criticalKeywords = ["ตาย", "เสียชีวิต", "ไม่หายใจ", "หมดสติ", "ช็อก", "หยุดหายใจ"];
    const isCritical = criticalKeywords.some(keyword => symptoms.includes(keyword));

    if (isCritical) {
      console.log("🚨 [System Rule] ตรวจพบคำวิกฤต บังคับระดับ 5 ทันที");
      return NextResponse.json({ severityScore: 5 });
    }
    // --------------------------------------

    const apiKey = process.env.GEMINI_API_KEY || "AIzaSyANmnIbTe26l5RDMoBfIrUCoUKNBPO06uo" 
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

    const prompt = `คุณคือระบบ AI คัดกรองผู้ป่วยฉุกเฉิน (Triage System)
หน้าที่ของคุณคือประเมินระดับความรุนแรงจากอาการที่ได้รับ ให้ออกมาเป็น "ตัวเลข 1-5" ตัวเดียวเท่านั้น ห้ามมีข้อความอื่นเด็ดขาด

เกณฑ์การประเมิน:
5 = วิกฤต (แน่นหน้าอกรุนแรง, เลือดออกไม่หยุด, ช็อก)
4 = สูง (ไข้สูงมาก, อาเจียนเป็นเลือด, ปวดรุนแรง)
3 = ปานกลาง (มีไข้, ปวดหัว, เวียนหัว)
2 = เล็กน้อย (เป็นหวัด, เจ็บคอ)
1 = ต่ำ (แผลถลอก, ตรวจสุขภาพ)

อาการของผู้ป่วย: "${symptoms}"`;

    const result = await model.generateContent(prompt)
    const text = result.response.text().trim()
    const score = parseInt(text)

    // Guardrail: ถ้า AI ตอบกลับมาไม่ใช่ตัวเลข ให้ตั้งค่า Default เป็น 3
    if (isNaN(score)) {
      return NextResponse.json({ severityScore: 3 })
    }

    return NextResponse.json({ severityScore: score })

  } catch (error) {
    console.error("AI Error:", error)
    // Fallback: ถ้า API ล่ม ให้คะแนนความรุนแรงพื้นฐานเป็น 3
    return NextResponse.json({ severityScore: 3 })
  }
}