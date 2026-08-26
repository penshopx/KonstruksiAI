// ============================================================
// KONSTRUKSI AI - SIMULASI UJI KOMPETENSI MODULE (frontend helpers)
// The exam bank, questions, and grading now live in the backend
// (artifacts/api-server) so correct answers are never shipped to the
// client ahead of time. This file only keeps small label/type helpers
// shared by the Simulasi UI.
// ============================================================

export type ExamCategory =
  | 'struktur'
  | 'arsitektur'
  | 'mekanikal'
  | 'elektrikal'
  | 'k3'
  | 'manajemen'
  | 'energi'
  | 'migas'
  | 'pengadaan';

export type ExamLevel = 'operator' | 'teknisi' | 'supervisor' | 'ahli';

export function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    struktur: 'Teknik Struktur',
    arsitektur: 'Arsitektur',
    mekanikal: 'Mekanikal',
    elektrikal: 'Elektrikal',
    k3: 'K3 & Keselamatan',
    manajemen: 'Manajemen Proyek',
    energi: 'Energi & EBT',
    migas: 'Migas & Tambang',
    pengadaan: 'Pengadaan',
  };
  return labels[category] || category;
}

export function getLevelLabel(level: string): string {
  const labels: Record<string, string> = {
    operator: 'Operator',
    teknisi: 'Teknisi',
    supervisor: 'Supervisor',
    ahli: 'Ahli',
  };
  return labels[level] || level;
}

export function getLevelColor(level: string): string {
  const colors: Record<string, string> = {
    operator: 'bg-green-100 text-green-700',
    teknisi: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-orange-100 text-orange-700',
    ahli: 'bg-purple-100 text-purple-700',
  };
  return colors[level] || 'bg-slate-100 text-slate-700';
}
