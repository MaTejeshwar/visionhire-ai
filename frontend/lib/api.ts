const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1"

export interface CandidateBrief {
  id: string
  name: string
  email: string | null
  phone: string | null
  score: number
  skills: string[]
  experience_years: number
  seniority_level: string
  ats_score: number
  education: Array<{
    degree: string
    major: string
    institution: string
    year: string
  }>
  match_category: string
  breakdown: {
    skills_score: number
    experience_score: number
    education_score: number
    semantic_score: number
  }
  insights: {
    strengths: string[]
    weaknesses: string[]
    explanation: string
  }
  skills_match: {
    matched: string[]
    missing: string[]
  }
}

export interface CandidateDetail extends Omit<CandidateBrief, 'breakdown' | 'insights' | 'skills_match'> {
  links: string[]
  summary: string
  experience_timeline: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  ats_strengths: string[]
  ats_warnings: string[]
  score_details: {
    total_score: number
    breakdown: {
      skills_score: number
      experience_score: number
      education_score: number
      semantic_score: number
    }
    skills_match: {
      matched: string[]
      missing: string[]
    }
    insights: {
      strengths: string[]
      weaknesses: string[]
      explanation: string
    }
  }
  raw_text_preview: string
}

export interface AnalyticsData {
  candidate_count: number
  average_score: number
  score_distribution: Array<{ range: string; count: number }>
  top_skills: Array<{ skill: string; count: number }>
  seniority_distribution: Array<{ level: string; count: number }>
}

export interface CompareData {
  id: string
  name: string
  score: number
  seniority: string
  experience_years: number
  education: string
  skills_score: number
  experience_score: number
  education_score: number
  semantic_score: number
  matched_skills: string[]
  missing_skills: string[]
  ats_score: number
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  })

  if (!response.ok) {
    const errText = await response.text()
    throw new Error(errText || `API error: ${response.status}`)
  }

  return response.json() as Promise<T>
}

export const api = {
  getJobDescription: () => 
    request<{ text: string }>("/job-description"),

  updateJobDescription: (text: string) => 
    request<{ message: string; text: string }>("/job-description", {
      method: "POST",
      body: JSON.stringify({ text }),
    }),

  uploadResumes: async (files: File[]): Promise<{ message: string; candidates: CandidateBrief[] }> => {
    const formData = new FormData()
    files.forEach((file) => formData.append("files", file))

    const url = `${API_BASE_URL}/upload-resumes`
    const response = await fetch(url, {
      method: "POST",
      body: formData, // fetch will automatically set multipart/form-data with boundaries
    })

    if (!response.ok) {
      const errText = await response.text()
      throw new Error(errText || `Upload failed: ${response.status}`)
    }

    return response.json()
  },

  generateMockResumes: () => 
    request<{ message: string; candidates: CandidateBrief[] }>("/generate-mock-resumes", {
      method: "POST",
    }),

  getCandidates: (search?: string) => {
    const query = search ? `?search=${encodeURIComponent(search)}` : ""
    return request<CandidateBrief[]>(`/candidates${query}`)
  },

  getCandidate: (id: string) => 
    request<CandidateDetail>(`/candidates/${id}`),

  getAnalytics: () => 
    request<AnalyticsData>("/analytics"),

  compareCandidates: (ids: string[]) => 
    request<CompareData[]>("/compare", {
      method: "POST",
      body: JSON.stringify({ candidate_ids: ids }),
    })
}
