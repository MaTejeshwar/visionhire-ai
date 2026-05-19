"use client"

import { useState, useEffect } from "react"
import { Users, FileText, Loader2, RefreshCw } from "lucide-react"
import Navbar from "@/components/Navbar"
import JobDescriptionInput from "@/components/JobDescriptionInput"
import FileUpload from "@/components/FileUpload"
import CandidateLeaderboard from "@/components/CandidateLeaderboard"
import CompareModal from "@/components/CompareModal"
import { api, CandidateBrief, CompareData } from "@/lib/api"

export default function Dashboard() {
  const [jd, setJd] = useState("")
  const [candidates, setCandidates] = useState<CandidateBrief[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [compareData, setCompareData] = useState<CompareData[]>([])
  const [isCompareOpen, setIsCompareOpen] = useState(false)
  
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch initial data
  const fetchData = async () => {
    try {
      const [jdRes, candRes] = await Promise.all([
        api.getJobDescription(),
        api.getCandidates(),
      ])
      setJd(jdRes.text)
      setCandidates(candRes)
    } catch (e) {
      console.error("Failed to load initial dashboard data", e)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSaveJd = async (newText: string) => {
    await api.updateJobDescription(newText)
    setJd(newText)
    // Refresh candidates because saving JD triggers recalculation on backend
    await refreshCandidates()
  }

  const handleUpload = async (files: File[]) => {
    const res = await api.uploadResumes(files)
    setCandidates(res.candidates)
  }

  const handleGenerateMock = async () => {
    const res = await api.generateMockResumes()
    setCandidates(res.candidates)
  }

  const refreshCandidates = async () => {
    setRefreshing(true)
    try {
      const res = await api.getCandidates()
      setCandidates(res)
    } catch (e) {
      console.error(e)
    } finally {
      setRefreshing(false)
    }
  }

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const handleCompareTrigger = async () => {
    if (selectedIds.length < 2) return
    try {
      const data = await api.compareCandidates(selectedIds)
      setCompareData(data)
      setIsCompareOpen(true)
    } catch (e) {
      console.error(e)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
          <span className="text-xs text-neutral-500 font-medium">Booting Dashboard Modules...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative z-10">
        {/* Top title and status indicator */}
        <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-900 pb-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
              Hiring Pipeline & Ranking
            </h1>
            <p className="text-xs text-neutral-500 mt-1">
              Upload resumes and rank candidates against your target role.
            </p>
          </div>
          
          <button
            onClick={refreshCandidates}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900/60 text-xs font-semibold text-neutral-600 dark:text-neutral-400 transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            Sync Data
          </button>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left panel: JD and Upload */}
          <div className="flex flex-col gap-6 lg:col-span-1">
            <JobDescriptionInput initialValue={jd} onSave={handleSaveJd} />
            <FileUpload onUpload={handleUpload} onGenerateMock={handleGenerateMock} />
          </div>

          {/* Right panel: Leaderboard list */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                Candidate Standings ({candidates.length})
              </h3>
            </div>
            
            <CandidateLeaderboard
              candidates={candidates}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onCompareTrigger={handleCompareTrigger}
            />
          </div>
        </div>
      </main>

      {/* Comparison Drawer */}
      <CompareModal
        data={compareData}
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
      />
    </div>
  )
}
