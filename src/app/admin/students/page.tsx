"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  GraduationCap, 
  Search, 
  Filter, 
  FileText, 
  ExternalLink, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Clock, 
  Award, 
  Loader2, 
  Globe,
  Building2,
  Users
} from "lucide-react";

interface StudentItem {
  _id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  degree: string;
  specialization: string;
  graduationYear: number;
  cgpa: number | null;
  skills: string[];
  resumeUrl: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
  portfolioUrl: string | null;
  registeredAt: string;
  totalApplications: number;
  interviewsCount: number;
  hiredCount: number;
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<StudentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [degreeFilter, setDegreeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");

  useEffect(() => {
    fetchStudents();
  }, [degreeFilter, yearFilter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (degreeFilter) params.append("degree", degreeFilter);
      if (yearFilter) params.append("graduationYear", yearFilter);

      const res = await fetch(`/api/admin/students?${params.toString()}`);
      const data = await res.json();
      if (res.ok) {
        setStudents(data.students || []);
      }
    } catch (err) {
      console.error("Failed to fetch students", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.email.toLowerCase().includes(q) ||
      s.college.toLowerCase().includes(q) ||
      s.skills.some((sk) => sk.toLowerCase().includes(q))
    );
  });

  const totalRegistered = students.length;
  const totalHired = students.filter((s) => s.hiredCount > 0).length;
  const inInterviews = students.filter((s) => s.interviewsCount > 0 && s.hiredCount === 0).length;
  const avgCgpa =
    students.filter((s) => s.cgpa).length > 0
      ? (
          students.reduce((acc, s) => acc + (s.cgpa || 0), 0) /
          students.filter((s) => s.cgpa).length
        ).toFixed(2)
      : "—";

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-2">
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Placement Cell Academic Governance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Student Roster & Placement Records
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Inspect student profiles, verify academic qualifications, track recruitment progress, and review submitted credentials.
        </p>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Enrolled</span>
            <Users className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{totalRegistered}</div>
          <div className="text-xs text-slate-500 mt-1">Registered candidate profiles</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-emerald-400 text-xs font-medium">
            <span>Offers Secured</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">{totalHired}</div>
          <div className="text-xs text-emerald-400/80 mt-1 font-medium">
            {totalRegistered > 0 ? `${Math.round((totalHired / totalRegistered) * 100)}% placement rate` : "0%"}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-indigo-400 text-xs font-medium">
            <span>In Interview Rounds</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-indigo-400 mt-2">{inInterviews}</div>
          <div className="text-xs text-indigo-400/80 mt-1 font-medium">Active evaluation stage</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Batch Average CGPA</span>
            <GraduationCap className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-white mt-2">{avgCgpa}</div>
          <div className="text-xs text-slate-500 mt-1">Academic grade index</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-sm">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by student name, email, college, or skills (e.g. React, Python)..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={degreeFilter}
            onChange={(e) => setDegreeFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="">All Degrees</option>
            <option value="B.Tech">B.Tech / B.E</option>
            <option value="M.Tech">M.Tech</option>
            <option value="MCA">MCA</option>
            <option value="B.Sc">B.Sc</option>
            <option value="BCA">BCA</option>
          </select>

          <select
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="">All Grad Batches</option>
            <option value="2027">2027</option>
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-slate-400">
            <Loader2 className="w-7 h-7 animate-spin text-emerald-500 mr-2" />
            <span className="text-sm">Loading student directory...</span>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-sm font-semibold text-white">No students match your query</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Try adjusting your search keywords, clearing branch filters, or searching for broader skills.
            </p>
          </div>
        ) : (
          <div>
            {/* Responsive Mobile Cards for Students (Visible on screens < 768px) */}
            <div className="grid grid-cols-1 gap-3 md:hidden p-3">
              {filteredStudents.map((student) => (
                <div
                  key={student._id}
                  className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-bold text-white text-base leading-snug">{student.name}</h3>
                      <div className="text-slate-400 text-xs flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{student.email}</span>
                      </div>
                      {student.phone && student.phone !== "—" && (
                        <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3" />
                          <span>{student.phone}</span>
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 text-right">
                      {student.cgpa ? (
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                            student.cgpa >= 8.5
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : student.cgpa >= 7.0
                              ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                              : "bg-slate-800 text-slate-300 border border-slate-700"
                          }`}
                        >
                          {student.cgpa.toFixed(1)} CGPA
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px]">No CGPA</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800/80">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Academic:</span>
                      <span className="text-right font-medium text-slate-200">
                        {student.degree} ({student.specialization || "General"})
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Institution:</span>
                      <span className="text-right truncate max-w-[180px]">{student.college}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Batch:</span>
                      <span>Class of {student.graduationYear}</span>
                    </div>
                  </div>

                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {student.skills.slice(0, 4).map((skill) => (
                        <span
                          key={skill}
                          className="px-1.5 py-0.5 rounded text-[10px] bg-slate-900 border border-slate-800 text-slate-300"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 4 && (
                        <span className="px-1 py-0.5 rounded text-[9px] text-slate-500">
                          +{student.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                    <div>
                      {student.hiredCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Placed</span>
                        </span>
                      ) : student.interviewsCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          <Clock className="w-3 h-3" />
                          <span>Interviewing</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-400">
                          {student.totalApplications} applied
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {student.resumeUrl ? (
                        <a
                          href={student.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-medium text-[11px] transition"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Resume</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      ) : (
                        <span className="text-[10px] text-slate-600">No Resume</span>
                      )}

                      {student.linkedinUrl && (
                        <a
                          href={student.linkedinUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-500 hover:text-indigo-400 transition"
                          title="LinkedIn Profile"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.37 9.74v-8.37H5.1v8.37h2.73z" />
                          </svg>
                        </a>
                      )}

                      {student.githubUrl && (
                        <a
                          href={student.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1 rounded text-slate-500 hover:text-white transition"
                          title="GitHub Portfolio"
                        >
                          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table View (Visible on screens >= 768px) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3.5">Student / Contact</th>
                    <th className="px-5 py-3.5">Degree & College</th>
                    <th className="px-5 py-3.5">Batch & CGPA</th>
                    <th className="px-5 py-3.5">Verified Skills</th>
                    <th className="px-5 py-3.5">Placement Status</th>
                    <th className="px-5 py-3.5 text-right">Credentials</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredStudents.map((student) => (
                    <tr key={student._id} className="hover:bg-slate-800/40 transition">
                      {/* Student Info */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-white text-sm">{student.name}</div>
                        <div className="flex items-center gap-1.5 text-slate-400 text-[11px] mt-0.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{student.email}</span>
                        </div>
                        {student.phone && student.phone !== "—" && (
                          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] mt-0.5">
                            <Phone className="w-2.5 h-2.5" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Degree & College */}
                      <td className="px-5 py-4">
                        <div className="text-slate-200 font-medium">{student.degree}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{student.specialization}</div>
                        <div className="text-slate-500 text-[10px] mt-0.5 truncate max-w-[180px]">
                          {student.college}
                        </div>
                      </td>

                      {/* Batch & CGPA */}
                      <td className="px-5 py-4">
                        <div className="text-slate-300 font-medium">Class of {student.graduationYear}</div>
                        <div className="mt-1">
                          {student.cgpa ? (
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                                student.cgpa >= 8.5
                                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                  : student.cgpa >= 7.0
                                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                  : "bg-slate-800 text-slate-300 border border-slate-700"
                              }`}
                            >
                              {student.cgpa.toFixed(1)} / 10.0 CGPA
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[11px]">Unrecorded</span>
                          )}
                        </div>
                      </td>

                      {/* Skills */}
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap gap-1 max-w-[220px]">
                          {student.skills && student.skills.length > 0 ? (
                            <>
                              {student.skills.slice(0, 3).map((skill) => (
                                <span
                                  key={skill}
                                  className="px-1.5 py-0.5 rounded text-[10px] bg-slate-950 border border-slate-800 text-slate-300"
                                >
                                  {skill}
                                </span>
                              ))}
                              {student.skills.length > 3 && (
                                <span className="px-1 py-0.5 rounded text-[9px] text-slate-500">
                                  +{student.skills.length - 3}
                                </span>
                              )}
                            </>
                          ) : (
                            <span className="text-slate-500 text-[11px]">No skills listed</span>
                          )}
                        </div>
                      </td>

                      {/* Placement Status */}
                      <td className="px-5 py-4">
                        {student.hiredCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Placed ({student.hiredCount} Offer)</span>
                          </span>
                        ) : student.interviewsCount > 0 ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                            <Clock className="w-3 h-3" />
                            <span>Interviewing</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium bg-slate-800 text-slate-400">
                            <span>{student.totalApplications} Applications</span>
                          </span>
                        )}
                      </td>

                      {/* Credentials / Links */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {student.resumeUrl ? (
                            <a
                              href={student.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-400 font-medium text-[11px] transition"
                              title="View Resume Document"
                            >
                              <FileText className="w-3 h-3" />
                              <span>Resume</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-slate-600">No Resume</span>
                          )}

                          {student.linkedinUrl && (
                            <a
                              href={student.linkedinUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-slate-500 hover:text-indigo-400 transition"
                              title="LinkedIn Profile"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 0-2.9 1.45 1.45 0 0 0 0 2.9m1.37 9.74v-8.37H5.1v8.37h2.73z" />
                              </svg>
                            </a>
                          )}

                          {student.githubUrl && (
                            <a
                              href={student.githubUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded text-slate-500 hover:text-white transition"
                              title="GitHub Portfolio"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                              </svg>
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
