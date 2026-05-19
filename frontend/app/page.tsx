"use client"

import Link from "next/link"
import { Cpu, Award, Search, Sparkles, Shield, BarChart3, Users, Zap, CheckCircle } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden bg-[#fafafa] dark:bg-[#04010d]">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none animate-pulse-slow" />

      {/* Navigation */}
      <Navbar />

      {/* Hero Section */}
      <section className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 flex flex-col items-center justify-center text-center relative z-10">
        {/* Banner Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-bold mb-6 hover:bg-indigo-500/10 transition-colors">
          <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
          <span>Next-Generation Resume Intelligence</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight max-w-4xl bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent leading-[1.1]">
          Screen 1000+ Resumes in Seconds with Semantic AI
        </h1>

        {/* Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-neutral-500 dark:text-neutral-400 max-w-2xl leading-relaxed">
          VisionHire AI combines advanced NLP parser engineering, keyword scoring, and semantic similarity embeddings to instantly rank candidates against your custom job requirements.
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex items-center gap-4 flex-wrap justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 transition-all text-sm flex items-center gap-2 group"
          >
            Get Started Free
            <Zap className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
          </Link>
          <a
            href="#workflow"
            className="px-6 py-3 rounded-xl font-semibold border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-900/30 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-all text-sm"
          >
            See How It Works
          </a>
        </div>

        {/* Demo Preview Mockup */}
        <div className="mt-16 w-full max-w-5xl rounded-3xl border border-neutral-200 dark:border-neutral-900/60 p-2.5 bg-neutral-100/50 dark:bg-neutral-950/20 glass shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          
          <div className="w-full bg-[#f8fafc] dark:bg-[#070510] rounded-[1.25rem] overflow-hidden border border-neutral-200 dark:border-neutral-900/50 flex flex-col">
            {/* Header bar mock */}
            <div className="px-4 py-3 bg-neutral-100 dark:bg-neutral-900/40 border-b border-neutral-200 dark:border-neutral-900/50 flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <span className="text-[10px] text-neutral-400 font-bold ml-4 tracking-wider uppercase">VisionHire AI Dashboard Preview</span>
            </div>
            
            {/* Mock Dashboard Layout */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              {/* Left Column JD */}
              <div className="flex flex-col gap-4">
                <div className="p-4 bg-white dark:bg-neutral-950/60 rounded-2xl border border-neutral-200 dark:border-neutral-900 shadow-sm flex flex-col gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-indigo-500">
                    <Cpu className="w-3.5 h-3.5" />
                    <span>Job Description Target</span>
                  </div>
                  <p className="text-xs text-neutral-800 dark:text-neutral-300 font-medium">
                    We are looking for a Senior Full Stack Engineer... 5+ years experience, Python (FastAPI), React, Docker.
                  </p>
                </div>
                
                <div className="p-4 bg-white dark:bg-neutral-950/60 rounded-2xl border border-neutral-200 dark:border-neutral-900 shadow-sm flex flex-col gap-3">
                  <span className="text-xs font-bold text-neutral-500">RESUME DROPZONE</span>
                  <div className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-6 text-center text-xs text-neutral-400 flex flex-col items-center gap-1 bg-neutral-50 dark:bg-neutral-950/10">
                    <Zap className="w-4 h-4 text-indigo-500 animate-pulse" />
                    <span>Drop Resumes Here</span>
                  </div>
                </div>
              </div>
              
              {/* Leaderboard Column */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <span className="text-xs font-bold text-neutral-500">RANKED CANDIDATES LEADERBOARD</span>
                
                <div className="flex flex-col gap-2">
                  {/* Item 1 */}
                  <div className="p-3 bg-white dark:bg-neutral-950/60 rounded-xl border border-indigo-500/20 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-500">#1</span>
                      <div>
                        <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">Alex Mercer</h4>
                        <p className="text-[9px] text-neutral-500">Lead Full Stack Engineer • 8 yrs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/10">✓ Python</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/10">✓ React</span>
                      <span className="text-xs font-black text-indigo-500 px-2 py-1 rounded bg-indigo-500/5 border border-indigo-500/10">94%</span>
                    </div>
                  </div>
                  {/* Item 2 */}
                  <div className="p-3 bg-white dark:bg-neutral-950/60 rounded-xl border border-neutral-200 dark:border-neutral-900 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-neutral-400">#2</span>
                      <div>
                        <h4 className="font-bold text-xs text-neutral-800 dark:text-neutral-200">Sarah Connor</h4>
                        <p className="text-[9px] text-neutral-500">Data Scientist / ML Engineer • 4 yrs</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/10">✓ Python</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-neutral-200/50 text-neutral-500 font-bold border border-neutral-200/50">Docker</span>
                      <span className="text-xs font-black text-neutral-700 dark:text-neutral-300 px-2 py-1 rounded bg-neutral-100 dark:bg-neutral-900">72%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent sm:text-4xl">
            Built for Modern Recruitment Workflows
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            VisionHire AI removes bias and guess work, running heavy NLP and semantic algorithms in the background to surface the absolute best matches.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900 glass hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 mb-4">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
              Advanced NLP Extraction
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Extracts university history, years of experience, direct links, and cross-references over 2,000 technology and industry-specific keywords automatically.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900 glass hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 mb-4">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
              Multi-Metric Scoring Engine
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              A balanced ranking score assessing technical skills (40%), experience timeline (25%), degree levels (15%), and overall semantic similarity (20%).
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-900 glass hover:scale-[1.02] transition-transform duration-300">
            <div className="p-3 w-fit rounded-xl bg-indigo-500/10 text-indigo-500 mb-4">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-2">
              Comparison & Analytics
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Select multiple candidates for a side-by-side comparison. View skill density charts, hiring pipelines, and scoring distribution statistics instantly.
            </p>
          </div>
        </div>
      </section>

      {/* Pipeline Workflow Section */}
      <section id="workflow" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10 border-t border-neutral-200 dark:border-neutral-900/60">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent sm:text-4xl">
            The VisionHire Data Pipeline
          </h2>
          <p className="mt-4 text-sm sm:text-base text-neutral-500 dark:text-neutral-400">
            How we translate unstructured PDF files into ranked, structured dashboard data.
          </p>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden md:block absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-neutral-200 dark:bg-neutral-800" />
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                1
              </div>
              <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Resume Upload</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                Accepts single or multi-PDF files.
              </p>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                2
              </div>
              <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-1">NLP Extraction</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                spaCy extractors parse skills, universities, and job timelines.
              </p>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                3
              </div>
              <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Semantic Embedding</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                Embeddings calculate cosine similarity against the JD text.
              </p>
            </div>

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20 mb-4">
                4
              </div>
              <h4 className="font-extrabold text-sm text-neutral-800 dark:text-neutral-200 mb-1">Dashboard Render</h4>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400 max-w-[200px]">
                Leaderboards, analytics, and radar metrics are updated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-tr from-indigo-900/10 to-violet-900/10 py-16 text-center border-t border-neutral-200 dark:border-neutral-900/60 relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-white dark:to-neutral-400 bg-clip-text text-transparent sm:text-4xl">
            Ready to Accelerate Your Recruitment?
          </h2>
          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto">
            Experience the automated resume intelligence platform built for modern engineering and product teams.
          </p>
          <div className="mt-8">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 transition-all text-sm"
            >
              Enter Application Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-xs text-neutral-500 border-t border-neutral-200 dark:border-neutral-900/40 bg-white/20 dark:bg-neutral-950/20 relative z-10">
        <p>© 2026 VisionHire AI. Created for modern hiring teams.</p>
      </footer>
    </div>
  )
}
