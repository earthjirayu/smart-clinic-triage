"use client"

import { createContext, useContext, useState, ReactNode } from "react"

export interface Patient {
  id: string
  name: string
  age: number
  symptoms: string
  severityScore: number
  status: "Pending" | "Confirmed"
  checkInTime: Date
  queueNumber: number
}

interface TriageContextType {
  patients: Patient[]
  // เปลี่ยนเป็น Promise เพราะต้องรอ AI ประมวลผล
  addPatient: (name: string, age: number, symptoms: string) => Promise<Patient>
  approvePatient: (id: string) => void
  isAILoading: boolean // เพิ่ม State เพื่อบอกว่า AI กำลังคิดอยู่
}

const TriageContext = createContext<TriageContextType | undefined>(undefined)

export function TriageProvider({ children }: { children: ReactNode }) {
  const [isAILoading, setIsAILoading] = useState(false)
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "demo-1",
      name: "สมชาย รักดี",
      age: 45,
      symptoms: "แน่นหน้าอกและหายใจลำบากมาประมาณหนึ่งชั่วโมง",
      severityScore: 5,
      status: "Pending",
      checkInTime: new Date(Date.now() - 15 * 60000),
      queueNumber: 1,
    },
    {
      id: "demo-2",
      name: "สมหญิง ใจดี",
      age: 32,
      symptoms: "มีไข้สูงและปวดหัวอย่างรุนแรงตั้งแต่เมื่อวาน",
      severityScore: 4,
      status: "Pending",
      checkInTime: new Date(Date.now() - 30 * 60000),
      queueNumber: 2,
    },
  ])

  const [queueCounter, setQueueCounter] = useState(3)

  const addPatient = async (name: string, age: number, symptoms: string): Promise<Patient> => {
    setIsAILoading(true)
    let aiScore = 3 // ค่า Default (Guardrail)

    try {
      // ส่งอาการไปให้ AI ตัวจริงวิเคราะห์
      const response = await fetch('/api/triage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms })
      })
      
      const data = await response.json()
      aiScore = data.severityScore
    } catch (error) {
      console.error("Failed to fetch AI triage", error)
    } finally {
      setIsAILoading(false)
    }

    const newPatient: Patient = {
      id: crypto.randomUUID(),
      name,
      age,
      symptoms,
      severityScore: aiScore,
      status: "Pending",
      checkInTime: new Date(),
      queueNumber: queueCounter,
    }
    
    setPatients(prev => [...prev, newPatient])
    setQueueCounter(prev => prev + 1)
    
    return newPatient
  }

  const approvePatient = (id: string) => {
    setPatients(prev =>
      prev.map(patient =>
        patient.id === id ? { ...patient, status: "Confirmed" as const } : patient
      )
    )
  }

  return (
    <TriageContext.Provider value={{ patients, addPatient, approvePatient, isAILoading }}>
      {children}
    </TriageContext.Provider>
  )
}

export function useTriage() {
  const context = useContext(TriageContext)
  if (context === undefined) {
    throw new Error("useTriage must be used within a TriageProvider")
  }
  return context
}