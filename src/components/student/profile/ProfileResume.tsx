"use client";

import { FileText, Download, Upload, Loader2, Sparkles } from "lucide-react";

interface ProfileResumeProps {
  resumeUrl: string;
  resumeName: string;
  resumeUpdatedAt: string;
  uploadingResume: boolean;
  headline: string;
  setHeadline: (val: string) => void;
  onUploadResume: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfileResume({
  resumeUrl,
  resumeName,
  resumeUpdatedAt,
  uploadingResume,
  headline,
  setHeadline,
  onUploadResume,
}: ProfileResumeProps) {
  return (
    <>
      {/* 2. RESUME SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-600/10 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Resume</h3>
              <p className="text-[11px] text-slate-500">Recruiters review this document when screening your job applications</p>
            </div>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">Supported: PDF format up to 5 MB</span>
        </div>

        {resumeUrl ? (
          <div className="p-4 rounded-2xl bg-blue-50/40 dark:bg-slate-950 border border-blue-200/70 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 dark:bg-blue-600/20 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                PDF
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  {resumeName || "Uploaded_Resume.pdf"}
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Uploaded on {resumeUpdatedAt || "Recently"}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={resumeUrl}
                download
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 transition shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </a>

              <label className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition shadow-xs">
                {uploadingResume ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>{uploadingResume ? "Uploading..." : "Upload New Resume"}</span>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={onUploadResume}
                  disabled={uploadingResume}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-300 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
                PDF
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-sm">
                  No resume uploaded yet
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Upload your CV in PDF format so recruiters can review your full background
                </div>
              </div>
            </div>

            <label className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition shadow-xs">
              {uploadingResume ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Upload className="w-4 h-4" />
              )}
              <span>{uploadingResume ? "Uploading..." : "Upload Resume (PDF)"}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={onUploadResume}
                disabled={uploadingResume}
                className="hidden"
              />
            </label>
          </div>
        )}
      </div>

      {/* 3. RESUME HEADLINE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-sm space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-600/10 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Resume headline</h3>
              <p className="text-[11px] text-slate-500">Concise 1-line professional tagline that appears right beneath your name</p>
            </div>
          </div>
        </div>

        <textarea
          rows={2}
          value={headline}
          onChange={(e) => setHeadline(e.target.value)}
          placeholder="e.g. B.Tech ECS 2025 | Aspiring Software Engineer | JavaScript, React JS, Node JS, SQL"
          className="w-full px-4 py-3 rounded-2xl bg-amber-50/30 dark:bg-slate-950 border border-amber-200/80 dark:border-slate-700 text-slate-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:border-amber-500 transition leading-relaxed"
        />
      </div>
    </>
  );
}
