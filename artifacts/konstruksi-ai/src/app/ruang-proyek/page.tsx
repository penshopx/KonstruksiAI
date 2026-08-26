"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "@/shims/next-link";
import NavbarAuth from "@/components/NavbarAuth";
import {
  Archive,
  ArrowRight,
  AlertCircle,
  BookOpen,
  CheckCircle2,
  ClipboardCheck,
  FileSearch,
  Flag,
  FolderKanban,
  HardHat,
  LayoutDashboard,
  LineChart,
  Loader2,
  MessagesSquare,
  Plus,
  Save,
  ShieldCheck,
  Target,
  UserPlus,
  UserRound,
  X,
  Wrench,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  acceptWorkspaceInvitation,
  createProjectWorkspace,
  createWorkspaceInvitation,
  getWorkspaceInvitation,
  listWorkspaceMembers,
  listProjectWorkspaces,
  ProjectWorkspaceApiError,
  revokeWorkspaceInvitation,
  revokeWorkspaceMember,
  updateProjectWorkspace,
  type ProjectWorkspace,
  type ProjectWorkspaceInvitation,
  type ProjectWorkspaceMember,
} from "@/lib/project-workspaces";
import { withWorkspaceContext } from "@/lib/workspace-context";
import { getSession } from "@/lib/auth";

type Stage = {
  id: string;
  number: string;
  label: string;
  title: string;
  description: string;
  input: string;
  output: string;
  icon: LucideIcon;
  accent: string;
  softAccent: string;
  actions: Array<{
    label: string;
    description: string;
    href: string;
    icon: LucideIcon;
  }>;
};

const STAGES: Stage[] = [
  {
    id: "tender",
    number: "01",
    label: "Mulai",
    title: "Kesiapan & Tender",
    description:
      "Rapikan peluang, persyaratan, dokumen, dan risiko sebelum pekerjaan dikejar lebih jauh.",
    input: "Peluang tender, persyaratan, dokumen legal, dan kompetensi badan usaha",
    output: "Keputusan awal: siap ditindaklanjuti, perlu dilengkapi, atau perlu dikaji ulang",
    icon: ClipboardCheck,
    accent: "text-cyan-300",
    softAccent: "border-cyan-400/30 bg-cyan-400/10",
    actions: [
      {
        label: "Cek kelayakan tender",
        description: "Petakan kecocokan dan dokumen yang perlu disiapkan.",
        href: "/tender-eligibility",
        icon: ShieldCheck,
      },
      {
        label: "Bedah dokumen tender",
        description: "Lihat kelengkapan, persyaratan, dan risiko penawaran.",
        href: "/tender-intelligence",
        icon: FileSearch,
      },
    ],
  },
  {
    id: "planning",
    number: "02",
    label: "Rencanakan",
    title: "Perencanaan & RAB",
    description:
      "Ubah kebutuhan pekerjaan menjadi rencana, asumsi biaya, dan keputusan yang dapat ditinjau bersama.",
    input: "Lingkup pekerjaan, spesifikasi, volume, lokasi, dan asumsi biaya",
    output: "Rencana kerja serta estimasi yang dapat diperiksa dan disempurnakan",
    icon: Target,
    accent: "text-blue-300",
    softAccent: "border-blue-400/30 bg-blue-400/10",
    actions: [
      {
        label: "Buka Simulasi",
        description: "Gunakan latihan dan simulasi untuk menguji pemahaman teknis.",
        href: "/simulasi",
        icon: LineChart,
      },
      {
        label: "Konsultasi dengan AI",
        description: "Bawa asumsi dan pertanyaan perencanaan ke agen yang sesuai.",
        href: "/chat",
        icon: MessagesSquare,
      },
      {
        label: "Belajar perencanaan",
        description: "Pilih materi teknis dan manajemen yang relevan sebelum menyusun keputusan.",
        href: "/learn",
        icon: BookOpen,
      },
    ],
  },
  {
    id: "execution",
    number: "03",
    label: "Jalankan",
    title: "Pelaksanaan",
    description:
      "Jaga keputusan, metode, dan pengetahuan teknis tetap mudah ditemukan saat pekerjaan berjalan.",
    input: "Rencana kerja, metode, SOP, pembagian peran, dan keputusan lapangan",
    output: "Arahan kerja yang lebih konsisten dan konteks yang bisa dipakai ulang tim",
    icon: HardHat,
    accent: "text-orange-300",
    softAccent: "border-orange-400/30 bg-orange-400/10",
    actions: [
      {
        label: "Buka Knowledge",
        description: "Temukan metode, SOP, dan referensi teknis untuk pekerjaan.",
        href: "/knowledge",
        icon: BookOpen,
      },
      {
        label: "Buka ruang Chat",
        description: "Diskusikan keputusan teknis dengan agen spesialis.",
        href: "/chat",
        icon: MessagesSquare,
      },
    ],
  },
  {
    id: "monitoring",
    number: "04",
    label: "Pantau",
    title: "Monitoring & Mutu",
    description:
      "Periksa perubahan informasi, bukti, dan hal yang perlu ditindaklanjuti sebelum menjadi masalah.",
    input: "Temuan, bukti pekerjaan, perubahan regulasi, dan update resmi",
    output: "Daftar perhatian dan referensi yang bisa diverifikasi sebelum bertindak",
    icon: LineChart,
    accent: "text-emerald-300",
    softAccent: "border-emerald-400/30 bg-emerald-400/10",
    actions: [
      {
        label: "Pantau Radar",
        description: "Baca update resmi industri dan buka sumber aslinya.",
        href: "/radar-konstruksi",
        icon: Flag,
      },
      {
        label: "Petakan bukti",
        description: "Hubungkan klaim, dokumen, dan sumber yang mendukungnya.",
        href: "/evidence-mapping",
        icon: FileSearch,
      },
    ],
  },
  {
    id: "handover",
    number: "05",
    label: "Tutup & ulangi",
    title: "Serah Terima & Knowledge Reuse",
    description:
      "Jadikan hasil pekerjaan, keputusan, dan pelajaran tim sebagai fondasi untuk pekerjaan berikutnya.",
    input: "Dokumen akhir, keputusan, temuan, dan pelajaran dari pekerjaan",
    output: "Ringkasan yang rapi dan pengetahuan yang lebih mudah dipakai ulang",
    icon: CheckCircle2,
    accent: "text-violet-300",
    softAccent: "border-violet-400/30 bg-violet-400/10",
    actions: [
      {
        label: "Rapikan pengetahuan",
        description: "Simpan rujukan dan template yang berguna untuk tim.",
        href: "/knowledge",
        icon: BookOpen,
      },
      {
        label: "Susun ringkasan",
        description: "Minta bantuan agen untuk menyusun struktur laporan atau checklist.",
        href: "/chat",
        icon: MessagesSquare,
      },
    ],
  },
];

function StageRail({
  activeIndex,
  onSelect,
  disabled = false,
}: {
  activeIndex: number;
  onSelect: (index: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="space-y-2" aria-label="Tahapan ruang proyek">
      {STAGES.map((stage, index) => {
        const Icon = stage.icon;
        const active = activeIndex === index;
        return (
          <button
            key={stage.id}
            type="button"
            onClick={() => {
              if (!disabled) onSelect(index);
            }}
            disabled={disabled}
            aria-current={active ? "step" : undefined}
            className={`group flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-60 ${
              active
                ? `${stage.softAccent} border-opacity-100`
                : "border-slate-800 bg-slate-950/30 hover:border-slate-700 hover:bg-slate-900/70"
            }`}
          >
            <span
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border text-xs font-bold ${
                active ? `${stage.softAccent} ${stage.accent}` : "border-slate-700 bg-slate-900 text-slate-500"
              }`}
            >
              {active ? <Icon className="h-4 w-4" strokeWidth={2} /> : stage.number}
            </span>
            <span className="min-w-0 flex-1">
              <span className={`block text-[10px] font-semibold uppercase tracking-[0.16em] ${active ? stage.accent : "text-slate-600"}`}>
                Tahap {stage.number}
              </span>
              <span className={`block truncate text-sm font-semibold ${active ? "text-white" : "text-slate-400 group-hover:text-slate-200"}`}>
                {stage.title}
              </span>
            </span>
            {active && <span className="h-1.5 w-1.5 rounded-full bg-current text-cyan-300 shadow-[0_0_10px_currentColor]" />}
          </button>
        );
      })}
    </div>
  );
}

export default function ProjectWorkspacePage() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [projectName, setProjectName] = useState("");
  const [notes, setNotes] = useState("");
  const [workspaces, setWorkspaces] = useState<ProjectWorkspace[]>([]);
  const [activeWorkspaceId, setActiveWorkspaceId] = useState<string | null>(null);
  const [isLoadingWorkspaces, setIsLoadingWorkspaces] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [resumeCandidate, setResumeCandidate] = useState<ProjectWorkspace | null>(null);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [members, setMembers] = useState<ProjectWorkspaceMember[]>([]);
  const [invitations, setInvitations] = useState<ProjectWorkspaceInvitation[]>([]);
  const [memberError, setMemberError] = useState("");
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"viewer" | "editor">("viewer");
  const [inviteLink, setInviteLink] = useState("");
  const [invitationToken, setInvitationToken] = useState("");
  const [invitationInfo, setInvitationInfo] = useState<{
    invitedEmail: string;
    role: "viewer" | "editor";
    expiresAt: string;
    workspaceName: string;
  } | null>(null);
  const [invitationError, setInvitationError] = useState("");
  const [isLoadingInvitation, setIsLoadingInvitation] = useState(false);
  const [isAcceptingInvitation, setIsAcceptingInvitation] = useState(false);
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(null);
  const activeStage = STAGES[activeIndex] ?? STAGES[0];
  const ActiveIcon = activeStage.icon;
  const displayName = useMemo(() => projectName.trim() || "Pekerjaan baru", [projectName]);
  const activeWorkspace = workspaces.find((workspace) => workspace.id === activeWorkspaceId) ?? null;
  const canEditWorkspace = !activeWorkspace || activeWorkspace.accessRole !== "viewer";
  const hasLocalDraftRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setInvitationToken(new URLSearchParams(window.location.search).get("invite")?.trim() ?? "");

    listProjectWorkspaces(true)
      .then((savedWorkspaces) => {
        if (!cancelled) {
          setWorkspaces(savedWorkspaces);
          const requestedWorkspaceId = new URLSearchParams(window.location.search).get("workspace");
          const requestedWorkspace = requestedWorkspaceId
            ? savedWorkspaces.find((workspace) => workspace.id === requestedWorkspaceId)
            : null;
          const latestActiveWorkspace = savedWorkspaces.find((workspace) => !workspace.archivedAt);
          const workspaceToResume = requestedWorkspace ?? latestActiveWorkspace;
          if (workspaceToResume && !hasLocalDraftRef.current) {
            const stageIndex = STAGES.findIndex((stage) => stage.id === workspaceToResume.stageId);
            setActiveWorkspaceId(workspaceToResume.id);
            setProjectName(workspaceToResume.name);
            setNotes(workspaceToResume.notes);
            setActiveIndex(stageIndex >= 0 ? stageIndex : 0);
            setIsDirty(false);
            setResumeCandidate(null);
          } else if (workspaceToResume) {
            setResumeCandidate(workspaceToResume);
          }
          setAuthRequired(false);
        }
      })
      .catch((requestError: unknown) => {
        if (cancelled) return;
        if (requestError instanceof ProjectWorkspaceApiError && requestError.status === 401) {
          setAuthRequired(true);
        } else {
          setError("Daftar ruang proyek belum dapat dimuat. Anda tetap dapat memakai sesi lokal.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingWorkspaces(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!invitationToken) return;
    let cancelled = false;
    setIsLoadingInvitation(true);
    setInvitationError("");
    Promise.all([getWorkspaceInvitation(invitationToken), getSession()])
      .then(([invitation, session]) => {
        if (cancelled) return;
        setInvitationInfo(invitation);
        setCurrentUserEmail(session?.email ?? null);
      })
      .catch((reason: unknown) => {
        if (!cancelled) {
          setInvitationError(reason instanceof Error ? reason.message : "Undangan tidak tersedia.");
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoadingInvitation(false);
      });
    return () => {
      cancelled = true;
    };
  }, [invitationToken]);

  useEffect(() => {
    if (!activeWorkspace?.id || !activeWorkspace.isOwner) {
      setMembers([]);
      setInvitations([]);
      setMemberError("");
      return;
    }
    let cancelled = false;
    setIsLoadingMembers(true);
    listWorkspaceMembers(activeWorkspace.id)
      .then(({ members: nextMembers, invitations: nextInvitations }) => {
        if (!cancelled) {
          setMembers(nextMembers);
          setInvitations(nextInvitations);
          setMemberError("");
        }
      })
      .catch((reason: unknown) => {
        if (!cancelled) setMemberError(reason instanceof Error ? reason.message : "Anggota belum dapat dimuat.");
      })
      .finally(() => {
        if (!cancelled) setIsLoadingMembers(false);
      });
    return () => {
      cancelled = true;
    };
  }, [activeWorkspace?.id, activeWorkspace?.isOwner]);

  const markDirty = () => {
    hasLocalDraftRef.current = true;
    setIsDirty(true);
    setSuccess("");
  };

  const selectStage = (index: number) => {
    if (!canEditWorkspace) return;
    setActiveIndex(index);
    markDirty();
  };

  const confirmDiscardChanges = (nextAction: string): boolean => {
    if (!isDirty) return true;
    return window.confirm(`Perubahan pada ruang proyek belum disimpan. Tetap ${nextAction}?`);
  };

  const loadWorkspace = (workspace: ProjectWorkspace) => {
    if (!confirmDiscardChanges(activeWorkspaceId === workspace.id ? "memuat ulang ruang ini" : "membuka ruang lain")) return;

    const stageIndex = STAGES.findIndex((stage) => stage.id === workspace.stageId);
    setActiveWorkspaceId(workspace.id);
    setProjectName(workspace.name);
    setNotes(workspace.notes);
    setActiveIndex(stageIndex >= 0 ? stageIndex : 0);
    setIsDirty(false);
    hasLocalDraftRef.current = false;
    setResumeCandidate(null);
    setError("");
    setSuccess("");
  };

  const startNewWorkspace = () => {
    if (!confirmDiscardChanges("membuat ruang baru")) return;

    resetWorkspace();
  };

  const resetWorkspace = () => {
    setActiveWorkspaceId(null);
    setProjectName("");
    setNotes("");
    setActiveIndex(0);
    setIsDirty(false);
    hasLocalDraftRef.current = false;
    setResumeCandidate(null);
    setError("");
    setSuccess("");
  };

  const saveWorkspace = async () => {
    if (!canEditWorkspace) return;
    const name = projectName.trim();
    if (!name) {
      setError("Isi nama pekerjaan sebelum menyimpan ruang proyek.");
      return;
    }

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = { name, stageId: activeStage.id, notes: notes.trim() };
      const savedWorkspace = activeWorkspaceId
        ? await updateProjectWorkspace(activeWorkspaceId, payload)
        : await createProjectWorkspace(payload);

      setWorkspaces((current) => {
        const withoutSaved = current.filter((workspace) => workspace.id !== savedWorkspace.id);
        return [savedWorkspace, ...withoutSaved];
      });
      setActiveWorkspaceId(savedWorkspace.id);
      setProjectName(savedWorkspace.name);
      setNotes(savedWorkspace.notes);
      setIsDirty(false);
      hasLocalDraftRef.current = false;
      setResumeCandidate(null);
      setAuthRequired(false);
      setSuccess(activeWorkspaceId ? "Perubahan ruang proyek tersimpan." : "Ruang proyek tersimpan.");
    } catch (requestError: unknown) {
      if (requestError instanceof ProjectWorkspaceApiError && requestError.status === 401) {
        setAuthRequired(true);
        setError("Masuk terlebih dahulu untuk menyimpan ruang proyek.");
      } else {
        setError(requestError instanceof Error ? requestError.message : "Ruang proyek gagal disimpan.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const archiveWorkspace = async (workspace: ProjectWorkspace) => {
    if (!workspace.isOwner) return;
    if (activeWorkspaceId === workspace.id && !confirmDiscardChanges("mengarsipkan ruang ini")) return;
    if (!window.confirm(`Arsipkan ruang proyek "${workspace.name}"?`)) return;

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const archivedWorkspace = await updateProjectWorkspace(workspace.id, { archived: true });
      setWorkspaces((current) => current.map((item) => item.id === archivedWorkspace.id ? archivedWorkspace : item));
      if (activeWorkspaceId === workspace.id) resetWorkspace();
      setSuccess("Ruang proyek diarsipkan.");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Ruang proyek gagal diarsipkan.");
    } finally {
      setIsSaving(false);
    }
  };

  const restoreWorkspace = async (workspace: ProjectWorkspace) => {
    if (!workspace.isOwner) return;
    if (!confirmDiscardChanges("memulihkan ruang dari arsip")) return;

    setIsSaving(true);
    setError("");
    setSuccess("");
    try {
      const restoredWorkspace = await updateProjectWorkspace(workspace.id, { archived: false });
      setWorkspaces((current) => current.map((item) => item.id === restoredWorkspace.id ? restoredWorkspace : item));
      loadWorkspace(restoredWorkspace);
      setSuccess("Ruang proyek dipulihkan dan siap dilanjutkan.");
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Ruang proyek gagal dipulihkan.");
    } finally {
      setIsSaving(false);
    }
  };

  const refreshMembers = async (workspaceId: string) => {
    try {
      const result = await listWorkspaceMembers(workspaceId);
      setMembers(result.members);
      setInvitations(result.invitations);
      setMemberError("");
    } catch (reason: unknown) {
      setMemberError(reason instanceof Error ? reason.message : "Anggota belum dapat dimuat.");
    }
  };

  const inviteMember = async () => {
    if (!activeWorkspace?.isOwner || !inviteEmail.trim()) return;
    setIsInviting(true);
    setMemberError("");
    setSuccess("");
    try {
      const invitation = await createWorkspaceInvitation(activeWorkspace.id, {
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setInviteLink(`${window.location.origin}/ruang-proyek?invite=${encodeURIComponent(invitation.inviteToken ?? "")}`);
      setInviteEmail("");
      await refreshMembers(activeWorkspace.id);
      setSuccess("Undangan dibuat. Bagikan tautan aman ini kepada rekan Anda.");
    } catch (reason: unknown) {
      setMemberError(reason instanceof Error ? reason.message : "Undangan gagal dibuat.");
    } finally {
      setIsInviting(false);
    }
  };

  const copyInviteLink = async () => {
    if (!inviteLink) return;
    try {
      await navigator.clipboard.writeText(inviteLink);
      setSuccess("Tautan undangan disalin.");
    } catch {
      setMemberError("Tautan siap disalin secara manual dari kotak di atas.");
    }
  };

  const removeMember = async (member: ProjectWorkspaceMember) => {
    if (!activeWorkspace?.isOwner || !window.confirm(`Cabut akses ${member.name} dari ruang ini?`)) return;
    setIsLoadingMembers(true);
    try {
      await revokeWorkspaceMember(activeWorkspace.id, member.id);
      await refreshMembers(activeWorkspace.id);
      setSuccess(`Akses ${member.name} dicabut.`);
    } catch (reason: unknown) {
      setMemberError(reason instanceof Error ? reason.message : "Akses anggota gagal dicabut.");
    } finally {
      setIsLoadingMembers(false);
    }
  };

  const cancelInvitation = async (invitation: ProjectWorkspaceInvitation) => {
    if (!activeWorkspace?.isOwner) return;
    try {
      await revokeWorkspaceInvitation(activeWorkspace.id, invitation.id);
      await refreshMembers(activeWorkspace.id);
      setSuccess("Undangan dibatalkan.");
    } catch (reason: unknown) {
      setMemberError(reason instanceof Error ? reason.message : "Undangan gagal dibatalkan.");
    }
  };

  const acceptInvitation = async () => {
    if (!invitationToken) return;
    setIsAcceptingInvitation(true);
    setInvitationError("");
    try {
      const acceptedWorkspace = await acceptWorkspaceInvitation(invitationToken);
      setWorkspaces((current) => [acceptedWorkspace, ...current.filter((workspace) => workspace.id !== acceptedWorkspace.id)]);
      loadWorkspace(acceptedWorkspace);
      setInvitationInfo(null);
      setInvitationToken("");
      window.history.replaceState({}, "", `/ruang-proyek?workspace=${encodeURIComponent(acceptedWorkspace.id)}`);
      setSuccess("Undangan diterima. Ruang proyek sekarang tersedia di daftar Anda.");
    } catch (reason: unknown) {
      setInvitationError(reason instanceof Error ? reason.message : "Undangan gagal diterima.");
    } finally {
      setIsAcceptingInvitation(false);
    }
  };

  const activeWorkspaces = workspaces.filter((workspace) => !workspace.archivedAt);
  const archivedWorkspaces = workspaces.filter((workspace) => workspace.archivedAt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <header className="border-b border-white/[0.08] bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="Kembali ke beranda KonstruksiAI">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="truncate text-2xl font-bold leading-none tracking-[0.01em] text-white sm:text-[1.6875rem]">
                  KONSTRUKSI<span className="text-orange-400">AI</span>
                </span>
                <span className="hidden rounded-full border border-orange-400/25 bg-orange-400/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-orange-300 sm:inline-flex">
                  Ruang kerja
                </span>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] leading-tight tracking-[0.01em] text-slate-500 sm:gap-2 sm:text-[13px]">
                <FolderKanban className="h-3 w-3 text-cyan-400/80 sm:h-3.5 sm:w-3.5" />
                Ruang Proyek
              </span>
            </div>
          </Link>
          <NavbarAuth />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="transition-colors hover:text-white">Beranda</Link>
          <span aria-hidden="true">/</span>
          <span className="text-slate-300">Ruang Proyek</span>
        </div>

        {(isLoadingInvitation || invitationInfo || invitationError) && (
          <section className="mb-8 rounded-2xl border border-orange-400/25 bg-orange-400/[0.07] p-5">
            {isLoadingInvitation ? (
              <p className="flex items-center gap-2 text-sm text-orange-100">
                <Loader2 className="h-4 w-4 animate-spin" /> Memeriksa undangan…
              </p>
            ) : invitationInfo ? (
              <>
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-orange-300">
                      <UserPlus className="h-3.5 w-3.5" /> Undangan ruang proyek
                    </p>
                    <h2 className="mt-1 text-lg font-semibold text-white">{invitationInfo.workspaceName}</h2>
                    <p className="mt-1 text-sm text-slate-300">
                      Anda diundang sebagai <strong className="text-white">{invitationInfo.role === "editor" ? "editor" : "viewer"}</strong>.
                    </p>
                  </div>
                  {currentUserEmail ? (
                    currentUserEmail.toLowerCase() === invitationInfo.invitedEmail ? (
                      <button
                        type="button"
                        onClick={acceptInvitation}
                        disabled={isAcceptingInvitation}
                        className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-400 disabled:opacity-60"
                      >
                        {isAcceptingInvitation && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                        Terima undangan
                      </button>
                    ) : (
                      <p className="max-w-xs text-right text-xs leading-relaxed text-orange-100">
                        Masuk sebagai <strong>{invitationInfo.invitedEmail}</strong> untuk menerima undangan ini.
                      </p>
                    )
                  ) : (
                    <Link
                      href={`/login?redirect=${encodeURIComponent(`/ruang-proyek?invite=${invitationToken}`)}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-orange-400"
                    >
                      Masuk untuk menerima
                    </Link>
                  )}
                </div>
                {invitationError && <p role="alert" className="mt-3 text-xs text-red-200">{invitationError}</p>}
                <p className="mt-3 text-[11px] text-slate-500">
                  Tautan ini berlaku sampai {new Date(invitationInfo.expiresAt).toLocaleDateString("id-ID")}.
                </p>
              </>
            ) : (
              <p role="alert" className="text-sm text-red-200">{invitationError}</p>
            )}
          </section>
        )}

        <section className="mb-10 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Blueprint ruang kerja KonstruksiAI
            </div>
            <h1 className="max-w-3xl text-4xl font-bold leading-[1.06] tracking-[-0.04em] text-white sm:text-5xl">
              Dari tender sampai serah terima,{" "}
              <span className="text-cyan-300">lebih terarah.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg">
              Satu alur untuk memilih konteks, membuka alat yang tepat, dan memahami keluaran setiap tahap pekerjaan.
              Fitur KonstruksiAI tetap berdiri sendiri—ruang ini membantu Anda menghubungkannya.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-2xl shadow-cyan-950/10">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Konteks pekerjaan</p>
                <h2 className="mt-1 text-lg font-semibold text-white">{displayName}</h2>
              </div>
              <span className="rounded-full border border-slate-700 bg-slate-950 px-2.5 py-1 text-[10px] text-slate-500">
                Sesi ini
              </span>
            </div>
            <label htmlFor="project-name" className="sr-only">Nama pekerjaan</label>
            <input
              id="project-name"
              value={projectName}
              maxLength={160}
              readOnly={!canEditWorkspace}
              onChange={(event) => {
                setProjectName(event.target.value);
                markDirty();
              }}
              placeholder="Contoh: Rehabilitasi Gedung Sekolah"
              onFocus={() => {
                setError("");
                setSuccess("");
              }}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
            />
            <label htmlFor="project-notes" className="sr-only">Catatan pekerjaan</label>
            <textarea
              id="project-notes"
              value={notes}
              maxLength={2000}
              readOnly={!canEditWorkspace}
              onChange={(event) => {
                setNotes(event.target.value);
                markDirty();
              }}
              placeholder="Catatan fokus atau keputusan awal (opsional)"
              rows={2}
              className="mt-3 w-full resize-none rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[11px] text-slate-600">
              <Wrench className="h-3 w-3" />
                {activeWorkspace
                  ? activeWorkspace.accessRole === "viewer"
                    ? "Anda memiliki akses viewer."
                    : activeWorkspace.isOwner
                      ? isDirty
                        ? "Perubahan belum tersimpan."
                        : "Ruang proyek tersimpan di akun Anda."
                      : isDirty
                        ? "Perubahan belum tersimpan."
                        : "Ruang proyek dibagikan kepada Anda."
                  : isDirty
                    ? "Draf belum tersimpan."
                    : "Simpan agar dapat dilanjutkan setelah masuk kembali."}
              </p>
              <div className="flex items-center gap-2">
                {activeWorkspace && (
                  <button
                    type="button"
                    onClick={startNewWorkspace}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-2 text-xs font-semibold text-slate-400 transition-colors hover:border-slate-500 hover:text-white"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Baru
                  </button>
                )}
                <button
                  type="button"
                  onClick={saveWorkspace}
                  disabled={isSaving || !canEditWorkspace || (Boolean(activeWorkspace) && !isDirty)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500 px-3 py-2 text-xs font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSaving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                  {!canEditWorkspace ? "Hanya lihat" : activeWorkspace ? "Simpan perubahan" : "Simpan ruang proyek"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-[11px] text-slate-600">
              {authRequired ? (
                <>Belum masuk? <Link href="/login" className="text-cyan-400 hover:text-cyan-300">Masuk untuk menyimpan permanen.</Link></>
              ) : activeWorkspace?.accessRole === "viewer" ? (
                "Perubahan hanya dapat dilakukan oleh pemilik atau editor."
              ) : (
                "Nama dan catatan akan tersimpan di akun Anda setelah disimpan."
              )}
            </p>
          </div>
        </section>

        {activeWorkspace?.isOwner && (
          <section className="mb-8 rounded-2xl border border-cyan-400/20 bg-slate-900/70 p-5 shadow-xl shadow-cyan-950/10 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-cyan-300">
                  <UserPlus className="h-3.5 w-3.5" /> Kolaborasi tim
                </p>
                <h2 className="mt-1 text-lg font-semibold text-white">Undang rekan ke ruang ini</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-slate-400">
                  Bagikan konteks pekerjaan tanpa memindahkan ownership. Viewer hanya dapat membaca, sedangkan editor dapat memperbarui catatan dan tahap.
                </p>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                Pemilik
              </span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-[minmax(0,1fr)_10rem_auto]">
              <label className="sr-only" htmlFor="invite-email">Email rekan</label>
              <input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(event) => setInviteEmail(event.target.value)}
                placeholder="nama@perusahaan.com"
                className="rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-400/60 focus:ring-2 focus:ring-cyan-400/10"
              />
              <label className="sr-only" htmlFor="invite-role">Peran rekan</label>
              <select
                id="invite-role"
                value={inviteRole}
                onChange={(event) => setInviteRole(event.target.value as "viewer" | "editor")}
                className="rounded-xl border border-slate-700 bg-slate-950/80 px-3.5 py-3 text-sm text-white outline-none focus:border-cyan-400/60"
              >
                <option value="viewer">Viewer</option>
                <option value="editor">Editor</option>
              </select>
              <button
                type="button"
                onClick={inviteMember}
                disabled={isInviting || !inviteEmail.trim()}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isInviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
                Undang
              </button>
            </div>
            {inviteLink && (
              <div className="mt-3 flex flex-col gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] p-3 sm:flex-row sm:items-center">
                <input readOnly value={inviteLink} aria-label="Tautan undangan" className="min-w-0 flex-1 bg-transparent text-xs text-emerald-100 outline-none" />
                <button type="button" onClick={copyInviteLink} className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-emerald-300/30 px-3 py-2 text-xs font-semibold text-emerald-100 hover:bg-emerald-300/10">
                  Salin tautan
                </button>
              </div>
            )}
            {memberError && <p role="alert" className="mt-3 text-xs text-red-200">{memberError}</p>}
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Anggota aktif</p>
                  <span className="text-[11px] text-slate-600">{isLoadingMembers ? "…" : members.length}</span>
                </div>
                {members.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-xs text-slate-600">Belum ada anggota lain.</p>
                ) : (
                  <div className="space-y-2">
                    {members.map((member) => (
                      <div key={member.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2.5">
                        <div className="flex min-w-0 items-center gap-2.5">
                          <UserRound className="h-4 w-4 shrink-0 text-slate-500" />
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-slate-200">{member.name}</p>
                            <p className="truncate text-[11px] text-slate-600">{member.email}</p>
                          </div>
                        </div>
                        <div className="flex shrink-0 items-center gap-2">
                          <span className="text-[10px] text-cyan-300">{member.role === "editor" ? "Editor" : "Viewer"}</span>
                          <button type="button" onClick={() => removeMember(member)} className="rounded p-1 text-slate-600 hover:bg-red-400/10 hover:text-red-300" aria-label={`Cabut akses ${member.name}`}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Undangan tertunda</p>
                  <span className="text-[11px] text-slate-600">{invitations.length}</span>
                </div>
                {invitations.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-slate-800 px-3 py-4 text-xs text-slate-600">Tidak ada undangan aktif.</p>
                ) : (
                  <div className="space-y-2">
                    {invitations.map((invitation) => (
                      <div key={invitation.id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2.5">
                        <div className="min-w-0">
                          <p className="truncate text-sm text-slate-300">{invitation.invitedEmail}</p>
                          <p className="text-[11px] text-slate-600">{invitation.role === "editor" ? "Editor" : "Viewer"} · berlaku 7 hari</p>
                        </div>
                        <button type="button" onClick={() => cancelInvitation(invitation)} className="shrink-0 text-[11px] text-slate-600 hover:text-red-300">Batalkan</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        <section className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-6 lg:self-start">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Alur pekerjaan</p>
              <span className="text-[11px] text-slate-600">5 tahap</span>
            </div>
            <StageRail activeIndex={activeIndex} onSelect={selectStage} disabled={!canEditWorkspace} />
            {error && (
              <div role="alert" className="mt-4 flex items-start gap-2 rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-xs leading-relaxed text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-300" />
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div role="status" className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-xs leading-relaxed text-emerald-200">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <span>{success}</span>
              </div>
            )}
            {resumeCandidate && (
              <div className="mt-4 rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3">
                <p className="text-xs leading-relaxed text-slate-300">
                  Ada ruang tersimpan yang dapat dilanjutkan: <strong className="font-semibold text-white">{resumeCandidate.name}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => loadWorkspace(resumeCandidate)}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-cyan-300 transition-colors hover:text-cyan-200"
                >
                  Lanjutkan ruang tersimpan
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
            {!isLoadingWorkspaces && !authRequired && activeWorkspaces.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Ruang tersimpan</p>
                  <span className="text-[11px] text-slate-600">{activeWorkspaces.length}</span>
                </div>
                <div className="space-y-2">
                  {activeWorkspaces.map((workspace) => (
                    <div
                      key={workspace.id}
                      className={`rounded-xl border p-3 transition-colors ${
                        activeWorkspaceId === workspace.id
                          ? "border-cyan-400/30 bg-cyan-400/[0.06]"
                          : "border-slate-800 bg-slate-950/30"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => loadWorkspace(workspace)}
                        className="w-full text-left"
                      >
                        <span className="block truncate text-sm font-semibold text-slate-200">{workspace.name}</span>
                        <span className="mt-1 block text-[11px] text-slate-600">
                          {workspace.isOwner ? "Pemilik" : `${workspace.accessRole === "editor" ? "Editor" : "Viewer"} · dibagikan`} · {STAGES.find((stage) => stage.id === workspace.stageId)?.title ?? "Tahap awal"}
                        </span>
                      </button>
                      {workspace.isOwner && <button
                        type="button"
                        onClick={() => archiveWorkspace(workspace)}
                        disabled={isSaving}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-slate-600 transition-colors hover:text-red-300 disabled:opacity-50"
                      >
                        <Archive className="h-3 w-3" />
                        Arsipkan
                      </button>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {!isLoadingWorkspaces && !authRequired && archivedWorkspaces.length > 0 && (
              <div className="mt-5">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-600">Arsip</p>
                  <span className="text-[11px] text-slate-700">{archivedWorkspaces.length}</span>
                </div>
                <div className="space-y-2">
                  {archivedWorkspaces.map((workspace) => (
                    <div key={workspace.id} className="rounded-xl border border-slate-800/80 bg-slate-950/20 p-3">
                      <span className="block truncate text-sm font-semibold text-slate-500">{workspace.name}</span>
                      {workspace.isOwner && <button
                        type="button"
                        onClick={() => restoreWorkspace(workspace)}
                        disabled={isSaving}
                        className="mt-2 inline-flex items-center gap-1 text-[11px] text-cyan-400 transition-colors hover:text-cyan-300 disabled:opacity-50"
                      >
                        <Archive className="h-3 w-3 rotate-180" />
                        Pulihkan
                      </button>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/40 p-4">
              <p className="text-xs font-semibold text-slate-300">Cara memakai ruang ini</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                Pilih tahap yang sedang Anda hadapi. Gunakan tindakan yang tersedia untuk masuk ke fitur existing tanpa membuat status proyek fiktif. Simpan ruang jika ingin melanjutkannya nanti.
              </p>
            </div>
          </aside>

          <div className="min-w-0">
            <div className={`rounded-2xl border p-5 sm:p-7 ${activeStage.softAccent}`}>
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${activeStage.softAccent} ${activeStage.accent}`}>
                    <ActiveIcon className="h-6 w-6" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className={`text-[10px] font-bold uppercase tracking-[0.18em] ${activeStage.accent}`}>
                      Tahap {activeStage.number} · {activeStage.label}
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-white sm:text-3xl">{activeStage.title}</h2>
                  </div>
                </div>
                <span className="rounded-full border border-white/10 bg-slate-950/40 px-3 py-1.5 text-[10px] font-medium text-slate-400">
                  Tahap aktif
                </span>
              </div>
              <p className="mt-5 max-w-3xl text-sm leading-relaxed text-slate-300 sm:text-base">{activeStage.description}</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Input yang dibutuhkan</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{activeStage.input}</p>
                </div>
                <div className="rounded-xl border border-white/10 bg-slate-950/30 p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">Keluaran yang dituju</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">{activeStage.output}</p>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Tindakan berikutnya</p>
                  <p className="mt-1 text-sm text-slate-400">Masuk ke alat yang sudah tersedia untuk tahap ini.</p>
                </div>
                <span className="hidden text-xs text-slate-600 sm:block">{displayName}</span>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {activeStage.actions.map((action) => {
                  const ActionIcon = action.icon;
                  const canCarryContext = Boolean(activeWorkspace);
                  return (
                    <Link
                      key={action.href + action.label}
                      href={withWorkspaceContext(action.href, activeWorkspace?.id)}
                      className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-5 transition-all hover:-translate-y-0.5 hover:border-slate-600 hover:bg-slate-900"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <span className={`flex h-10 w-10 items-center justify-center rounded-xl border ${activeStage.softAccent} ${activeStage.accent}`}>
                          <ActionIcon className="h-5 w-5" strokeWidth={1.8} />
                        </span>
                        <ArrowRight className="h-4 w-4 text-slate-600 transition-transform group-hover:translate-x-1 group-hover:text-white" />
                      </div>
                      <h3 className="mt-5 text-base font-semibold text-white">{action.label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">{action.description}</p>
                       <p className={`mt-3 text-[11px] font-medium ${canCarryContext ? "text-cyan-300" : "text-slate-600"}`}>
                         {canCarryContext
                           ? `Membawa konteks: ${displayName}`
                           : "Simpan ruang proyek untuk membawa konteks pekerjaan."}
                       </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="mt-6 flex flex-col items-stretch justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-800 text-slate-400">
                  <FolderKanban className="h-4 w-4" />
                </div>
                <p className="text-xs leading-relaxed text-slate-500">
                  Alur ini adalah panduan kerja, bukan status proyek otomatis.
                </p>
              </div>
              {activeIndex < STAGES.length - 1 ? (
                <button
                  type="button"
                  onClick={() => selectStage(activeIndex + 1)}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                >
                  Lihat tahap berikutnya
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
                >
                  Kembali ke beranda
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}