"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Users, 
  Search, 
  Briefcase, 
  GraduationCap, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ExternalLink, 
  X, 
  Loader2, 
  Mail, 
  Phone, 
  MapPin, 
  Globe, 
  Link2,
  Calendar,
  Download,
  Columns3,
  Video,
  ChevronRight,
  Sparkles
} from "lucide-react";
import { toast } from "sonner";
import { exportApplicantsToCsv, ExportApplicantData } from "@/lib/csvExport";
import { downloadIcsCalendar, getGoogleCalendarUrl } from "@/lib/calendar";

export interface InterviewDetails {
  scheduledAt: string;
  roundTitle: string;
  mode: "Google Meet" | "Zoom" | "Microsoft Teams" | "On-site" | "Phone";
  meetingLink?: string;
  notes?: string;
  status: "scheduled" | "completed" | "cancelled";
}

export interface ApplicantItem {
  _id: string;
  studentId: {
    _id: string;
    userId: {
      _id: string;
      name: string;
      email: string;
    };
    phone?: string;
    college: string;
    degree: string;
    specialization?: string;
    graduationYear: number;
    cgpa?: number;
    skills: string[];
    experience?: string;
    projects?: string;
    certifications?: string;
    resumeUrl?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    portfolioUrl?: string;
    location?: string;
  };
  jobId: {
    _id: string;
    title: string;
    location: string;
    jobType: string;
    workMode: string;
    requiredSkills: string[];
    salaryMin?: number;
    salaryMax?: number;
  };
  resumeUrl: string;
  additionalInformation?: string;
  status: "applied" | "under_review" | "shortlisted" | "rejected" | "selected";
  interview?: InterviewDetails;
  appliedAt: string;
}

const PIPELINE_COLUMNS: {
  id: "applied" | "under_review" | "shortlisted" | "selected" | "rejected";
  label: string;
  solidColor: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
}[] = [
  {
    id: "applied",
    label: "Applied",
    solidColor: "bg-blue-600",
    badgeBg: "bg-blue-500/10",
    badgeText: "text-blue-400",
    borderColor: "border-blue-500/30",
  },
  {
    id: "under_review",
    label: "Under Review",
    solidColor: "bg-amber-600",
    badgeBg: "bg-amber-500/10",
    badgeText: "text-amber-400",
    borderColor: "border-amber-500/30",
  },
  {
    id: "shortlisted",
    label: "Shortlisted",
    solidColor: "bg-emerald-600",
    badgeBg: "bg-emerald-500/10",
    badgeText: "text-emerald-400",
    borderColor: "border-emerald-500/30",
  },
  {
    id: "selected",
    label: "Selected / Hired",
    solidColor: "bg-violet-600",
    badgeBg: "bg-violet-500/10",
    badgeText: "text-violet-400",
    borderColor: "border-violet-500/30",
  },
  {
    id: "rejected",
    label: "Rejected",
    solidColor: "bg-rose-600",
    badgeBg: "bg-rose-500/10",
    badgeText: "text-rose-400",
    borderColor: "border-rose-500/30",
  },
];

export default function CompanyApplicantsPage() {
  const searchParams = useSearchParams();
  const [applicants, setApplicants] = useState<ApplicantItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"kanban" | "split">("kanban");
  
  // Selected applicant for Split View (inline right column)
  const [selectedApplicant, setSelectedApplicant] = useState<ApplicantItem | null>(null);

  // Filters state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
  const [jobFilter, setJobFilter] = useState(searchParams.get("jobId") || "all");
  const [degreeFilter, setDegreeFilter] = useState("all");
  const [minCgpaFilter, setMinCgpaFilter] = useState("all");
  const [gradYearFilter, setGradYearFilter] = useState("all");

  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [draggedAppId, setDraggedAppId] = useState<string | null>(null);

  // Interview Scheduler Modal State
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [interviewCandidate, setInterviewCandidate] = useState<ApplicantItem | null>(null);
  const [roundTitle, setRoundTitle] = useState("Technical Round 1");
  const [scheduledDateTime, setScheduledDateTime] = useState("");
  const [interviewMode, setInterviewMode] = useState<
    "Google Meet" | "Zoom" | "Microsoft Teams" | "On-site" | "Phone"
  >("Google Meet");
  const [meetingLink, setMeetingLink] = useState("");
  const [interviewNotes, setInterviewNotes] = useState("");
  const [schedulingLoading, setSchedulingLoading] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [statusFilter, jobFilter, degreeFilter, minCgpaFilter, gradYearFilter]);

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") params.set("status", statusFilter);
      if (jobFilter && jobFilter !== "all") params.set("jobId", jobFilter);
      if (degreeFilter && degreeFilter !== "all") params.set("degree", degreeFilter);
      if (minCgpaFilter && minCgpaFilter !== "all") params.set("minCgpa", minCgpaFilter);
      if (gradYearFilter && gradYearFilter !== "all") params.set("graduationYear", gradYearFilter);
      if (search) params.set("search", search);

      const res = await fetch(`/api/companies/applicants?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        const apps: ApplicantItem[] = data.applications || [];
        setApplicants(apps);

        const targetAppId = searchParams.get("appId");
        if (targetAppId) {
          const found = apps.find((a) => a._id === targetAppId);
          if (found) {
            setSelectedApplicant(found);
            setViewMode("split");
          }
        } else if (!selectedApplicant && apps.length > 0) {
          setSelectedApplicant(apps[0]);
        }
      } else {
        toast.error(data.error || "Failed to load applicants");
      }
    } catch {
      toast.error("Network error loading applicants");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplicants();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setJobFilter("all");
    setDegreeFilter("all");
    setMinCgpaFilter("all");
    setGradYearFilter("all");
  };

  const handleUpdateStatus = async (applicationId: string, newStatus: string) => {
    setUpdatingStatus(true);
    // Optimistic update
    setApplicants((prev) =>
      prev.map((a) => (a._id === applicationId ? { ...a, status: newStatus as any } : a))
    );
    if (selectedApplicant?._id === applicationId) {
      setSelectedApplicant((prev) => (prev ? { ...prev, status: newStatus as any } : null));
    }

    try {
      const res = await fetch("/api/companies/applicants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ applicationId, status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success(`Application updated to ${newStatus.replace("_", " ")}`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update status");
      fetchApplicants(); // Revert on failure
    } finally {
      setUpdatingStatus(false);
    }
  };

  // Drag and Drop handlers for Kanban
  const handleDragStart = (appId: string) => {
    setDraggedAppId(appId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetStatus: string) => {
    if (!draggedAppId) return;
    const app = applicants.find((a) => a._id === draggedAppId);
    if (app && app.status !== targetStatus) {
      handleUpdateStatus(draggedAppId, targetStatus);
    }
    setDraggedAppId(null);
  };

  // Open Interview Scheduler
  const openScheduleModal = (app: ApplicantItem) => {
    setInterviewCandidate(app);
    const hasValidDate = app.interview?.scheduledAt && !isNaN(new Date(app.interview.scheduledAt).getTime());

    if (app.interview && hasValidDate) {
      setRoundTitle(app.interview.roundTitle || "Technical Round 1");
      const d = new Date(app.interview.scheduledAt);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setScheduledDateTime(isoLocal);
      setInterviewMode(app.interview.mode || "Google Meet");
      setMeetingLink(app.interview.meetingLink || "");
      setInterviewNotes(app.interview.notes || "");
    } else {
      setRoundTitle(app.interview?.roundTitle || "Technical Round 1");
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);
      const isoLocal = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setScheduledDateTime(isoLocal);
      setInterviewMode(app.interview?.mode || "Google Meet");
      setMeetingLink(app.interview?.meetingLink || "");
      setInterviewNotes(app.interview?.notes || "Please be prepared to walk through your resume and showcase past project code.");
    }
    setInterviewModalOpen(true);
  };

  const handleSaveInterview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!interviewCandidate || !scheduledDateTime) {
      toast.error("Please specify interview date and time");
      return;
    }

    setSchedulingLoading(true);
    try {
      const interviewPayload = {
        scheduledAt: new Date(scheduledDateTime).toISOString(),
        roundTitle: roundTitle.trim() || "Technical Round",
        mode: interviewMode,
        meetingLink: meetingLink.trim(),
        notes: interviewNotes.trim(),
        status: "scheduled",
      };

      const res = await fetch("/api/companies/applicants", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: interviewCandidate._id,
          interview: interviewPayload,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to schedule interview");

      toast.success("Interview scheduled & invitation sent to candidate!");
      setInterviewModalOpen(false);

      // Update state
      const updatedInterview = data.application?.interview || interviewPayload;
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === interviewCandidate._id
            ? { ...a, status: "shortlisted", interview: updatedInterview }
            : a
        )
      );
      if (selectedApplicant?._id === interviewCandidate._id) {
        setSelectedApplicant((prev) =>
          prev ? { ...prev, status: "shortlisted", interview: updatedInterview } : null
        );
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to schedule interview");
    } finally {
      setSchedulingLoading(false);
    }
  };

  // Export Filtered Applicants to CSV
  const handleExportCsv = () => {
    if (applicants.length === 0) {
      toast.error("No applicants available to export with current filters");
      return;
    }

    const exportData: ExportApplicantData[] = applicants.map((app) => ({
      candidateName: app.studentId?.userId?.name || "N/A",
      email: app.studentId?.userId?.email || "N/A",
      phone: app.studentId?.phone || "N/A",
      college: app.studentId?.college || "N/A",
      degree: app.studentId?.degree || "N/A",
      specialization: app.studentId?.specialization || "",
      graduationYear: app.studentId?.graduationYear || "N/A",
      cgpa: app.studentId?.cgpa || "N/A",
      skills: app.studentId?.skills || [],
      jobTitle: app.jobId?.title || "N/A",
      status: app.status,
      appliedDate: new Date(app.appliedAt).toLocaleDateString(),
      interviewScheduled: app.interview?.scheduledAt
        ? new Date(app.interview.scheduledAt).toLocaleString()
        : "Not Scheduled",
      interviewMode: app.interview?.mode || "N/A",
      resumeUrl: app.resumeUrl || "N/A",
    }));

    exportApplicantsToCsv(exportData);
    toast.success(`Exported ${exportData.length} applicant records to CSV`);
  };

  // Distinct jobs for dropdown
  const uniqueJobs: { id: string; title: string }[] = [];
  const seenJobIds = new Set<string>();
  applicants.forEach((item) => {
    if (item.jobId?._id && !seenJobIds.has(item.jobId._id)) {
      seenJobIds.add(item.jobId._id);
      uniqueJobs.push({ id: item.jobId._id, title: item.jobId.title });
    }
  });

  const getStatusBadge = (status: string) => {
    const col = PIPELINE_COLUMNS.find((c) => c.id === status);
    if (!col) return <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300">{status}</span>;
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${col.badgeBg} ${col.badgeText} border ${col.borderColor}`}>
        {col.label}
      </span>
    );
  };

  const isFiltersActive =
    search !== "" ||
    statusFilter !== "all" ||
    jobFilter !== "all" ||
    degreeFilter !== "all" ||
    minCgpaFilter !== "all" ||
    gradYearFilter !== "all";

  return (
    <div className="space-y-6">
      {/* Page Header with Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-400 border border-violet-500/20 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recruiter Pipeline & Candidate Workflow</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Applicant Management</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Manage hiring stages, drag-and-drop candidates, filter by eligibility, schedule interviews, and export records.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1">
            <button
              onClick={() => setViewMode("kanban")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "kanban"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Columns3 className="w-4 h-4" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode("split")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                viewMode === "split"
                  ? "bg-violet-600 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Dossier View</span>
            </button>
          </div>

          {/* Export to CSV */}
          <button
            onClick={handleExportCsv}
            disabled={applicants.length === 0}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-medium transition disabled:opacity-50 shadow-sm"
            title="Export filtered candidates to CSV"
          >
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm dark:shadow-lg space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
          <form onSubmit={handleSearchSubmit} className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, college, skills, role..."
              className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs placeholder-slate-400 focus:outline-none focus:border-violet-500 transition"
            />
          </form>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            {/* Job Filter */}
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="all">All Jobs</option>
              {uniqueJobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title}
                </option>
              ))}
            </select>

            {/* Pipeline Stage Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="all">All Stages</option>
              <option value="applied">Applied</option>
              <option value="under_review">Under Review</option>
              <option value="shortlisted">Shortlisted</option>
              <option value="selected">Selected</option>
              <option value="rejected">Rejected</option>
            </select>

            {/* Minimum CGPA Filter */}
            <select
              value={minCgpaFilter}
              onChange={(e) => setMinCgpaFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="all">Any CGPA</option>
              <option value="7.0">CGPA ≥ 7.0</option>
              <option value="7.5">CGPA ≥ 7.5</option>
              <option value="8.0">CGPA ≥ 8.0</option>
              <option value="8.5">CGPA ≥ 8.5</option>
              <option value="9.0">CGPA ≥ 9.0</option>
            </select>

            {/* Degree Filter */}
            <select
              value={degreeFilter}
              onChange={(e) => setDegreeFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="all">All Degrees</option>
              <option value="B.Tech">B.Tech / B.E.</option>
              <option value="M.Tech">M.Tech</option>
              <option value="BCA">BCA</option>
              <option value="MCA">MCA</option>
              <option value="B.Sc">B.Sc</option>
            </select>

            {/* Graduation Year Filter */}
            <select
              value={gradYearFilter}
              onChange={(e) => setGradYearFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="all">All Batches</option>
              <option value="2024">2024 Batch</option>
              <option value="2025">2025 Batch</option>
              <option value="2026">2026 Batch</option>
              <option value="2027">2027 Batch</option>
            </select>

            {isFiltersActive && (
              <button
                onClick={handleResetFilters}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Counter Info Bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-200 dark:border-slate-800/80 pt-2 px-1">
          <span>
            Showing <strong className="text-slate-900 dark:text-white font-medium">{applicants.length}</strong> qualified applicant{applicants.length === 1 ? "" : "s"}
          </span>
          <span className="hidden sm:inline">Tip: Drag cards between columns in Kanban to advance candidates</span>
        </div>
      </div>

      {/* Main View Area */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 bg-slate-900/40 rounded-2xl border border-slate-800">
          <Loader2 className="w-8 h-8 animate-spin text-violet-500 mb-3" />
          <p className="text-xs text-slate-400">Loading candidate pipelines...</p>
        </div>
      ) : applicants.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-white">No applicants match criteria</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms, minimum CGPA, or degree filter to expand your search.
          </p>
          {isFiltersActive && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-slate-800 text-xs text-white hover:bg-slate-700 transition"
            >
              Clear All Filters
            </button>
          )}
        </div>
      ) : viewMode === "kanban" ? (
        /* ================= KANBAN PIPELINE VIEW ================= */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto no-scrollbar pb-4">
          {PIPELINE_COLUMNS.map((column) => {
            const columnApps = applicants.filter((a) => a.status === column.id);
            return (
              <div
                key={column.id}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
                className="bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-3 flex flex-col min-h-[560px] shadow-sm transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200 dark:border-slate-800 px-1">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${column.solidColor}`} />
                    <h3 className="font-semibold text-xs text-slate-900 dark:text-white">{column.label}</h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {columnApps.length}
                  </span>
                </div>

                {/* Cards Container with Invisible Scrollbar */}
                <div className="space-y-3 flex-1 overflow-y-auto no-scrollbar max-h-[750px] pr-0.5">
                  {columnApps.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 rounded-xl text-center p-3 text-[11px] text-slate-400 dark:text-slate-600">
                      Drop candidate here
                    </div>
                  ) : (
                    columnApps.map((app) => {
                      const student = app.studentId;
                      const name = student?.userId?.name || "Candidate";
                      const hasInterview = Boolean(app.interview?.scheduledAt && !isNaN(new Date(app.interview.scheduledAt).getTime()));

                      return (
                        <div
                          key={app._id}
                          draggable
                          onDragStart={() => handleDragStart(app._id)}
                          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-violet-500/50 cursor-grab active:cursor-grabbing transition group flex flex-col gap-2.5 no-scrollbar"
                        >
                          {/* Card Top: Candidate Info */}
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-lg bg-violet-50 dark:bg-slate-800 border border-violet-200 dark:border-slate-700 flex items-center justify-center font-bold text-xs text-violet-600 dark:text-violet-400 shrink-0">
                                {name[0]}
                              </div>
                              <div className="min-w-0">
                                <h4
                                  onClick={() => {
                                    setSelectedApplicant(app);
                                    setViewMode("split");
                                  }}
                                  className="font-semibold text-slate-900 dark:text-white text-xs truncate hover:text-violet-600 dark:hover:text-violet-400 cursor-pointer transition"
                                >
                                  {name}
                                </h4>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                                  {student?.college || "University"}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Role Tag */}
                          <div className="bg-slate-50 dark:bg-slate-950/80 px-2 py-1 rounded-md text-[10px] text-slate-700 dark:text-slate-300 truncate border border-slate-200 dark:border-slate-800/80 flex items-center gap-1">
                            <Briefcase className="w-3 h-3 text-slate-400 dark:text-slate-500 shrink-0" />
                            <span className="truncate">{app.jobId?.title}</span>
                          </div>

                          {/* Academic Snapshot */}
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                            {student?.degree && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                                {student.degree}
                              </span>
                            )}
                            {student?.cgpa !== undefined && (
                              <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold border border-emerald-200 dark:border-emerald-500/20">
                                {student.cgpa} CGPA
                              </span>
                            )}
                            {student?.graduationYear && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700">
                                Batch '{String(student.graduationYear).slice(-2)}
                              </span>
                            )}
                          </div>

                          {/* Interview Scheduled Badge (if active) */}
                          {hasInterview && (
                            <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-500/30 text-[10px] text-emerald-800 dark:text-emerald-300 flex items-center justify-between gap-1">
                              <div className="flex items-center gap-1.5 truncate">
                                <Video className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                                <span className="truncate">
                                  {new Date(app.interview!.scheduledAt).toLocaleDateString([], {
                                    month: "short",
                                    day: "numeric",
                                  })} • {app.interview?.mode}
                                </span>
                              </div>
                              <button
                                onClick={() => openScheduleModal(app)}
                                className="text-emerald-700 dark:text-emerald-400 hover:underline font-semibold shrink-0"
                              >
                                Edit
                              </button>
                            </div>
                          )}

                          {/* Quick Actions Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-[10px]">
                            <button
                              onClick={() => {
                                setSelectedApplicant(app);
                                setViewMode("split");
                              }}
                              className="text-slate-500 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 font-medium flex items-center gap-1 transition"
                            >
                              <span>Dossier</span>
                              <ChevronRight className="w-3 h-3" />
                            </button>

                            <div className="flex items-center gap-1.5">
                              {/* Schedule interview button */}
                              <button
                                onClick={() => openScheduleModal(app)}
                                className="p-1 rounded text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                title="Schedule Interview"
                              >
                                <Calendar className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                              </button>

                              {/* Quick Stage Mover Dropdown */}
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                                className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-300 rounded px-1.5 py-0.5 text-[10px] focus:outline-none"
                              >
                                <option value="applied">Applied</option>
                                <option value="under_review">Review</option>
                                <option value="shortlisted">Shortlist</option>
                                <option value="selected">Select</option>
                                <option value="rejected">Reject</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ================= SPLIT LIST & DOSSIER VIEW ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left List */}
          <div className="lg:col-span-1 space-y-3 max-h-[85vh] overflow-y-auto no-scrollbar pr-0.5">
            {applicants.map((app) => {
              const isSelected = selectedApplicant?._id === app._id;
              const student = app.studentId;
              const name = student?.userId?.name || "Candidate";
              return (
                <div
                  key={app._id}
                  onClick={() => setSelectedApplicant(app)}
                  className={`p-4 rounded-xl border cursor-pointer transition flex flex-col gap-2 ${
                    isSelected
                      ? "bg-white dark:bg-slate-900 border-violet-500 shadow-md shadow-violet-500/10"
                      : "bg-white dark:bg-slate-900/70 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-lg bg-violet-50 dark:bg-slate-800 border border-violet-200 dark:border-slate-700 flex items-center justify-center font-bold text-sm text-violet-600 dark:text-violet-400 shrink-0">
                        {name[0]}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">{name}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                          {student?.college || "University"}
                        </p>
                      </div>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mt-1">
                    <span className="truncate max-w-[160px]">{app.jobId?.title}</span>
                    <span>{new Date(app.appliedAt).toLocaleDateString()}</span>
                  </div>

                  {app.interview?.scheduledAt && !isNaN(new Date(app.interview.scheduledAt).getTime()) && (
                    <div className="text-[10px] text-emerald-700 dark:text-emerald-400 flex items-center gap-1 font-medium bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20 w-fit">
                      <Calendar className="w-3 h-3" />
                      <span>Interview: {new Date(app.interview.scheduledAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Dossier Detail View (Embedded in Page) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="flex items-center justify-between pb-1">
              <button
                onClick={() => setViewMode("kanban")}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition shadow-sm"
              >
                <span>← Back to Kanban Pipeline</span>
              </button>
            </div>
            {selectedApplicant ? (
              <CandidateDossierCard
                applicant={selectedApplicant}
                onUpdateStatus={handleUpdateStatus}
                onOpenSchedule={() => openScheduleModal(selectedApplicant)}
                updatingStatus={updatingStatus}
                getStatusBadge={getStatusBadge}
              />
            ) : (
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center text-slate-500">
                Select a candidate from the left to view complete dossier
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= INTERVIEW SCHEDULER MODAL ================= */}
      {interviewModalOpen && interviewCandidate && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setInterviewModalOpen(false);
          }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/80 backdrop-blur-sm"
        >
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto no-scrollbar p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base">Schedule Interview</h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Candidate: <strong className="text-slate-900 dark:text-slate-200">{interviewCandidate.studentId?.userId?.name}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInterviewModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveInterview} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Interview Round Title
                </label>
                <input
                  type="text"
                  required
                  value={roundTitle}
                  onChange={(e) => setRoundTitle(e.target.value)}
                  placeholder="e.g. Round 1: Technical Screening"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Date & Time (Local)
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Meeting Mode
                  </label>
                  <select
                    value={interviewMode}
                    onChange={(e) => setInterviewMode(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                  >
                    <option value="Google Meet">Google Meet</option>
                    <option value="Zoom">Zoom</option>
                    <option value="Microsoft Teams">Microsoft Teams</option>
                    <option value="On-site">On-site Campus / Office</option>
                    <option value="Phone">Phone Screening</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Meeting Link or Location
                </label>
                <input
                  type="text"
                  value={meetingLink}
                  onChange={(e) => setMeetingLink(e.target.value)}
                  placeholder="https://meet.google.com/xxx-xxxx-xxx or Room 402, Block A"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Notes & Preparation Guide
                </label>
                <textarea
                  rows={3}
                  value={interviewNotes}
                  onChange={(e) => setInterviewNotes(e.target.value)}
                  placeholder="Instructions for the student (e.g. have laptop ready, camera on)..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setInterviewModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={schedulingLoading}
                  className="px-5 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-xs font-semibold flex items-center gap-1.5 transition disabled:opacity-50 shadow-sm"
                >
                  {schedulingLoading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save & Notify Student</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Subcomponent: Dossier Detail Card
function CandidateDossierCard({
  applicant,
  onUpdateStatus,
  onOpenSchedule,
  updatingStatus,
  getStatusBadge,
}: {
  applicant: ApplicantItem;
  onUpdateStatus: (id: string, status: string) => void;
  onOpenSchedule: () => void;
  updatingStatus: boolean;
  getStatusBadge: (status: string) => React.ReactNode;
}) {
  const student = applicant.studentId;
  const interview = applicant.interview;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm dark:shadow-2xl no-scrollbar">
      {/* Header with Avatar & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 flex items-center justify-center font-bold text-2xl text-white shadow-md shadow-violet-500/20 shrink-0">
            {student?.userId?.name?.[0] || "C"}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {student?.userId?.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              Applied for <span className="text-slate-900 dark:text-white font-medium">{applicant.jobId?.title}</span>
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{student?.userId?.email}</span>
              </span>
              {student?.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student?.phone}</span>
                </span>
              )}
              {student?.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student?.location}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status selector & Interview CTA */}
        <div className="flex flex-col sm:items-end gap-2.5">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 dark:text-slate-400">Pipeline Status:</span>
            {getStatusBadge(applicant.status)}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onOpenSchedule}
              className="px-3.5 py-1.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-medium text-xs flex items-center gap-1.5 transition shadow-sm"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{interview?.scheduledAt ? "Reschedule Interview" : "Schedule Interview"}</span>
            </button>

            <select
              value={applicant.status}
              disabled={updatingStatus}
              onChange={(e) => onUpdateStatus(applicant._id, e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 text-xs focus:outline-none focus:border-violet-500 transition"
            >
              <option value="applied">Mark as Applied</option>
              <option value="under_review">Mark as Under Review</option>
              <option value="shortlisted">Mark as Shortlisted</option>
              <option value="selected">Mark as Selected / Hired</option>
              <option value="rejected">Mark as Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Active Interview Panel (If Scheduled) */}
      {interview?.scheduledAt && !isNaN(new Date(interview.scheduledAt).getTime()) && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-semibold text-xs">
              <Video className="w-4 h-4" />
              <span>Upcoming Interview: {interview.roundTitle}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 uppercase">
              {interview.status}
            </span>
          </div>

          <div className="text-xs text-slate-700 dark:text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
            <div>
              <span className="text-slate-500">Scheduled Time: </span>
              <strong className="text-slate-900 dark:text-white">
                {new Date(interview.scheduledAt).toLocaleString("en-US", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })}
              </strong>
            </div>
            <div>
              <span className="text-slate-500">Mode: </span>
              <strong className="text-slate-900 dark:text-white">{interview.mode}</strong>
            </div>
          </div>

          {interview.meetingLink && (
            <div className="text-xs pt-1">
              <span className="text-slate-500">Meeting Link: </span>
              <a
                href={interview.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="text-violet-600 dark:text-violet-400 hover:underline font-mono text-[11px] inline-flex items-center gap-1"
              >
                <span>{interview.meetingLink}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}

          {interview.notes && (
            <p className="text-xs text-slate-600 dark:text-slate-400 italic pt-1 border-t border-emerald-200 dark:border-emerald-950">
              Note to candidate: "{interview.notes}"
            </p>
          )}

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() =>
                downloadIcsCalendar({
                  title: `${interview.roundTitle} - ${applicant.jobId?.title}`,
                  description: `Interview with ${student?.userId?.name}. Notes: ${interview.notes || "None"}`,
                  location: interview.meetingLink || interview.mode,
                  startDate: interview.scheduledAt,
                })
              }
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <Download className="w-3 h-3" />
              <span>Add to Calendar (.ics)</span>
            </button>
            <a
              href={getGoogleCalendarUrl({
                title: `${interview.roundTitle} - ${applicant.jobId?.title}`,
                description: `Interview with ${student?.userId?.name}. Notes: ${interview.notes || "None"}`,
                location: interview.meetingLink || interview.mode,
                startDate: interview.scheduledAt,
              })}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Google Calendar</span>
            </a>
          </div>
        </div>
      )}

      {/* Academic Snapshot */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">
          University & Academic Profile
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Degree</div>
            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate">
              {student?.degree || "N/A"}
            </div>
            {student?.specialization && (
              <div className="text-[10px] text-slate-600 dark:text-slate-400 truncate">{student.specialization}</div>
            )}
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">College / University</div>
            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5 truncate" title={student?.college}>
              {student?.college || "N/A"}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">CGPA / Grade</div>
            <div className="font-bold text-emerald-700 dark:text-emerald-400 text-xs sm:text-sm mt-0.5">
              {student?.cgpa !== undefined ? `${student.cgpa} / 10.0` : "Not Provided"}
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 p-3.5 rounded-xl">
            <div className="text-[11px] text-slate-500 dark:text-slate-400">Graduation Year</div>
            <div className="font-semibold text-slate-900 dark:text-white text-xs sm:text-sm mt-0.5">
              {student?.graduationYear || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Resume Document Link */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Submitted Resume
        </h3>
        {applicant.resumeUrl ? (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200 dark:border-indigo-500/20">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Student Resume (PDF)</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Uploaded for this application</div>
              </div>
            </div>
            <a
              href={applicant.resumeUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium transition shadow-sm"
            >
              <span>Preview Resume</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800 text-xs text-slate-500">
            No resume file was attached.
          </div>
        )}
      </div>

      {/* Technical Skills */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Verified Skills
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {student?.skills && student.skills.length > 0 ? (
            student.skills.map((skill, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">No skills listed</span>
          )}
        </div>
      </div>

      {/* Projects */}
      {student?.projects && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Notable Projects
          </h3>
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {student.projects}
          </div>
        </div>
      )}

      {/* Work / Internship Experience */}
      {student?.experience && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
            Experience & Internships
          </h3>
          <div className="bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 rounded-xl p-4 text-xs text-slate-800 dark:text-slate-300 leading-relaxed whitespace-pre-line">
            {student.experience}
          </div>
        </div>
      )}

      {/* Social & Professional Links */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
          Portfolio & Online Profiles
        </h3>
        <div className="flex flex-wrap gap-2.5 text-xs">
          {student?.linkedinUrl && (
            <a
              href={student.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span>LinkedIn</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {student?.githubUrl && (
            <a
              href={student.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <Globe className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
              <span>GitHub</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {student?.portfolioUrl && (
            <a
              href={student.portfolioUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition"
            >
              <Link2 className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
              <span>Portfolio Website</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
          )}
          {!student?.linkedinUrl && !student?.githubUrl && !student?.portfolioUrl && (
            <span className="text-xs text-slate-500">No profile links provided</span>
          )}
        </div>
      </div>
    </div>
  );
}
