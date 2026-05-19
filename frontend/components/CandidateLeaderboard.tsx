"use client"

import { useState } from "react"
import Link from "next/link"
import { Search, ChevronDown, ChevronUp, FileText, ArrowRight, User, Award, BookOpen, Clock, BarChart } from "lucide-react"
import { CandidateBrief } from "@/lib/api"
import { formatPercent, formatYears } from "@/lib/utils"

interface CandidateLeaderboardProps {
  candidates: CandidateBrief[]
  selectedIds: string[]
  onToggleSelect: (id: string) => void
  onCompareTrigger: () => void
}

export default function CandidateLeaderboard({
  candidates,
  selectedIds,
  onToggleSelect,
  onCompareTrigger,
}: CandidateLeaderboardProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<"score" | "exp" | "ats">("score")
  const [expandedId, setExpandedId] = useState<string | null>(null)

  // Filter candidates
  const filteredCandidates = candidates.filter((c) => {
    const q = searchQuery.toLowerCase()
    return (
      c.name.toLowerCase().includes(q) ||
      c.skills.some((s) => s.toLowerCase().includes(q)) ||
      c.seniority_level.toLowerCase().includes(q)
    )
  })

  // Sort candidates
  const sortedCandidates = [...filteredCandidates].sort((a, b) => {
    if (sortBy === "score") return b.score - a.score
    if (sortBy === "exp") return b.experience_years - a.experience_years
    if (sortBy === "ats") return b.ats_score - a.ats_score
    return 0
  })

  const toggleExpand = (id: string) => {
    if (expandedId === id) {
      setExpandedId(null)
    } else {
      setExpandedId(id)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    if (score >= 70) return "text-indigo-500 border-indigo-500/20 bg-indigo-500/5"
    if (score >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/5"
    return "text-red-500 border-red-500/20 bg-red-500/5"
  }

  const getScoreBg = (score: number) => {
    if (score >= 85) return "bg-emerald-500"
    if (score >= 70) return "bg-indigo-500"
    if (score >= 50) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Filtering and Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by candidate name or skills..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white/50 dark:bg-neutral-950/30 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 transition-all"
          />
        </div>

        {/* Sort controls and Compare button */}
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <div className="flex items-center gap-1.5 border border-neutral-200 dark:border-neutral-800 rounded-xl p-1 bg-white/30 dark:bg-neutral-950/20 glass text-xs">
            <button
              onClick={() => setSortBy("score")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortBy === "score"
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Score
            </button>
            <button
              onClick={() => setSortBy("exp")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortBy === "exp"
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              Experience
            </button>
            <button
              onClick={() => setSortBy("ats")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors cursor-pointer ${
                sortBy === "ats"
                  ? "bg-indigo-500 text-white shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              ATS Score
            </button>
          </div>

          <button
            onClick={onCompareTrigger}
            disabled={selectedIds.length < 2}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 dark:bg-neutral-100 dark:hover:bg-white text-white dark:text-neutral-950 text-xs font-bold shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            Compare ({selectedIds.length})
          </button>
        </div>
      </div>

      {/* Leaderboard Cards */}
      {sortedCandidates.length === 0 ? (
        <div className="w-full glass rounded-2xl p-12 text-center flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-900">
          <User className="w-8 h-8 text-neutral-400 mb-2" />
          <p className="font-bold text-neutral-700 dark:text-neutral-300">No candidates match search</p>
          <p className="text-xs text-neutral-500 mt-1">Try refining your search terms or upload more resumes.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {sortedCandidates.map((cand, index) => {
            const isExpanded = expandedId === cand.id
            const isSelected = selectedIds.includes(cand.id)
            
            return (
              <div
                key={cand.id}
                className={`w-full glass rounded-2xl border transition-all duration-300 ${
                  isExpanded
                    ? "border-indigo-500/30 shadow-md shadow-indigo-500/5 ring-1 ring-indigo-500/10"
                    : isSelected
                    ? "border-indigo-500/20 bg-indigo-500/5 shadow-sm"
                    : "border-neutral-200 dark:border-neutral-900/60 hover:border-neutral-300 dark:hover:border-neutral-800 hover:shadow-sm"
                }`}
              >
                {/* Main Card row */}
                <div className="p-5 flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-3.5 min-w-[200px]">
                    {/* Compare checkbox */}
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onToggleSelect(cand.id)}
                      className="w-4.5 h-4.5 rounded border-neutral-300 dark:border-neutral-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 bg-white/20 dark:bg-neutral-950/20 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    
                    {/* Rank Badge */}
                    <span className="text-xs font-black text-neutral-400 dark:text-neutral-600 w-5">
                      #{index + 1}
                    </span>

                    {/* Basic Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm text-neutral-950 dark:text-white">
                          {cand.name}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 border border-neutral-200/50 dark:border-neutral-800/50">
                          {cand.seniority_level}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5">{cand.email || "No email"}</p>
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="flex items-center gap-6 flex-wrap text-xs text-neutral-600 dark:text-neutral-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-neutral-400" />
                      <span>{formatYears(cand.experience_years)}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                      <span className="max-w-[120px] truncate">
                        {cand.education.length > 0 ? cand.education[0].degree : "Bachelor's"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Award className="w-3.5 h-3.5 text-neutral-400" />
                      <span>ATS: {cand.ats_score}</span>
                    </div>
                  </div>

                  {/* Score circle */}
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-neutral-400 block">MATCH SCORE</span>
                      <span className={`text-base font-extrabold px-3 py-1 rounded-lg border ${getScoreColor(cand.score)}`}>
                        {formatPercent(cand.score)}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleExpand(cand.id)}
                      className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-400 hover:text-neutral-700 dark:hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Extended Details */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-1 border-t border-neutral-100 dark:border-neutral-900/60 flex flex-col gap-4 bg-neutral-50/30 dark:bg-neutral-950/10">
                    {/* Scores Progress Bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                      {Object.entries(cand.breakdown).map(([key, val]) => {
                        const name = key.replace("_score", "").replace("exp", "experience")
                        return (
                          <div key={key} className="flex flex-col gap-1">
                            <span className="text-[10px] font-bold text-neutral-500 uppercase">{name}</span>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 h-1.5 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getScoreBg(val)}`}
                                  style={{ width: `${val}%` }}
                                />
                              </div>
                              <span className="text-[10px] font-bold text-neutral-700 dark:text-neutral-300">
                                {Math.round(val)}%
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {/* Explanations & Insight */}
                    <div className="flex flex-col gap-1.5 bg-white/20 dark:bg-neutral-950/20 p-3.5 rounded-xl border border-neutral-200/50 dark:border-neutral-800/40">
                      <span className="text-[10px] font-bold text-indigo-500 uppercase block tracking-wider">
                        AI Match Analysis
                      </span>
                      <p className="text-xs leading-relaxed text-neutral-700 dark:text-neutral-300">
                        {cand.insights.explanation}
                      </p>
                    </div>

                    {/* Strengths / Weaknesses */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block mb-1.5">
                          Strengths
                        </span>
                        <ul className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-col gap-1.5 list-disc pl-4">
                          {cand.insights.strengths.slice(0, 2).map((str, i) => (
                            <li key={i}>{str}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider block mb-1.5">
                          Skill Gaps & Notes
                        </span>
                        <ul className="text-xs text-neutral-600 dark:text-neutral-400 flex flex-col gap-1.5 list-disc pl-4">
                          {cand.insights.weaknesses.slice(0, 2).map((wk, i) => (
                            <li key={i}>{wk}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between border-t border-neutral-200/30 dark:border-neutral-800/20 pt-4 flex-wrap gap-3">
                      {/* Skill overlaps tags */}
                      <div className="flex items-center gap-1 flex-wrap max-w-xl">
                        {cand.skills_match.matched.slice(0, 4).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10"
                          >
                            ✓ {skill}
                          </span>
                        ))}
                        {cand.skills_match.missing.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-neutral-200/30 dark:bg-neutral-800/40 text-neutral-500 border border-neutral-300/10"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <Link
                        href={`/dashboard/candidate/${cand.id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-indigo-500 dark:hover:border-indigo-500 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                      >
                        Detailed Report
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
