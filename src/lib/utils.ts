import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(date));
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-500 bg-yellow-500/10",
    analyzing: "text-blue-500 bg-blue-500/10",
    generating_document: "text-purple-500 bg-purple-500/10",
    generating_wireframes: "text-indigo-500 bg-indigo-500/10",
    generating_code: "text-cyan-500 bg-cyan-500/10",
    generating_roadmap: "text-teal-500 bg-teal-500/10",
    completed: "text-green-500 bg-green-500/10",
    failed: "text-red-500 bg-red-500/10",
  };
  return colors[status] || "text-gray-500 bg-gray-500/10";
}

export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    analyzing: "Analyzing",
    generating_document: "Creating Document",
    generating_wireframes: "Creating Wireframes",
    generating_code: "Generating Code",
    generating_roadmap: "Building Roadmap",
    completed: "Completed",
    failed: "Failed",
  };
  return labels[status] || status;
}

export function getPhaseProgress(status: string): number {
  const progress: Record<string, number> = {
    pending: 0,
    analyzing: 15,
    generating_document: 30,
    generating_wireframes: 50,
    generating_code: 70,
    generating_roadmap: 90,
    completed: 100,
    failed: 0,
  };
  return progress[status] || 0;
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    "must-have": "text-red-400 bg-red-400/10 border-red-400/20",
    "should-have": "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
    "nice-to-have": "text-green-400 bg-green-400/10 border-green-400/20",
  };
  return colors[priority] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function getImpactColor(impact: string): string {
  const colors: Record<string, string> = {
    high: "text-green-400",
    medium: "text-yellow-400",
    low: "text-gray-400",
  };
  return colors[impact] || "text-gray-400";
}

export function getSeverityColor(severity: string): string {
  const colors: Record<string, string> = {
    critical: "text-red-400 bg-red-400/10",
    major: "text-orange-400 bg-orange-400/10",
    minor: "text-yellow-400 bg-yellow-400/10",
  };
  return colors[severity] || "text-gray-400 bg-gray-400/10";
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9);
}

export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
