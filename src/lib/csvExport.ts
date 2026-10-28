/**
 * CSV Export Utility for OpportunityHub Applicant Dossiers
 */

export interface ExportApplicantData {
  candidateName: string;
  email: string;
  phone?: string;
  college: string;
  degree: string;
  specialization?: string;
  graduationYear: number | string;
  cgpa?: number | string;
  skills: string[];
  jobTitle: string;
  status: string;
  appliedDate: string;
  interviewScheduled?: string;
  interviewMode?: string;
  resumeUrl?: string;
}

export function exportApplicantsToCsv(
  data: ExportApplicantData[],
  fileName = `applicants_export_${new Date().toISOString().split("T")[0]}.csv`
) {
  if (typeof window === "undefined" || !data || data.length === 0) return;

  const headers = [
    "Candidate Name",
    "Email",
    "Phone",
    "College / University",
    "Degree",
    "Specialization",
    "Graduation Year",
    "CGPA",
    "Key Skills",
    "Applied Job Title",
    "Application Status",
    "Applied Date",
    "Interview Scheduled",
    "Interview Mode",
    "Resume Link",
  ];

  const escapeCsv = (val: any): string => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const rows = data.map((item) => [
    escapeCsv(item.candidateName),
    escapeCsv(item.email),
    escapeCsv(item.phone || "N/A"),
    escapeCsv(item.college),
    escapeCsv(item.degree),
    escapeCsv(item.specialization || ""),
    escapeCsv(item.graduationYear),
    escapeCsv(item.cgpa || "N/A"),
    escapeCsv(item.skills.join(", ")),
    escapeCsv(item.jobTitle),
    escapeCsv(item.status.replace("_", " ").toUpperCase()),
    escapeCsv(item.appliedDate),
    escapeCsv(item.interviewScheduled || "None"),
    escapeCsv(item.interviewMode || "N/A"),
    escapeCsv(item.resumeUrl || "N/A"),
  ]);

  // Prepend UTF-8 BOM so Excel opens special characters and commas cleanly
  const csvContent =
    "\uFEFF" + [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

