/**
 * iCalendar (RFC 5545) & Google Calendar Utility for OpportunityHub
 */

export interface CalendarEventPayload {
  title: string;
  description: string;
  location?: string;
  startDate: Date | string;
  durationMinutes?: number;
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

function formatIcsDate(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(
    d.getUTCHours()
  )}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

export function generateIcsContent(event: CalendarEventPayload): string {
  const start = new Date(event.startDate);
  const end = new Date(start.getTime() + (event.durationMinutes || 45) * 60 * 1000);
  const now = new Date();
  const uid = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}@opportunityhub.com`;

  // Escape text for iCalendar format
  const escapeIcs = (str: string = "") =>
    str.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//OpportunityHub//Recruitment Platform//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:REQUEST",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${formatIcsDate(now)}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${escapeIcs(event.title)}`,
    `DESCRIPTION:${escapeIcs(event.description)}`,
    `LOCATION:${escapeIcs(event.location || "Online")}`,
    "STATUS:CONFIRMED",
    "SEQUENCE:0",
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder: Upcoming Interview",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function downloadIcsCalendar(event: CalendarEventPayload, fileName = "interview-invite.ics") {
  if (typeof window === "undefined") return;
  const content = generateIcsContent(event);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

export function getGoogleCalendarUrl(event: CalendarEventPayload): string {
  const start = new Date(event.startDate);
  const end = new Date(start.getTime() + (event.durationMinutes || 45) * 60 * 1000);

  const startStr = formatIcsDate(start);
  const endStr = formatIcsDate(end);

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${startStr}/${endStr}`,
    details: event.description,
    location: event.location || "",
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

