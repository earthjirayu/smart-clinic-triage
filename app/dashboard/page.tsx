"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useTriage, Patient } from "@/lib/triage-context"
import { 
  Activity, 
  Users, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowLeft,
  UserPlus,
  ClipboardCheck
} from "lucide-react"

function getSeverityBadge(score: number) {
  const styles: Record<number, { bg: string; text: string; label: string }> = {
    1: { bg: "bg-slate-100", text: "text-slate-700", label: "ต่ำ" },
    2: { bg: "bg-green-100", text: "text-green-700", label: "เล็กน้อย" },
    3: { bg: "bg-yellow-100", text: "text-yellow-700", label: "ปานกลาง" },
    4: { bg: "bg-orange-100", text: "text-orange-700", label: "สูง" },
    5: { bg: "bg-red-100", text: "text-red-700", label: "วิกฤต" },
  }
  
  const style = styles[score] || styles[1]
  
  return (
    <Badge className={`${style.bg} ${style.text} hover:${style.bg} font-medium`}>
      {score} - {style.label}
    </Badge>
  )
}

function formatTime(date: Date) {
  return date.toLocaleTimeString("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  }) + " น."
}

function PatientRow({ patient, onApprove }: { patient: Patient; onApprove: () => void }) {
  const isHighSeverity = patient.severityScore >= 4
  
  return (
    <tr className={isHighSeverity && patient.status === "Pending" ? "bg-red-50" : ""}>
      <td className="px-6 py-4">
        <div>
          <p className="font-medium text-foreground">{patient.name}</p>
          <p className="text-sm text-muted-foreground">อายุ: {patient.age} ปี</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="max-w-xs truncate text-sm text-foreground" title={patient.symptoms}>
          {patient.symptoms}
        </p>
      </td>
      <td className="px-6 py-4">
        {getSeverityBadge(patient.severityScore)}
      </td>
      <td className="px-6 py-4">
        {patient.status === "Confirmed" ? (
          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            ยืนยันแล้ว
          </Badge>
        ) : (
          <Badge variant="outline" className="border-yellow-200 bg-yellow-50 text-yellow-700">
            <Clock className="mr-1 h-3 w-3" />
            รอตรวจสอบ
          </Badge>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-muted-foreground">
        {formatTime(patient.checkInTime)}
      </td>
      <td className="px-6 py-4">
        {patient.status === "Pending" ? (
          <Button size="sm" onClick={onApprove} className="gap-1">
            <CheckCircle2 className="h-4 w-4" />
            อนุมัติ
          </Button>
        ) : (
          <Button size="sm" variant="ghost" disabled>
            อนุมัติแล้ว
          </Button>
        )}
      </td>
    </tr>
  )
}

export default function NurseDashboard() {
  const { patients, approvePatient } = useTriage()
  
  const sortedPatients = [...patients].sort((a, b) => {
    if (a.status !== b.status) {
      return a.status === "Pending" ? -1 : 1
    }
    if (b.severityScore !== a.severityScore) {
      return b.severityScore - a.severityScore
    }
    return a.checkInTime.getTime() - b.checkInTime.getTime()
  })

  const stats = {
    total: patients.length,
    pending: patients.filter(p => p.status === "Pending").length,
    confirmed: patients.filter(p => p.status === "Confirmed").length,
    critical: patients.filter(p => p.severityScore >= 4 && p.status === "Pending").length,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">SmartClinic</h1>
              <p className="text-sm text-muted-foreground">แดชบอร์ดพยาบาล</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              หน้าลงทะเบียนผู้ป่วย
            </Button>
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ผู้ป่วยทั้งหมด</p>
                <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">รอตรวจสอบ</p>
                <p className="text-3xl font-bold text-foreground">{stats.pending}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">เคสวิกฤต</p>
                <p className="text-3xl font-bold text-foreground">{stats.critical}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-sm">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <ClipboardCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">ยืนยันแล้ว</p>
                <p className="text-3xl font-bold text-foreground">{stats.confirmed}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="border-b border-border">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">คิวผู้ป่วย</CardTitle>
                <CardDescription>
                  ตรวจสอบและอนุมัติคิวผู้ป่วยเพื่อเข้ารับการรักษา
                </CardDescription>
              </div>
              <Link href="/">
                <Button variant="outline" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  เพิ่มผู้ป่วย
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {sortedPatients.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-4 py-16">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                  <Users className="h-8 w-8 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">ไม่มีผู้ป่วยในคิว</p>
                  <p className="text-sm text-muted-foreground">
                    ผู้ป่วยใหม่จะแสดงที่นี่หลังจากลงทะเบียน
                  </p>
                </div>
                <Link href="/">
                  <Button className="gap-2">
                    <UserPlus className="h-4 w-4" />
                    เพิ่มผู้ป่วยคนแรก
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        ผู้ป่วย
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        อาการ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        ระดับความรุนแรง (AI)
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        สถานะ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        เวลาลงทะเบียน
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                        จัดการ
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {sortedPatients.map((patient) => (
                      <PatientRow
                        key={patient.id}
                        patient={patient}
                        onApprove={() => approvePatient(patient.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 rounded-xl bg-muted/50 p-4">
          <h3 className="mb-3 text-sm font-medium text-foreground">คำอธิบายระดับความรุนแรง</h3>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2">
              {getSeverityBadge(1)}
              <span className="text-xs text-muted-foreground">ไม่เร่งด่วน</span>
            </div>
            <div className="flex items-center gap-2">
              {getSeverityBadge(2)}
              <span className="text-xs text-muted-foreground">เจ็บป่วยเล็กน้อย</span>
            </div>
            <div className="flex items-center gap-2">
              {getSeverityBadge(3)}
              <span className="text-xs text-muted-foreground">ต้องเฝ้าระวัง</span>
            </div>
            <div className="flex items-center gap-2">
              {getSeverityBadge(4)}
              <span className="text-xs text-muted-foreground">ต้องการการดูแลด่วน</span>
            </div>
            <div className="flex items-center gap-2">
              {getSeverityBadge(5)}
              <span className="text-xs text-muted-foreground">ฉุกเฉิน/วิกฤต</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}