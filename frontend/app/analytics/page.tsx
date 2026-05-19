"use client"

import { useState, useEffect } from "react"
import { BarChart3, Users, Award, TrendingUp, Loader2 } from "lucide-react"
import { 
  BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Legend
} from "recharts"

import Navbar from "@/components/Navbar"
import { api, AnalyticsData } from "@/lib/api"

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadAnalytics = async () => {
      try {
        const res = await api.getAnalytics()
        setData(res)
      } catch (e) {
        console.error("Failed to load analytics", e)
      } finally {
        setLoading(false)
      }
    }
    loadAnalytics()
  }, [])

  if (loading || !data) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-2" />
          <span className="text-xs text-neutral-500 font-medium">Aggregating Pipeline Analytics...</span>
        </div>
      </div>
    )
  }

  // Pre-formatted colors for chart distributions
  const PIE_COLORS = ["#6366f1", "#a855f7", "#ec4899", "#f59e0b", "#10b981"]

  return (
    <div className="flex flex-col min-h-screen bg-[#fafafa] dark:bg-[#04010d]">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8 relative z-10">
        {/* Header */}
        <div className="border-b border-neutral-200 dark:border-neutral-900 pb-4">
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
            Pipeline Analytics
          </h1>
          <p className="text-xs text-neutral-500 mt-1">
            Aggregate metrics, skill counts, and score distributions for all processed candidates.
          </p>
        </div>

        {data.candidate_count === 0 ? (
          <div className="w-full glass rounded-3xl p-16 text-center flex flex-col items-center justify-center border border-neutral-200 dark:border-neutral-900">
            <BarChart3 className="w-10 h-10 text-neutral-400 mb-2" />
            <p className="font-bold text-neutral-700 dark:text-neutral-300">No Analytics Data Available</p>
            <p className="text-xs text-neutral-500 mt-1">
              Upload resumes in the main dashboard or click "Load Mock Candidates" to trigger analytics computation.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Top Score Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Total Candidates
                  </span>
                  <span className="text-3xl font-black text-neutral-900 dark:text-white">
                    {data.candidate_count}
                  </span>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Users className="w-5 h-5" />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Average Score
                  </span>
                  <span className="text-3xl font-black text-neutral-900 dark:text-white">
                    {data.average_score}%
                  </span>
                </div>
                <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-xl">
                  <Award className="w-5 h-5" />
                </div>
              </div>

              <div className="glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    Active Funnel Status
                  </span>
                  <span className="text-lg font-black text-emerald-500">
                    Active Pipeline
                  </span>
                </div>
                <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* Recharts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Score Distribution Chart */}
              <div className="glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex flex-col">
                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-6">
                  Candidate Score Distribution
                </h3>
                <div className="w-full h-72">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.score_distribution} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.1} />
                        <XAxis dataKey="range" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                        <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1e1b4b', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#818cf8', fontSize: '11px' }}
                        />
                        <Bar dataKey="count" fill="#6366f1" radius={[8, 8, 0, 0]} maxBarSize={50} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Seniority Distribution */}
              <div className="glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex flex-col">
                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-6">
                  Seniority Level Breakdown
                </h3>
                <div className="w-full h-72 flex items-center justify-center">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.seniority_distribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={90}
                          fill="#8884d8"
                          dataKey="count"
                          nameKey="level"
                          label={({ level, percent }) => `${level} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {data.seniority_distribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1e1b4b', borderRadius: '12px' }}
                          itemStyle={{ color: '#fff', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              {/* Top Matching Skills */}
              <div className="lg:col-span-2 glass rounded-2xl p-6 border border-neutral-200 dark:border-neutral-900 flex flex-col">
                <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200 mb-6">
                  Top 10 Extracted Skills Frequency
                </h3>
                <div className="w-full h-80">
                  {mounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={data.top_skills}
                        margin={{ top: 10, right: 10, left: 30, bottom: 10 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#262626" opacity={0.1} />
                        <XAxis type="number" tick={{ fill: '#94a3b8', fontSize: 10 }} allowDecimals={false} />
                        <YAxis type="category" dataKey="skill" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#09090b', border: '1px solid #1e1b4b', borderRadius: '12px' }}
                          labelStyle={{ color: '#fff', fontSize: '11px', fontWeight: 'bold' }}
                          itemStyle={{ color: '#a855f7', fontSize: '11px' }}
                        />
                        <Bar dataKey="count" fill="#a855f7" radius={[0, 8, 8, 0]} maxBarSize={20} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
