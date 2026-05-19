"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Upload, File, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react"

interface FileUploadProps {
  onUpload: (files: File[]) => Promise<void>
  onGenerateMock: () => Promise<void>
}

export default function FileUpload({ onUpload, onGenerateMock }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mockLoading, setMockLoading] = useState(false)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files))
    }
  }

  const processFiles = async (files: File[]) => {
    // Filter PDF and TXT
    const validFiles = files.filter(f => {
      const ext = f.name.split('.').pop()?.toLowerCase()
      return ext === 'pdf' || ext === 'txt'
    })

    if (validFiles.length === 0) {
      setError("Please upload only PDF or TXT resume files.")
      setTimeout(() => setError(null), 4000)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)
    
    try {
      await onUpload(validFiles)
      setSuccess(`Successfully processed ${validFiles.length} resumes.`)
      setTimeout(() => setSuccess(null), 4000)
    } catch (e) {
      console.error(e)
      setError("An error occurred during resume parsing.")
    } finally {
      setLoading(false)
    }
  }

  const triggerMockGeneration = async () => {
    setMockLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await onGenerateMock()
      setSuccess("Successfully loaded 5 high-quality mock candidates!")
      setTimeout(() => setSuccess(null), 4000)
    } catch (e) {
      console.error(e)
      setError("Failed to generate mock resumes.")
    } finally {
      setMockLoading(false)
    }
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Upload Drag & Drop Container */}
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`w-full h-56 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all duration-300 ${
          dragActive
            ? "border-indigo-500 bg-indigo-500/5 shadow-md shadow-indigo-500/10Scale scale-[1.01]"
            : "border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-700 bg-white/30 dark:bg-neutral-950/20"
        } glass relative overflow-hidden`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.txt"
          onChange={handleFileChange}
          className="hidden"
          disabled={loading || mockLoading}
        />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
            <div>
              <p className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">Processing Resumes...</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">Extracting text, running NLP parser, scoring metrics...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 rounded-2xl bg-neutral-100 dark:bg-neutral-900 text-neutral-500 dark:text-neutral-400 group-hover:scale-105 transition-transform duration-300">
              <Upload className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <p className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">
                Drag & drop candidate resumes
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-500 mt-1">
                Supports PDF and TXT formats (up to 10MB)
              </p>
            </div>
            <button
              type="button"
              className="mt-2 px-3 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-900 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300 transition-colors"
            >
              Browse Files
            </button>
          </div>
        )}
      </div>

      {/* Quick Mock Generator & Feedback */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <button
          onClick={triggerMockGeneration}
          disabled={loading || mockLoading}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50 transition-all cursor-pointer group"
        >
          {mockLoading ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
          )}
          {mockLoading ? "Generating..." : "Load Mock Candidates"}
        </button>

        <div className="flex-1 flex items-center justify-end text-right min-w-[200px]">
          {error && (
            <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold animate-pulse-slow">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold animate-fade-in">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{success}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
