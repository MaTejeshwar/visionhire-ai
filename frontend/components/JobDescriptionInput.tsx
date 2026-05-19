"use client"

import { useState } from "react"
import { Sparkles, Save, Edit3, ArrowRight } from "lucide-react"

interface JobDescriptionInputProps {
  initialValue: string
  onSave: (text: string) => Promise<void>
}

export default function JobDescriptionInput({ initialValue, onSave }: JobDescriptionInputProps) {
  const [text, setText] = useState(initialValue)
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (!text.trim()) return
    setSaving(true)
    try {
      await onSave(text)
      setIsEditing(false)
    } catch (e) {
      console.error("Failed to save job description", e)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="w-full glass rounded-2xl p-6 shadow-sm flex flex-col gap-4 border border-indigo-500/10 hover:border-indigo-500/20 transition-all duration-300">
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-900">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-500">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="font-bold text-base text-neutral-800 dark:text-neutral-200">
            Target Job Description
          </h3>
        </div>

        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10 transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            Edit JD
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setText(initialValue)
                setIsEditing(false)
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors cursor-pointer"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
              disabled={saving || !text.trim()}
            >
              <Save className="w-3.5 h-3.5" />
              {saving ? "Saving..." : "Apply JD"}
            </button>
          </div>
        )}
      </div>

      {!isEditing ? (
        <div className="relative group">
          <div className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 max-h-40 overflow-y-auto pr-2 scrollbar-thin">
            {text || "No job description set. Click Edit to add one."}
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white dark:from-[#0b0816] to-transparent pointer-events-none opacity-50" />
        </div>
      ) : (
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste the job description here..."
          className="w-full h-44 p-4 text-sm leading-relaxed bg-white/50 dark:bg-neutral-950/50 border border-neutral-200 dark:border-neutral-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 dark:focus:ring-indigo-500/30 focus:border-indigo-500 resize-none transition-all scrollbar-thin"
          disabled={saving}
        />
      )}

      {/* Mini Helper Text */}
      <div className="text-[11px] text-neutral-500 dark:text-neutral-500 flex items-center gap-1 mt-1">
        <span>VisionHire will automatically re-score all candidates upon saving.</span>
      </div>
    </div>
  )
}
