"use client"

import { use, useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  ArrowLeft, Mail, Phone, ExternalLink, Award, Clock, BookOpen, 
  Sparkles, CheckCircle2, AlertTriangle, FileText, ChevronRight, Loader2
} from "lucide-react"
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer 
} from "recharts"

import Navbar from "@/components/Navbar"
import { api, CandidateDetail } from "@/lib/api"
import { formatPercent, formatYears } from "@/lib/utils"

interface PageProps {
  params: Promise<{ id: string }>
}

export default function CandidateDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [data, setData] = useState<CandidateDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadCandidate = async () => {
      try {
        const res = await api.getCandidate(id)
        setData(res)
      } catch (e) {
        console.error("Failed to load candidate details", e)
        // If not found, redirect to dashboard
        router.push("/dashboard")
      } finally {
        setLoading(false)
      }
    }
    loadCandidate()
  }, [id, router])

  if (loading || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
          <span className="text-xs text-neutral-500 font-medium">Extracting Candidate Profile...</span>
        </div>
      </div>
    )
  }

  // Format Recharts data
  const chartData = [
    { subject: 'Skills Match', A: data.score_details.breakdown.skills_score, fullMark: 100 },
    { subject: 'Experience', A: data.score_details.breakdown.experience_score, fullMark: 100 },
    { subject: 'Education', A: data.score_details.breakdown.education_score, fullMark: 100 },
    { subject: 'Semantic Fit', A: data.score_details.breakdown.semantic_score, fullMark: 100 },
  ]

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-500 border-emerald-500/20 bg-emerald-500/5"
    if (score >= 70) return "text-indigo-500 border-indigo-500/20 bg-indigo-500/5"
    if (score >= 50) return "text-amber-500 border-amber-500/20 bg-amber-500/5"
    return "text-red-500 border-red-500/20 bg-red-500/5"
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative z-10">
        {/* Back and Title Header */}
        <div className="flex flex-col gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:hover:text-white w-fit transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Leaderboard
          </Link>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-neutral-900 pb-6">
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-black text-neutral-900 dark:text-white">
                  {data.name}
                </h1>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10">
                  {data.seniority_level}
                </span>
              </div>

              {/* Contact Info Row */}
              <div className="flex items-center gap-4 flex-wrap text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {data.email && (
                  <div className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{data.email}</span>
                  </div>
                )}
                {data.phone && (
                  <div className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />
                    <span>{data.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  {data.links.map((link) => {
                    const isGitHub = link.includes("github.com")
                    const isLinkedIn = link.includes("linkedin.com")
                    const label = isGitHub ? "GitHub" : isLinkedIn ? "LinkedIn" : "Portfolio"
                    return (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-indigo-500 hover:underline"
                      >
                        {label}
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Overall Score Badge */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-[10px] font-bold text-neutral-400 block tracking-widest">
                  JD OVERALL MATCH
                </span>
                <span className={`text-2xl font-black px-4 py-1.5 rounded-xl border ${getScoreColor(data.score)}`}>
                  {formatPercent(data.score)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: AI Breakdown, Radar, ATS score */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Radar Chart */}
            <div className="w-full glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col items-center">
              <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 self-start mb-4">
                Requirement Alignment
              </h3>
              
              <div className="w-full h-56 flex items-center justify-center">
                {mounted && (
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                      <PolarGrid stroke="#475569" strokeWidth={0.5} />
                      <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 8 }} />
                      <Radar
                        name="Match"
                        dataKey="A"
                        stroke="#6366f1"
                        fill="#6366f1"
                        fillOpacity={0.35}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* ATS Checklist */}
            <div className="w-full glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">
                  ATS Friendliness
                </h3>
                <span className="text-sm font-extrabold px-2.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                  {data.ats_score}/100
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-neutral-200 dark:bg-neutral-800 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-500" style={{ width: `${data.ats_score}%` }} />
              </div>

              {/* Strengths / Warnings lists */}
              <div className="flex flex-col gap-3.5 mt-2">
                {data.ats_strengths.map((str, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 dark:text-neutral-400">{str}</span>
                  </div>
                ))}
                {data.ats_warnings.map((warn, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-neutral-600 dark:text-neutral-400">{warn}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Profile Summary, Work History, Education, Resume Text */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            {/* AI Summary and JD Explanation */}
            <div className="w-full glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                  AI Fit Analysis & Recommendation
                </h3>
              </div>

              <p className="text-xs sm:text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
                {data.score_details.insights.explanation}
              </p>

              {/* Strengths & Weaknesses Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-neutral-200 dark:border-neutral-900/60 pt-4 mt-2">
                <div>
                  <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-wider mb-2">Strengths</h4>
                  <ul className="text-xs flex flex-col gap-2 list-disc pl-4 text-neutral-600 dark:text-neutral-400">
                    {data.score_details.insights.strengths.map((str, i) => (
                      <li key={i}>{str}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">Skill Gaps & Weaknesses</h4>
                  <ul className="text-xs flex flex-col gap-2 list-disc pl-4 text-neutral-600 dark:text-neutral-400">
                    {data.score_details.insights.weaknesses.map((wk, i) => (
                      <li key={i}>{wk}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Experience timeline */}
            <div className="w-full glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                  Work Experience
                </h3>
              </div>

              <div className="flex flex-col gap-6 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[1px] before:bg-neutral-200 dark:before:bg-neutral-800">
                {data.experience_timeline.map((exp, i) => (
                  <div key={i} className="flex gap-4 relative pl-8">
                    {/* Circle Node */}
                    <div className="absolute left-[7px] top-1.5 w-2.5 h-2.5 rounded-full bg-indigo-500 border border-white dark:border-neutral-950 ring-4 ring-indigo-500/10" />
                    
                    <div className="flex-1 flex flex-col gap-1.5 bg-white/20 dark:bg-neutral-950/20 p-4 border border-neutral-200/50 dark:border-neutral-900/60 rounded-2xl shadow-sm">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <h4 className="font-bold text-sm text-neutral-950 dark:text-white">
                          {exp.title}
                        </h4>
                        <span className="text-xs text-neutral-500 font-semibold">{exp.duration}</span>
                      </div>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 italic">
                        {exp.company}
                      </span>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                        {exp.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Education and Skills list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Education Card */}
              <div className="glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                    Education
                  </h3>
                </div>

                <div className="flex flex-col gap-3">
                  {data.education.map((edu, i) => (
                    <div key={i} className="flex flex-col gap-1 border-b border-neutral-200/40 dark:border-neutral-900/40 pb-2 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-neutral-950 dark:text-white">{edu.degree}</span>
                        <span className="text-[10px] text-neutral-500 font-semibold">{edu.year}</span>
                      </div>
                      <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">{edu.major}</span>
                      <span className="text-[11px] text-neutral-500">{edu.institution}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Overlap */}
              <div className="glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Award className="w-4.5 h-4.5 text-indigo-500" />
                  <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                    Skill Gaps Analysis
                  </h3>
                </div>

                <div className="flex flex-col gap-3.5">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 block mb-1.5 uppercase">MATCHED SKILLS</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {data.score_details.skills_match.matched.map((skill) => (
                        <span key={skill} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 block mb-1.5 uppercase">MISSING KEYWORDS</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {data.score_details.skills_match.missing.length === 0 ? (
                        <span className="text-xs text-emerald-500 font-semibold">None (100% matched)</span>
                      ) : (
                        data.score_details.skills_match.missing.map((skill) => (
                          <span key={skill} className="text-[10px] font-bold px-2.5 py-0.5 rounded-md bg-red-500/10 text-red-500 border border-red-500/10">
                            {skill}
                          </span>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Raw Resume Text Preview */}
            <div className="w-full glass rounded-2xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-900 flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-indigo-500" />
                <h3 className="font-extrabold text-base text-neutral-800 dark:text-neutral-200">
                  Resume Raw Text Preview
                </h3>
              </div>
              <div className="p-4 bg-white/40 dark:bg-neutral-950/40 border border-neutral-200 dark:border-neutral-900 rounded-xl max-h-60 overflow-y-auto text-xs font-mono leading-relaxed text-neutral-600 dark:text-neutral-400 scrollbar-thin">
                {data.raw_text_preview}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
