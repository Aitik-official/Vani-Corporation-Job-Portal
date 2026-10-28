"use client";

import { Calendar, Download, ExternalLink, Video } from "lucide-react";
import { downloadIcsCalendar, getGoogleCalendarUrl } from "@/lib/calendar";

interface Props {
  roundTitle: string;
  companyName: string;
  jobTitle: string;
  scheduledAt: string;
  mode: string;
  meetingLink?: string;
  notes?: string;
}

export default function InterviewCalendarButtons({
  roundTitle,
  companyName,
  jobTitle,
  scheduledAt,
  mode,
  meetingLink,
  notes,
}: Props) {
  const eventPayload = {
    title: `${roundTitle}: ${companyName} - ${jobTitle}`,
    description: `Interview for ${jobTitle} at ${companyName}. Mode: ${mode}. Link/Venue: ${meetingLink || "N/A"}. Notes: ${notes || "None"}`,
    location: meetingLink || mode,
    startDate: scheduledAt,
    durationMinutes: 45,
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {meetingLink && (
        <a
          href={meetingLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Join Meeting</span>
          <ExternalLink className="w-3 h-3 ml-0.5" />
        </a>
      )}

      <button
        onClick={() => downloadIcsCalendar(eventPayload, `interview-${companyName.toLowerCase().replace(/\s+/g, "_")}.ics`)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
      >
        <Download className="w-3.5 h-3.5 text-indigo-400" />
        <span>Add to Calendar (.ics)</span>
      </button>

      <a
        href={getGoogleCalendarUrl(eventPayload)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition"
      >
        <Calendar className="w-3.5 h-3.5 text-indigo-400" />
        <span>Google Calendar</span>
        <ExternalLink className="w-3 h-3 text-slate-400" />
      </a>
    </div>
  );
}

