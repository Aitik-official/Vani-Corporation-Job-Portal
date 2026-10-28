"use client";

import { useEffect, useState } from "react";
import { 
  Building2, 
  MapPin, 
  Globe, 
  Phone, 
  User, 
  Save, 
  Loader2, 
  FileText, 
  Upload, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

export default function CompanyProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  const [formData, setFormData] = useState({
    companyName: "",
    officialEmail: "",
    contactPerson: "",
    contactNumber: "",
    website: "",
    location: "",
    description: "",
    logoUrl: "",
    verificationStatus: "pending",
    verificationDocuments: [] as string[],
    rejectionReason: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/companies/profile");
      const data = await res.json();
      if (res.ok && data.company) {
        const c = data.company;
        setFormData({
          companyName: c.companyName || "",
          officialEmail: c.officialEmail || "",
          contactPerson: c.contactPerson || "",
          contactNumber: c.contactNumber || "",
          website: c.website || "",
          location: c.location || "",
          description: c.description || "",
          logoUrl: c.logoUrl || "",
          verificationStatus: c.verificationStatus || "pending",
          verificationDocuments: c.verificationDocuments || [],
          rejectionReason: c.rejectionReason || "",
        });
      }
    } catch {
      toast.error("Failed to load company profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDocumentUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingDoc(true);
    const body = new FormData();
    body.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setFormData((prev) => ({
        ...prev,
        verificationDocuments: [...prev.verificationDocuments, data.url],
      }));
      toast.success("Document attached! Save profile to finalize.");
    } catch (err: any) {
      toast.error(err.message || "Failed to upload document");
    } finally {
      setUploadingDoc(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/companies/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      toast.success("Company profile saved successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Company Profile & Verification</h1>
          <p className="text-sm text-slate-400 mt-1">
            Maintain your official employer identity and verification documentation.
          </p>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Company Profile</span>
            </>
          )}
        </button>
      </div>

      {/* Verification Status Card */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Verification Review Status
        </h2>

        <div className="flex flex-wrap items-center gap-3">
          {formData.verificationStatus === "verified" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-sm font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Verified Employer - Authorized to publish active jobs</span>
            </div>
          )}
          {formData.verificationStatus === "pending" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-sm font-medium">
              <Clock className="w-4 h-4" />
              <span>Pending Review - Awaiting Administrator Verification</span>
            </div>
          )}
          {formData.verificationStatus === "rejected" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 text-sm font-medium">
              <AlertTriangle className="w-4 h-4" />
              <span>Verification Rejected - Please update information and documents</span>
            </div>
          )}
        </div>

        {formData.rejectionReason && (
          <div className="mt-3 p-3 rounded-lg bg-rose-950/30 border border-rose-800/40 text-xs text-rose-300">
            <strong>Rejection Reason from Admin:</strong> {formData.rejectionReason}
          </div>
        )}
      </div>

      {/* General Company Information */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
          <Building2 className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-white">General Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              required
              value={formData.companyName}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Official Email (Account ID)
            </label>
            <input
              type="email"
              disabled
              value={formData.officialEmail}
              className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 text-sm cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contact Person *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="contactPerson"
                required
                value={formData.contactPerson}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Contact Number *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="tel"
                name="contactNumber"
                required
                value={formData.contactNumber}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Headquarters Location *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                name="location"
                required
                value={formData.location}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Website URL
            </label>
            <div className="relative">
              <Globe className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                name="website"
                value={formData.website}
                onChange={handleChange}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            About Company (Company Description)
          </label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Introduce your company culture, products, and mission..."
            className="w-full px-3.5 py-2.5 rounded-lg bg-slate-950 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-violet-500 transition"
          />
        </div>
      </div>

      {/* Verification Documents Upload */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-800/80">
          <FileText className="w-5 h-5 text-violet-400" />
          <h2 className="text-base font-semibold text-white">Verification Documents (Certificate of Incorporation, Tax ID, etc.)</h2>
        </div>

        <p className="text-xs text-slate-400">
          Upload official business registration certificates or letters to expedite administrative account approval.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <label className="cursor-pointer px-4 py-2.5 rounded-lg bg-violet-600/20 text-violet-300 border border-violet-500/30 hover:bg-violet-600/30 text-xs font-medium flex items-center gap-2 transition">
            {uploadingDoc ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Uploading Document...</span>
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                <span>Attach Verification Document</span>
              </>
            )}
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
              onChange={handleDocumentUpload}
              disabled={uploadingDoc}
            />
          </label>
        </div>

        {formData.verificationDocuments.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-xs font-medium text-slate-300 block">Submitted Files:</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {formData.verificationDocuments.map((docUrl, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-300 truncate">
                    <FileText className="w-4 h-4 text-violet-400 shrink-0" />
                    <span className="truncate">Document #{idx + 1}</span>
                  </div>
                  <a
                    href={docUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-violet-400 hover:underline flex items-center gap-1 shrink-0 ml-2"
                  >
                    <span>View</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </form>
  );
}
