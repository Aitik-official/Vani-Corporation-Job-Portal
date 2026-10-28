"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Sparkles, 
  Loader2, 
  ShieldAlert, 
  ArrowLeft,
  CheckCircle2,
  FileText
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [companyVerified, setCompanyVerified] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    category: "Software Engineering",
    jobType: "Full-time",
    workMode: "Remote",
    location: "",
    salaryMin: "",
    salaryMax: "",
    compensationPeriod: "Per Annum",
    openings: 1,
    description: "",
    responsibilities: "",
    requiredSkills: "",
    qualifications: "",
    minimumExperience: 0,
    applicationDeadline: "",
  });

  useEffect(() => {
    checkCompanyStatus();
  }, []);

  const checkCompanyStatus = async () => {
    try {
      const res = await fetch("/api/companies/profile");
      const data = await res.json();
      if (res.ok && data.company) {
        setCompanyVerified(data.company.verificationStatus === "verified");
      }
    } catch {
      console.error("Failed to load verification status");
    } finally {
      setCheckingStatus(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "openings" || name === "minimumExperience" ? Number(value) : value,
    }));
  };

  const handleSaveJob = async (action: "save_draft" | "publish") => {
    if (!formData.title || !formData.location || !formData.description) {
      toast.error("Please fill in Job Title, Location, and Job Description");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
        action,
      };

      const res = await fetch("/api/companies/jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create job posting");

      toast.success(
        action === "publish"
          ? "Job published successfully!"
          : "Job saved as draft."
      );
      router.push("/company/jobs");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back button */}
      <Link
        href="/company/jobs"
        className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to job management</span>
      </Link>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Campus & Technical Hiring</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Create Job Opening</h1>
          <p className="text-sm text-slate-400 mt-1">
            Specify job requirements, compensation, and eligibility criteria.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => handleSaveJob("save_draft")}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:bg-slate-800 text-xs font-medium transition disabled:opacity-50"
          >
            Save as Draft
          </button>

          <button
            type="button"
            onClick={() => handleSaveJob("publish")}
            disabled={loading || !companyVerified}
            title={!companyVerified ? "Company verification required to publish" : ""}
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-medium flex items-center gap-2 shadow-lg shadow-violet-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Publish Job</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Verification Notice if not verified */}
      {!companyVerified && !checkingStatus && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <div>
            <strong>Notice:</strong> Your company verification is pending review. You can create and save this job as a <strong>Draft</strong> now. Once an admin approves your company, you can publish it immediately to students.
          </div>
        </div>
      )}

      {/* Basic Information */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Basic Information</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Full Stack Software Engineer (Frontend Focus)"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Job Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            >
              <option value="Software Engineering">Software Engineering</option>
              <option value="Product & Design">Product & Design</option>
              <option value="Data & AI">Data & AI</option>
              <option value="Marketing & Sales">Marketing & Sales</option>
              <option value="Operations">Operations</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Job Type *
            </label>
            <select
              name="jobType"
              value={formData.jobType}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            >
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Work Mode *
            </label>
            <select
              name="workMode"
              value={formData.workMode}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            >
              <option value="Remote">Remote</option>
              <option value="On-site">On-site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Job Location / City *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Compensation & Openings */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Compensation & Openings</h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Minimum Salary / Stipend ($)
            </label>
            <input
              type="number"
              name="salaryMin"
              value={formData.salaryMin}
              onChange={handleChange}
              placeholder="e.g. 80000"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Maximum Salary / Stipend ($)
            </label>
            <input
              type="number"
              name="salaryMax"
              value={formData.salaryMax}
              onChange={handleChange}
              placeholder="e.g. 120000"
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Compensation Period
            </label>
            <select
              name="compensationPeriod"
              value={formData.compensationPeriod}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            >
              <option value="Per Annum">Per Annum</option>
              <option value="Per Month">Per Month</option>
              <option value="LPA">LPA</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Number of Openings
            </label>
            <input
              type="number"
              min={1}
              name="openings"
              value={formData.openings}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Minimum Experience (Years)
            </label>
            <input
              type="number"
              min={0}
              name="minimumExperience"
              value={formData.minimumExperience}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Application Deadline
            </label>
            <input
              type="date"
              name="applicationDeadline"
              value={formData.applicationDeadline}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>
        </div>
      </div>

      {/* Job Details */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-5">
        <h2 className="text-base font-semibold text-white">Job Description & Requirements</h2>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Role Overview & Job Description *
          </label>
          <textarea
            rows={5}
            name="description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="Explain what the candidate will be doing and why this role is exciting..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Roles & Responsibilities
          </label>
          <textarea
            rows={4}
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleChange}
            placeholder="- Build and ship frontend components in Next.js\n- Coordinate with backend engineers on API contracts\n- Participate in code reviews and sprint planning"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Required Technical Skills (comma-separated)
          </label>
          <input
            type="text"
            name="requiredSkills"
            value={formData.requiredSkills}
            onChange={handleChange}
            placeholder="React, TypeScript, Next.js, Node.js, MongoDB"
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Educational Qualifications / Criteria
          </label>
          <input
            type="text"
            name="qualifications"
            value={formData.qualifications}
            onChange={handleChange}
            placeholder="B.Tech/B.S. in Computer Science or related degree. 2024-2026 batches eligible."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>
      </div>
    </div>
  );
}
