"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  FileText, 
  Loader2, 
  ExternalLink,
  X,
  ShieldCheck,
  Search
} from "lucide-react";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

interface CompanyItem {
  _id: string;
  companyName: string;
  officialEmail: string;
  contactPerson: string;
  contactNumber: string;
  website?: string;
  location: string;
  description?: string;
  verificationStatus: "pending" | "verified" | "rejected";
  verificationDocuments: string[];
  rejectionReason?: string;
  createdAt: string;
  verifiedAt?: string;
}

export default function AdminCompaniesPage() {
  const searchParams = useSearchParams();
  const [companies, setCompanies] = useState<CompanyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<CompanyItem | null>(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [statusFilter]);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const url = statusFilter
        ? `/api/admin/companies?status=${statusFilter}`
        : "/api/admin/companies";
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setCompanies(data.companies || []);

        const reviewId = searchParams.get("reviewId");
        if (reviewId) {
          const match = data.companies?.find((c: any) => c._id === reviewId);
          if (match) setSelectedCompany(match);
        }
      }
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId: string) => {
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId,
          status: "verified",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Approval failed");

      toast.success("Company verified successfully! They can now publish jobs.");
      setCompanies((prev) =>
        prev.map((c) => (c._id === companyId ? { ...c, verificationStatus: "verified" } : c))
      );
      if (selectedCompany?._id === companyId) {
        setSelectedCompany((prev) => (prev ? { ...prev, verificationStatus: "verified" } : null));
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to approve company");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany) return;
    if (!rejectionReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/companies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyId: selectedCompany._id,
          status: "rejected",
          rejectionReason,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Rejection failed");

      toast.success("Company verification rejected");
      setCompanies((prev) =>
        prev.map((c) =>
          c._id === selectedCompany._id
            ? { ...c, verificationStatus: "rejected", rejectionReason }
            : c
        )
      );
      setSelectedCompany((prev) =>
        prev ? { ...prev, verificationStatus: "rejected", rejectionReason } : null
      );
      setShowRejectModal(false);
      setRejectionReason("");
    } catch (err: any) {
      toast.error(err.message || "Failed to reject company");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.companyName.toLowerCase().includes(q) ||
      c.officialEmail.toLowerCase().includes(q) ||
      c.contactPerson.toLowerCase().includes(q) ||
      c.location.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Company Verification Management
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Review business profiles, verify legitimacy, inspect corporate filings, and grant publishing rights.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or city..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => setStatusFilter("")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === ""
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All ({companies.length})
          </button>
          <button
            onClick={() => setStatusFilter("pending")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === "pending"
                ? "bg-amber-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setStatusFilter("verified")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === "verified"
                ? "bg-emerald-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Verified
          </button>
          <button
            onClick={() => setStatusFilter("rejected")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === "rejected"
                ? "bg-rose-600 text-white"
                : "bg-slate-950 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            Rejected
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: List */}
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
            </div>
          ) : filteredCompanies.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
              <Building2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-sm font-semibold text-white">No companies found</h3>
              <p className="text-xs text-slate-500 mt-1">Try resetting your filter or search query.</p>
            </div>
          ) : (
            filteredCompanies.map((c) => {
              const isSelected = selectedCompany?._id === c._id;
              return (
                <div
                  key={c._id}
                  onClick={() => setSelectedCompany(c)}
                  className={`p-5 rounded-2xl border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isSelected
                      ? "bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10"
                      : "bg-slate-900/70 border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-emerald-400 shrink-0">
                      {c.companyName[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-white text-sm">{c.companyName}</h3>
                        {c.verificationStatus === "verified" && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                            Verified
                          </span>
                        )}
                        {c.verificationStatus === "pending" && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                            Pending
                          </span>
                        )}
                        {c.verificationStatus === "rejected" && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium">
                            Rejected
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex flex-wrap items-center gap-3 mt-1">
                        <span>{c.officialEmail}</span>
                        <span>•</span>
                        <span>{c.location}</span>
                        <span>•</span>
                        <span>{c.verificationDocuments?.length || 0} Docs</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 shrink-0">
                    Registered {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right column: Detailed Review Drawer */}
        <div className="lg:col-span-1">
          {selectedCompany ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sticky top-24 space-y-5 shadow-2xl">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">
                    Company Dossier
                  </span>
                  <h2 className="text-xl font-bold text-white mt-1">
                    {selectedCompany.companyName}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="p-1 rounded text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Status details */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Status:</span>
                  <span className="font-semibold capitalize text-white">
                    {selectedCompany.verificationStatus}
                  </span>
                </div>
                {selectedCompany.rejectionReason && (
                  <div className="pt-2 text-rose-300 border-t border-slate-850 mt-1">
                    <strong>Rejection Note:</strong> {selectedCompany.rejectionReason}
                  </div>
                )}
              </div>

              {/* Contact info */}
              <div className="space-y-2.5 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedCompany.officialEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>
                    {selectedCompany.contactNumber} ({selectedCompany.contactPerson})
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{selectedCompany.location}</span>
                </div>
                {selectedCompany.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-3.5 h-3.5 text-slate-500" />
                    <a
                      href={selectedCompany.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>{selectedCompany.website}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {selectedCompany.description && (
                <div className="pt-3 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium block mb-1">Company Description:</span>
                  <p className="text-slate-300 leading-relaxed">{selectedCompany.description}</p>
                </div>
              )}

              {/* Attached documents */}
              <div className="pt-3 border-t border-slate-800 text-xs space-y-2">
                <span className="text-slate-400 font-medium block">
                  Uploaded Verification Documents ({selectedCompany.verificationDocuments?.length || 0}):
                </span>

                {selectedCompany.verificationDocuments?.length === 0 ? (
                  <p className="text-slate-500 text-[11px] italic">No document files attached.</p>
                ) : (
                  selectedCompany.verificationDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span className="truncate text-slate-300">Document #{idx + 1}</span>
                      </div>
                      <a
                        href={doc}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
                      >
                        <span>Open</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  ))
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  onClick={() => handleApprove(selectedCompany._id)}
                  disabled={actionLoading || selectedCompany.verificationStatus === "verified"}
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Approve & Verify</span>
                </button>

                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={actionLoading || selectedCompany.verificationStatus === "rejected"}
                  className="py-2.5 px-4 rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-40"
                >
                  <AlertTriangle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-10 text-center text-slate-500 text-xs">
              <FileText className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <span>Select any company on the left to review documentation and execute verification decisions.</span>
            </div>
          )}
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative">
            <h3 className="text-base font-bold text-white mb-2">
              Reject Verification for {selectedCompany?.companyName}
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Enter the reason for rejection. This feedback will be displayed to the employer so they can rectify and resubmit.
            </p>

            <textarea
              rows={4}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Uploaded certificate of incorporation was illegible. Please provide a clear PDF or state tax document."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-rose-500 transition mb-4"
            />

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReject}
                disabled={actionLoading}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-medium transition disabled:opacity-50"
              >
                {actionLoading ? "Submitting..." : "Confirm Rejection"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
