"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useTriage, Patient } from "@/lib/triage-context"
import { 
  Activity, 
  Clock, 
  Heart, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight,
  Users,
  Shield
} from "lucide-react"

export default function PatientPage() {
  const { addPatient } = useTriage()
  const [name, setName] = useState("")
  const [age, setAge] = useState("")
  const [symptoms, setSymptoms] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submittedPatient, setSubmittedPatient] = useState<Patient | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !age || !symptoms.trim()) return

    setIsSubmitting(true)
    
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const patient = addPatient(name.trim(), parseInt(age), symptoms.trim())
    setSubmittedPatient(patient)
    setIsSubmitting(false)
  }

  const handleNewCheckIn = () => {
    setName("")
    setAge("")
    setSymptoms("")
    setSubmittedPatient(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">SmartClinic</h1>
              <p className="text-sm text-muted-foreground">ระบบคัดกรองผู้ป่วยด้วย AI</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button variant="outline" className="gap-2">
              <Users className="h-4 w-4" />
              แดชบอร์ดพยาบาล
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {submittedPatient ? (
          <div className="mx-auto max-w-lg">
            <Card className="border-0 shadow-lg">
              <CardContent className="flex flex-col items-center gap-6 py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
                <div className="text-center">
                  <h2 className="text-2xl font-semibold text-foreground">
                    ลงทะเบียนสำเร็จ
                  </h2>
                  <p className="mt-2 text-muted-foreground">
                    ขอบคุณคุณ {submittedPatient.name} คุณได้เข้าสู่ระบบคิวเรียบร้อยแล้ว
                  </p>
                </div>
                <div className="flex w-full max-w-xs flex-col gap-4 rounded-xl bg-muted p-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">หมายเลขคิวของคุณ</p>
                    <p className="text-5xl font-bold text-primary">
                      #{submittedPatient.queueNumber}
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>เวลารอโดยประมาณ: 15-20 นาที</span>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleNewCheckIn} variant="outline">
                    ลงทะเบียนใหม่
                  </Button>
                  <Link href="/dashboard">
                    <Button className="gap-2">
                      ดูคิวทั้งหมด
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="flex flex-col justify-center">
              <div className="mb-8">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Shield className="h-4 w-4" />
                  ระบบข้อมูลผู้ป่วยที่ปลอดภัย
                </div>
                <h2 className="text-4xl font-bold tracking-tight text-foreground">
                  ยินดีต้อนรับสู่ SmartClinic
                </h2>
                <p className="mt-4 text-lg text-muted-foreground leading-relaxed">
                  ระบบคัดกรองด้วย AI ของเราช่วยจัดลำดับความสำคัญเพื่อให้คุณได้รับการดูแลอย่างทันท่วงที 
                  กรุณากรอกข้อมูลด้านล่างเพื่อลงทะเบียนรับคิว
                </p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-sm border border-border">
                  <Clock className="h-6 w-6 text-primary" />
                  <p className="text-sm font-medium text-foreground">ลงทะเบียนรวดเร็ว</p>
                  <p className="text-xs text-muted-foreground">ใช้เวลาไม่ถึง 2 นาที</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-sm border border-border">
                  <Heart className="h-6 w-6 text-primary" />
                  <p className="text-sm font-medium text-foreground">วิเคราะห์ด้วย AI</p>
                  <p className="text-xs text-muted-foreground">จัดลำดับคิวอัจฉริยะ</p>
                </div>
                <div className="flex flex-col gap-2 rounded-xl bg-card p-4 shadow-sm border border-border">
                  <Stethoscope className="h-6 w-6 text-primary" />
                  <p className="text-sm font-medium text-foreground">ผู้เชี่ยวชาญดูแล</p>
                  <p className="text-xs text-muted-foreground">โดยบุคลากรทางการแพทย์</p>
                </div>
              </div>
            </div>

            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl">ลงทะเบียนผู้ป่วยใหม่</CardTitle>
                <CardDescription>
                  กรุณากรอกข้อมูลของคุณด้านล่าง ข้อมูลทั้งหมดจะถูกเก็บเป็นความลับ
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      ชื่อ-นามสกุล
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="กรอกชื่อ-นามสกุลของคุณ"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-12"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="age" className="text-sm font-medium">
                      อายุ
                    </Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="กรอกอายุของคุณ"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      required
                      min="0"
                      max="150"
                      className="h-12"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <Label htmlFor="symptoms" className="text-sm font-medium">
                      อาการเบื้องต้น
                    </Label>
                    <Textarea
                      id="symptoms"
                      placeholder="กรุณาอธิบายอาการของคุณอย่างละเอียด เช่น เริ่มมีอาการตั้งแต่เมื่อไหร่ ความรุนแรงของอาการ และข้อมูลอื่นๆ ที่เกี่ยวข้อง"
                      value={symptoms}
                      onChange={(e) => setSymptoms(e.target.value)}
                      required
                      className="min-h-[140px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      โปรดระบุให้ชัดเจนที่สุดเพื่อช่วยให้เราจัดลำดับความเร่งด่วนได้อย่างถูกต้อง
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    size="lg"
                    className="mt-2 h-12 w-full gap-2 text-base"
                    disabled={isSubmitting || !name.trim() || !age || !symptoms.trim()}
                  >
                    {isSubmitting ? (
                      <>
                        <Activity className="h-5 w-5 animate-pulse" />
                        กำลังวิเคราะห์อาการด้วย AI...
                      </>
                    ) : (
                      <>
                        ยืนยันการลงทะเบียน
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  )
}