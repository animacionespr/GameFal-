"use client";

import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import {
  Code2,
  Database,
  Globe,
  Lock,
  Zap,
  ChevronDown,
  ChevronRight,
  X,
  FileCode,
  Server,
  Cpu,
  Box,
  BookOpen,
  Rocket,
  FolderOpen,
  Table,
  ArrowRight,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { GeneratedCode, ProjectFile, DatabaseTable, APIEndpoint } from "@/types";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Props ────────────────────────────────────────────────────────────────────

interface CodeViewProps {
  code: GeneratedCode;
}

// ─── Method Badge ─────────────────────────────────────────────────────────────

const methodColors: Record<string, string> = {
  GET: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  POST: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  PUT: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  PATCH: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  DELETE: "bg-red-500/10 text-red-400 border-red-500/20",
};

function MethodBadge({ method }: { method: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold",
        methodColors[method] ?? "bg-white/10 text-white/60 border-white/10",
      )}
    >
      {method}
    </span>
  );
}

// ─── Tech Stack Section ───────────────────────────────────────────────────────

function TechStackSection({ arch }: { arch: GeneratedCode["architecture"] }) {
  const stackGroups = [
    { label: "Frontend", items: arch.techStack.frontend, icon: <Globe className="h-3.5 w-3.5" />, color: "text-blue-400" },
    { label: "Backend", items: arch.techStack.backend, icon: <Server className="h-3.5 w-3.5" />, color: "text-violet-400" },
    { label: "Database", items: arch.techStack.database, icon: <Database className="h-3.5 w-3.5" />, color: "text-emerald-400" },
    { label: "Infrastructure", items: arch.techStack.infrastructure, icon: <Box className="h-3.5 w-3.5" />, color: "text-amber-400" },
    { label: "AI / ML", items: arch.techStack.ai, icon: <Cpu className="h-3.5 w-3.5" />, color: "text-pink-400" },
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stackGroups.map(({ label, items, icon, color }) =>
          items?.length > 0 ? (
            <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
              <div className={cn("mb-2 flex items-center gap-1.5 text-xs font-semibold", color)}>
                {icon}
                {label}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-white/60"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ) : null,
        )}
      </div>

      {/* Strategies */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[
          { label: "Auth Strategy", value: arch.authStrategy },
          { label: "Scaling Strategy", value: arch.scalingStrategy },
        ].filter(({ value }) => value).map(({ label, value }) => (
          <div key={label} className="rounded-lg border border-white/10 bg-white/5 p-3 sm:col-span-1">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              {label}
            </p>
            <p className="text-xs text-white/60 leading-relaxed">{value}</p>
          </div>
        ))}
        {arch.securityMeasures?.length > 0 && (
          <div className="rounded-lg border border-white/10 bg-white/5 p-3 sm:col-span-1">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-white/30">
              Security
            </p>
            <ul className="space-y-1">
              {arch.securityMeasures.slice(0, 4).map((measure, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-white/60">
                  <Lock className="mt-0.5 h-3 w-3 flex-shrink-0 text-emerald-400/60" />
                  {measure}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Folder structure */}
      {arch.folderStructure && (
        <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
            <FolderOpen className="h-3.5 w-3.5 text-white/40" />
            <span className="text-xs font-medium text-white/40">Folder Structure</span>
          </div>
          <ScrollArea className="h-64">
            <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-white/70">
              {arch.folderStructure}
            </pre>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}

// ─── Database Table Accordion ─────────────────────────────────────────────────

function TableAccordion({ table }: { table: DatabaseTable }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 bg-white/5 px-4 py-3 text-left transition-colors hover:bg-white/8"
      >
        <Table className="h-4 w-4 flex-shrink-0 text-emerald-400" />
        <div className="flex-1 min-w-0">
          <span className="font-mono text-sm font-semibold text-white">{table.name}</span>
          {table.description && (
            <span className="ml-2 text-xs text-white/40">{table.description}</span>
          )}
        </div>
        <span className="text-xs text-white/30">{table.columns?.length} cols</span>
        {open ? (
          <ChevronDown className="h-4 w-4 text-white/30" />
        ) : (
          <ChevronRight className="h-4 w-4 text-white/30" />
        )}
      </button>

      {open && (
        <div className="border-t border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/3">
                  <th className="px-4 py-2 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                    Column
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                    Type
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                    Constraints
                  </th>
                  <th className="px-4 py-2 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                    Description
                  </th>
                </tr>
              </thead>
              <tbody>
                {table.columns?.map((col, i) => (
                  <tr
                    key={col.name}
                    className={cn(
                      "border-b border-white/5",
                      i % 2 === 0 ? "bg-transparent" : "bg-white/2",
                    )}
                  >
                    <td className="px-4 py-2 font-mono font-medium text-white/80">{col.name}</td>
                    <td className="px-4 py-2 font-mono text-violet-400/80">{col.type}</td>
                    <td className="px-4 py-2 text-white/40">{col.constraints}</td>
                    <td className="px-4 py-2 text-white/50">{col.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Indexes / RLS */}
          {(table.indexes?.length > 0 || table.rls?.length > 0) && (
            <div className="flex flex-wrap gap-4 border-t border-white/10 px-4 py-3">
              {table.indexes?.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">
                    Indexes
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {table.indexes.map((idx, i) => (
                      <span
                        key={i}
                        className="rounded border border-blue-500/20 bg-blue-500/10 px-1.5 py-0.5 font-mono text-[10px] text-blue-400"
                      >
                        {idx}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              {table.rls?.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-white/30">
                    RLS Policies
                  </p>
                  <div className="flex flex-col gap-0.5">
                    {table.rls.map((policy, i) => (
                      <span key={i} className="text-[10px] text-white/40">
                        {policy}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── API Endpoints Table ──────────────────────────────────────────────────────

function APIEndpointsTable({ endpoints }: { endpoints: APIEndpoint[] }) {
  return (
    <div className="rounded-xl border border-white/10 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-3 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                Method
              </th>
              <th className="px-4 py-3 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                Path
              </th>
              <th className="px-4 py-3 text-left font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                Description
              </th>
              <th className="px-4 py-3 text-center font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                Auth
              </th>
              <th className="px-4 py-3 text-center font-semibold text-white/30 uppercase tracking-wide text-[10px]">
                Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {endpoints.map((ep, i) => (
              <tr
                key={i}
                className={cn(
                  "border-b border-white/5 transition-colors hover:bg-white/3",
                  i % 2 === 0 ? "bg-transparent" : "bg-white/2",
                )}
              >
                <td className="px-4 py-3">
                  <MethodBadge method={ep.method} />
                </td>
                <td className="px-4 py-3 font-mono text-white/70">{ep.path}</td>
                <td className="px-4 py-3 text-white/50">{ep.description}</td>
                <td className="px-4 py-3 text-center">
                  {ep.auth ? (
                    <Lock className="mx-auto h-3.5 w-3.5 text-emerald-400" aria-label="Auth required" />
                  ) : (
                    <span className="text-white/20">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {ep.rateLimited ? (
                    <Zap className="mx-auto h-3.5 w-3.5 text-amber-400" aria-label="Rate limited" />
                  ) : (
                    <span className="text-white/20">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── File List + Modal ────────────────────────────────────────────────────────

function FileRow({ file, onClick }: { file: ProjectFile; onClick: () => void }) {
  const extColor: Record<string, string> = {
    typescript: "text-blue-400",
    javascript: "text-yellow-400",
    tsx: "text-cyan-400",
    jsx: "text-cyan-400",
    css: "text-pink-400",
    sql: "text-emerald-400",
    json: "text-amber-400",
    markdown: "text-white/50",
    yaml: "text-violet-400",
    sh: "text-green-400",
  };
  const color = extColor[file.language] ?? "text-white/40";

  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-left transition-all hover:border-white/20 hover:bg-white/8"
    >
      <FileCode className={cn("h-4 w-4 flex-shrink-0", color)} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-mono text-sm font-medium text-white/80">{file.path}</p>
        <p className="truncate text-xs text-white/40">{file.description}</p>
      </div>
      <span
        className={cn(
          "flex-shrink-0 rounded border px-1.5 py-0.5 font-mono text-[10px] font-medium",
          "border-white/10 bg-white/5",
          color,
        )}
      >
        {file.language}
      </span>
      <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 text-white/20" />
    </button>
  );
}

function FileModal({ file, onClose }: { file: ProjectFile; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative z-10 flex w-full max-w-4xl flex-col rounded-2xl border border-white/10 bg-[#0d0d14] shadow-2xl max-h-[85vh]">
        {/* Header */}
        <div className="flex flex-shrink-0 items-center gap-3 border-b border-white/10 px-5 py-4">
          <FileCode className="h-4 w-4 text-indigo-400" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-semibold text-white">{file.path}</p>
            <p className="truncate text-xs text-white/40">{file.description}</p>
          </div>
          <span className="flex-shrink-0 rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/50">
            {file.language}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/40 transition-colors hover:bg-white/10 hover:text-white"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Code */}
        <div className="min-h-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <SyntaxHighlighter
              language={file.language === "typescript" || file.language === "tsx" ? "typescript" : file.language}
              style={atomOneDark}
              customStyle={{
                margin: 0,
                padding: "1.25rem",
                background: "transparent",
                fontSize: "0.75rem",
                lineHeight: "1.6",
              }}
              showLineNumbers
              lineNumberStyle={{ color: "rgba(255,255,255,0.15)", fontSize: "0.65rem" }}
            >
              {file.content}
            </SyntaxHighlighter>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}

// ─── Markdown Panel ───────────────────────────────────────────────────────────

function MarkdownPanel({ content }: { content: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-5">
      <pre className="whitespace-pre-wrap font-sans text-sm text-white/60 leading-relaxed">
        {content}
      </pre>
    </div>
  );
}

// ─── Section Heading ──────────────────────────────────────────────────────────

function SectionHeading({
  icon,
  title,
  count,
}: {
  icon: React.ReactNode;
  title: string;
  count?: number;
}) {
  return (
    <div className="mb-4 flex items-center gap-2">
      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
        {icon}
      </span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      {count !== undefined && (
        <span className="ml-1 rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/40">
          {count}
        </span>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CodeView({ code }: CodeViewProps) {
  const [openFile, setOpenFile] = useState<ProjectFile | null>(null);
  const [fileSearch, setFileSearch] = useState("");

  const arch = code.architecture;
  const filteredFiles = code.files?.filter(
    (f) =>
      f.path.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.language.toLowerCase().includes(fileSearch.toLowerCase()) ||
      f.description.toLowerCase().includes(fileSearch.toLowerCase()),
  ) ?? [];

  return (
    <div className="space-y-8">
      {/* ── Architecture Overview ── */}
      <section>
        <SectionHeading
          icon={<Cpu className="h-4 w-4" />}
          title={arch.name || "Architecture Overview"}
        />
        {arch.description && (
          <p className="mb-4 text-sm text-white/60 leading-relaxed">{arch.description}</p>
        )}
        <TechStackSection arch={arch} />
      </section>

      {/* ── Database Schema ── */}
      {arch.databaseSchema?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Database className="h-4 w-4" />}
            title="Database Schema"
            count={arch.databaseSchema.length}
          />
          <div className="space-y-2">
            {arch.databaseSchema.map((table) => (
              <TableAccordion key={table.name} table={table} />
            ))}
          </div>
        </section>
      )}

      {/* ── API Endpoints ── */}
      {arch.apiEndpoints?.length > 0 && (
        <section>
          <SectionHeading
            icon={<Globe className="h-4 w-4" />}
            title="API Endpoints"
            count={arch.apiEndpoints.length}
          />
          <APIEndpointsTable endpoints={arch.apiEndpoints} />
        </section>
      )}

      {/* ── Files ── */}
      {code.files?.length > 0 && (
        <section>
          <SectionHeading
            icon={<FileCode className="h-4 w-4" />}
            title="Generated Files"
            count={code.files.length}
          />
          <div className="mb-3">
            <input
              type="text"
              placeholder="Filter files by path, language, or description…"
              value={fileSearch}
              onChange={(e) => setFileSearch(e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-indigo-500/50 focus:bg-white/8"
            />
          </div>
          <div className="space-y-2">
            {filteredFiles.map((file) => (
              <FileRow key={file.path} file={file} onClick={() => setOpenFile(file)} />
            ))}
            {filteredFiles.length === 0 && (
              <p className="py-6 text-center text-sm text-white/30">No files match your filter.</p>
            )}
          </div>
        </section>
      )}

      {/* ── Setup Instructions ── */}
      {code.setupInstructions && (
        <section>
          <SectionHeading icon={<BookOpen className="h-4 w-4" />} title="Setup Instructions" />
          <MarkdownPanel content={code.setupInstructions} />
        </section>
      )}

      {/* ── Deployment Guide ── */}
      {code.deploymentGuide && (
        <section>
          <SectionHeading icon={<Rocket className="h-4 w-4" />} title="Deployment Guide" />
          <MarkdownPanel content={code.deploymentGuide} />
        </section>
      )}

      {/* ── Env Variables ── */}
      {code.envVariables && (
        <section>
          <SectionHeading icon={<Code2 className="h-4 w-4" />} title="Environment Variables" />
          <div className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-2">
              <span className="font-mono text-xs text-white/30">.env.example</span>
            </div>
            <ScrollArea className="h-48">
              <pre className="overflow-x-auto p-5 font-mono text-xs leading-relaxed text-green-400/70">
                {code.envVariables}
              </pre>
            </ScrollArea>
          </div>
        </section>
      )}

      {/* File modal */}
      {openFile && <FileModal file={openFile} onClose={() => setOpenFile(null)} />}
    </div>
  );
}
