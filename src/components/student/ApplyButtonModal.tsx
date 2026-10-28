"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Send, 
  Loader2, 
  CheckCircle2, 
  FileText, 
  Upload, 
  AlertCircle,
  X 
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

interface ApplyButtonModalProps {
  jobId: string;
  jobTitle: string;
  companyName: string;
  hasApplied: boolean;
  studentResumeUrl: string;
  isStudent: boolean;
}

export default function ApplyButtonModal({
  jobId,
  jobTitle,
  companyName,
  hasApplied: initialHasApplied,
  studentResumeUrl: initialResumeUrl,
  isStudent,
}: ApplyButtonModalProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [hasApplied, setHasApplied] = useState(initialHasApplied);
  const [resumeUrl, setResumeUrl] = useState(initialResumeUrl);
  const [additionalInformation, setAdditionalInformation] = useState("");

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are accepted for resumes");
      return;
    }

    setUploadingResume(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setResumeUrl(data.url);
      toast.success("Resume attached successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeUrl) {
      toast.error("Please upload or attach a resume before applying");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId,
          resumeUrl,
          additionalInformation,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Application submission failed");
      }

      setHasApplied(true);
      setIsOpen(false);
      toast.success("Application submitted successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (hasApplied) {
    return (
      <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
        <CheckCircle2 className="w-4 h-4" />
        <span>Application Submitted</span>
      </div>
    );
  }

  if (!isStudent) {
    return (
      <Link
        href="/student-login"
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition"
      >
        Sign in as Student to Apply
      </Link>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm flex items-center gap-2 shadow-lg shadow-indigo-500/25 transition"
      >
        <Send className="w-4 h-4" />
        <span>Apply Now</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto no-scrollbar bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-5">
              <span className="text-xs font-semibold text-indigo-400 tracking-wider uppercase">
                Submit Application
              </span>
              <h2 className="text-xl font-bold text-white mt-1">{jobTitle}</h2>
              <p className="text-xs text-slate-400">{companyName}</p>
            </div>

            <form onSubmit={handleApply} className="space-y-5">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Resume (PDF) *
                </label>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-5 h-5 text-indigo-400" />
                    <div>
                      {resumeUrl ? (
                        <span className="text-xs font-medium text-emerald-400 block">
                          Resume ready for submission
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400 block">
                          No resume selected yet
                        </span>
                      )}
                    </div>
                  </div>

                  <label className="cursor-pointer px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/30 text-xs font-medium flex items-center gap-1.5 transition">
                    {uploadingResume ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>{resumeUrl ? "Replace PDF" : "Upload PDF"}</span>
                      </>
                    )}
                    <input
                      type="file"
                      accept=".pdf,application/pdf"
                      className="hidden"
                      onChange={handleResumeUpload}
                      disabled={uploadingResume}
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Note to Employer / Cover Note (Optional)
                </label>
                <textarea
                  rows={3}
                  value={additionalInformation}
                  onChange={(e) => setAdditionalInformation(e.target.value)}
                  placeholder="Mention why your skills align with this opening..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 transition"
                />
              </div>

              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-400">
                <AlertCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Your comprehensive student profile (education, graduation year, CGPA, skills, and portfolio) will be forwarded to {companyName}.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || !resumeUrl}
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-2 transition disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Confirm & Apply</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
