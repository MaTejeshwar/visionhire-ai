"use client"

import { useState } from "react"
import { X, Check, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import { CompareData } from "@/lib/api"

interface CompareModalProps {
  data: CompareData[]
  isOpen: boolean
  onClose: () => void
}

export default function CompareModal({ data, isOpen, onClose }: CompareModalProps) {
  if (!isOpen) return null

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500"
    if (score >= 70) return "text-indigo-500"
    if (score >= 50) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="w-full max-w-5xl h-[85vh] bg-[#f8fafc] dark:bg-[#080512] rounded-3xl border border-neutral-200 dark:border-indigo-500/20 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-900/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </div>
            <h2 className="font-extrabold text-lg text-neutral-950 dark:text-white">
              Candidate Comparison Dashboard
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          <div className="grid grid-cols-[150px_1fr] md:grid-cols-[200px_1fr] gap-6">
            {/* Left Labels */}
            <div className="flex flex-col gap-6 text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider pt-[72px]">
              <div className="h-20 flex items-center">Overall Match</div>
              <div className="h-10 flex items-center">Seniority Level</div>
              <div className="h-10 flex items-center">Experience</div>
              <div className="h-10 flex items-center">Highest Degree</div>
              <div className="h-10 flex items-center">ATS Score</div>
              <div className="h-12 flex items-center border-t border-neutral-200/50 dark:border-neutral-900/50 pt-2">Skills Score</div>
              <div className="h-12 flex items-center">Exp Score</div>
              <div className="h-12 flex items-center">Edu Score</div>
              <div className="h-12 flex items-center">Semantic Score</div>
              <div className="h-auto flex items-top border-t border-neutral-200/50 dark:border-neutral-900/50 pt-4">Skills Overlap</div>
              <div className="h-auto flex items-top border-t border-neutral-200/50 dark:border-neutral-900/50 pt-4">Skill Gaps</div>
            </div>

            {/* Compared Candidates Grid */}
            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${data.length}, minmax(200px, 1fr))` }}>
              {data.map((cand) => (
                <div key={cand.id} className="flex flex-col gap-6">
                  {/* Candidate Name Header */}
                  <div className="h-12 flex flex-col justify-end">
                    <h3 className="font-extrabold text-sm text-neutral-900 dark:text-white truncate">
                      {cand.name}
                    </h3>
                    <span className="text-[10px] text-neutral-500 truncate">{cand.id}</span>
                  </div>

                  {/* Match Score */}
                  <div className="h-20 flex items-center">
                    <div className="flex items-center gap-3">
                      <span className={`text-4xl font-black ${getScoreColor(cand.score)}`}>
                        {Math.round(cand.score)}%
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        {cand.score >= 85 ? "Top Fit" : cand.score >= 70 ? "Good" : "Potential"}
                      </span>
                    </div>
                  </div>

                  {/* Seniority */}
                  <div className="h-10 flex items-center text-sm font-bold text-neutral-800 dark:text-neutral-200">
                    {cand.seniority}
                  </div>

                  {/* Experience */}
                  <div className="h-10 flex items-center text-sm text-neutral-800 dark:text-neutral-200">
                    {cand.experience_years} years
                  </div>

                  {/* Degree */}
                  <div className="h-10 flex items-center text-sm text-neutral-800 dark:text-neutral-200 truncate">
                    {cand.education}
                  </div>

                  {/* ATS Score */}
                  <div className="h-10 flex items-center text-sm font-extrabold text-neutral-800 dark:text-neutral-200">
                    {cand.ats_score} / 100
                  </div>

                  {/* Skills Score Progress */}
                  <div className="h-12 flex flex-col justify-center border-t border-neutral-200/50 dark:border-neutral-900/50 pt-2">
                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      {Math.round(cand.skills_score)}%
                    </span>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${cand.skills_score}%` }} />
                    </div>
                  </div>

                  {/* Experience Score Progress */}
                  <div className="h-12 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      {Math.round(cand.experience_score)}%
                    </span>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${cand.experience_score}%` }} />
                    </div>
                  </div>

                  {/* Education Score Progress */}
                  <div className="h-12 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      {Math.round(cand.education_score)}%
                    </span>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${cand.education_score}%` }} />
                    </div>
                  </div>

                  {/* Semantic Score Progress */}
                  <div className="h-12 flex flex-col justify-center">
                    <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300 mb-1">
                      {Math.round(cand.semantic_score)}%
                    </span>
                    <div className="h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500" style={{ width: `${cand.semantic_score}%` }} />
                    </div>
                  </div>

                  {/* Skills Overlap List */}
                  <div className="h-auto border-t border-neutral-200/50 dark:border-neutral-900/50 pt-4 flex flex-wrap gap-1 items-start">
                    {cand.matched_skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>

                  {/* Skill Gaps List */}
                  <div className="h-auto border-t border-neutral-200/50 dark:border-neutral-900/50 pt-4 flex flex-wrap gap-1 items-start">
                    {cand.missing_skills.length === 0 ? (
                      <span className="text-[9px] font-bold text-emerald-500">Perfect Match</span>
                    ) : (
                      cand.missing_skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/10"
                        >
                          {skill}
                        </span>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-200 dark:border-neutral-900/60 bg-neutral-100/50 dark:bg-neutral-950/40 text-center text-xs text-neutral-500 flex items-center justify-between">
          <span>VisionHire AI compares experience timelines, ATS scoring, and semantic skill match parameters.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold bg-neutral-950 hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-neutral-950 rounded-xl cursor-pointer"
          >
            Close Comparison
          </button>
        </div>
      </div>
    </div>
  )
}
