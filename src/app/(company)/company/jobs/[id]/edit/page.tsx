"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Briefcase, 
  DollarSign, 
  MapPin, 
  Loader2, 
  ShieldAlert, 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  Users, 
  Save, 
  FileText,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [companyVerified, setCompanyVerified] = useState(false);

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
    status: "draft" as "draft" | "published" | "closed",
  });

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/companies/jobs/${jobId}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load job details");
      }

      const job = data.job;
      setCompanyVerified(data.verificationStatus === "verified");

      setFormData({
        title: job.title || "",
        category: job.category || "Software Engineering",
        jobType: job.jobType || "Full-time",
        workMode: job.workMode || "Remote",
        location: job.location || "",
        salaryMin: job.salaryMin !== undefined && job.salaryMin !== null ? String(job.salaryMin) : "",
        salaryMax: job.salaryMax !== undefined && job.salaryMax !== null ? String(job.salaryMax) : "",
        compensationPeriod: job.compensationPeriod || "Per Annum",
        openings: job.openings || 1,
        description: job.description || "",
        responsibilities: job.responsibilities || "",
        requiredSkills: Array.isArray(job.requiredSkills)
          ? job.requiredSkills.join(", ")
          : job.requiredSkills || "",
        qualifications: job.qualifications || "",
        minimumExperience: job.minimumExperience || 0,
        applicationDeadline: job.applicationDeadline
          ? new Date(job.applicationDeadline).toISOString().split("T")[0]
          : "",
        status: job.status || "draft",
      });
    } catch (err: any) {
      toast.error(err.message || "Failed to load job");
      router.push("/company/jobs");
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.location || !formData.description) {
      toast.error("Please fill in Job Title, Location, and Job Description");
      return;
    }

    if (formData.status === "published" && !companyVerified) {
      toast.error("Your employer profile must be verified by an administrator to publish jobs.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? Number(formData.salaryMin) : undefined,
        salaryMax: formData.salaryMax ? Number(formData.salaryMax) : undefined,
      };

      const res = await fetch(`/api/companies/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update job");

      toast.success("Job updated successfully!");
      router.push("/company/jobs");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to update job");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-slate-400">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-3" />
        <p className="text-sm">Loading job specifications...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header and Back Link */}
      <div>
        <Link
          href="/company/jobs"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition mb-3"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Manage Jobs</span>
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Edit Job Posting
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Update position requirements, eligibility parameters, compensation, and application deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                formData.status === "published"
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : formData.status === "draft"
                  ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  : "bg-slate-800 text-slate-400 border border-slate-700"
              }`}
            >
              {formData.status === "published" && <CheckCircle2 className="w-3.5 h-3.5" />}
              {formData.status === "draft" && <AlertCircle className="w-3.5 h-3.5" />}
              <span className="capitalize">{formData.status} Requisition</span>
            </span>
          </div>
        </div>
      </div>

      {/* Verification warning if unverified */}
      {!companyVerified && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3 text-amber-300">
          <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <div className="font-semibold text-amber-200">Employer Verification Pending</div>
            <p className="text-amber-300/90 leading-relaxed">
              Your company account is currently awaiting administrator verification. You may edit and save this job as a draft; it will become eligible for public publishing once approved.
            </p>
          </div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Role Overview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <Briefcase className="w-4 h-4 text-violet-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Position Details
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Job Title <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer (React/Next.js)"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Product Management">Product Management</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps & Cloud">DevOps & Cloud</option>
                <option value="QA & Testing">QA & Testing</option>
                <option value="Business Analysis">Business Analysis</option>
                <option value="Marketing & Sales">Marketing & Sales</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Work Mode</label>
              <select
                name="workMode"
                value={formData.workMode}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
                <option value="On-site">On-site</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Location <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  name="location"
                  required
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Bangalore, India or San Francisco, CA"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Number of Openings</label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="number"
                  min="1"
                  name="openings"
                  value={formData.openings}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Requisition Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="published">Published (Visible to all students)</option>
                <option value="draft">Draft (Hidden from applicants)</option>
                <option value="closed">Closed (No longer accepting applications)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Compensation & Deadlines */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Compensation & Application Timeline
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Minimum Salary / Stipend</label>
              <input
                type="number"
                name="salaryMin"
                placeholder="e.g. 800000"
                value={formData.salaryMin}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Maximum Salary / Stipend</label>
              <input
                type="number"
                name="salaryMax"
                placeholder="e.g. 1400000"
                value={formData.salaryMax}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Period / Frequency</label>
              <select
                name="compensationPeriod"
                value={formData.compensationPeriod}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              >
                <option value="Per Annum">Per Annum (CTC)</option>
                <option value="Per Month">Per Month</option>
                <option value="Fixed Stipend">Fixed Stipend</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Min Experience (Years)</label>
              <input
                type="number"
                min="0"
                name="minimumExperience"
                value={formData.minimumExperience}
                onChange={handleChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
              />
            </div>

            <div className="md:col-span-2 space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Application Deadline</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="date"
                  name="applicationDeadline"
                  value={formData.applicationDeadline}
                  onChange={handleChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-violet-500 transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Requirements, Skills & Responsibilities */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
            <FileText className="w-4 h-4 text-indigo-400" />
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider">
              Role Scope & Requirements
            </h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Job Description <span className="text-rose-400">*</span>
              </label>
              <textarea
                name="description"
                rows={4}
                required
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the opportunity, engineering team culture, and mission..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Key Responsibilities (Day-to-day deliverables)
              </label>
              <textarea
                name="responsibilities"
                rows={3}
                value={formData.responsibilities}
                onChange={handleChange}
                placeholder="• Architect reliable full-stack features using Next.js and TypeScript&#10;• Collaborate with cross-functional product designers..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition resize-y"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Required Skills (Comma-separated)
              </label>
              <input
                type="text"
                name="requiredSkills"
                value={formData.requiredSkills}
                onChange={handleChange}
                placeholder="React, TypeScript, Node.js, MongoDB, Tailwind CSS, Git"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
              <p className="text-[11px] text-slate-500">
                These tags power the smart skill-matching percentage displayed on student dashboards.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Educational Qualifications & Criteria
              </label>
              <input
                type="text"
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                placeholder="B.Tech/B.E in Computer Science, IT, or equivalent with 7.0+ CGPA"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <Link
            href="/company/jobs"
            className="w-full sm:w-auto px-5 py-2.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 text-sm font-medium transition text-center"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={submitting}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm transition shadow-sm disabled:opacity-50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Updates...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

