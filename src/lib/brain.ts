// ============================================================
// KONSTRUKSI AI - PROJECT BRAIN MODULE
// Project Management, Task Board, Collaboration
// ============================================================

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type ViewMode = 'board' | 'list' | 'gantt' | 'calendar';

export interface Project {
  id: string;
  name: string;
  description: string;
  client?: string;
  location?: string;
  status: ProjectStatus;
  startDate: Date;
  endDate?: Date;
  budget?: number;
  progress: number;
  members: ProjectMember[];
  tasks: Task[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  avatar?: string;
  joinedAt: Date;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: ProjectMember;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: SubTask[];
  attachments: Attachment[];
  comments: Comment[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubTask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Comment {
  id: string;
  author: ProjectMember;
  content: string;
  createdAt: Date;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
}

export interface Document {
  id: string;
  name: string;
  type: 'contract' | 'drawing' | 'report' | 'permit' | 'other';
  url: string;
  uploadedBy: string;
  uploadedAt: Date;
}

export interface Activity {
  id: string;
  user: string;
  action: string;
  target: string;
  createdAt: Date;
}

// ============================================================
// SAMPLE PROJECTS
// ============================================================

export const SAMPLE_PROJECTS: Project[] = [
  {
    id: 'proj-001',
    name: 'Pembangunan Gedung Perkantoran XYZ',
    description: 'Proyek pembangunan gedung perkantoran 8 lantai dengan basement di Jakarta Selatan',
    client: 'PT. XYZ Indonesia',
    location: 'Jakarta Selatan, DKI Jakarta',
    status: 'active',
    startDate: new Date('2024-03-01'),
    endDate: new Date('2025-09-30'),
    budget: 50000000000, // 50 Miliar
    progress: 35,
    members: [
      { id: 'user-001', name: 'Budi Santoso', email: 'budi@example.com', role: 'owner', joinedAt: new Date('2024-03-01') },
      { id: 'user-002', name: 'Ani Wijaya', email: 'ani@example.com', role: 'admin', joinedAt: new Date('2024-03-05') },
      { id: 'user-003', name: 'Dedi Kurniawan', email: 'dedi@example.com', role: 'member', joinedAt: new Date('2024-03-10') }
    ],
    tasks: [
      {
        id: 'task-001',
        title: 'Pekerjaan Persiapan Lapangan',
        description: 'Pembersihan lahan, pemasangan pagar proyek, dan pembuatan office site',
        status: 'done',
        priority: 'high',
        assignee: { id: 'user-002', name: 'Ani Wijaya', email: 'ani@example.com', role: 'admin', joinedAt: new Date('2024-03-05') },
        dueDate: new Date('2024-03-15'),
        estimatedHours: 120,
        actualHours: 115,
        tags: ['persiapan', 'site-work'],
        subtasks: [
          { id: 'sub-001', title: 'Pembersihan lahan', isCompleted: true },
          { id: 'sub-002', title: 'Pemasangan pagar', isCompleted: true },
          { id: 'sub-003', title: 'Pembuatan jalan sementara', isCompleted: true }
        ],
        attachments: [],
        comments: [],
        createdBy: 'user-001',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-15')
      },
      {
        id: 'task-002',
        title: 'Pekerjaan Pondasi',
        description: 'Penggalian, pembesian, dan pengecoran pondasi tapak dan bore pile',
        status: 'in_progress',
        priority: 'urgent',
        assignee: { id: 'user-003', name: 'Dedi Kurniawan', email: 'dedi@example.com', role: 'member', joinedAt: new Date('2024-03-10') },
        dueDate: new Date('2024-04-30'),
        estimatedHours: 480,
        actualHours: 200,
        tags: ['pondasi', 'struktur', 'kritis'],
        subtasks: [
          { id: 'sub-004', title: 'Survey dan marking pondasi', isCompleted: true },
          { id: 'sub-005', title: 'Penggalian pondasi', isCompleted: true },
          { id: 'sub-006', title: 'Pembesian pondasi', isCompleted: false },
          { id: 'sub-007', title: 'Pengecoran pondasi', isCompleted: false }
        ],
        attachments: [],
        comments: [],
        createdBy: 'user-001',
        createdAt: new Date('2024-03-10'),
        updatedAt: new Date('2024-03-20')
      },
      {
        id: 'task-003',
        title: 'Pemesanan Material Struktur',
        description: 'Pengajuan dan pemesanan material beton dan baja untuk struktur',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2024-04-15'),
        estimatedHours: 40,
        tags: ['material', 'procurement', 'beton'],
        subtasks: [],
        attachments: [],
        comments: [],
        createdBy: 'user-002',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      },
      {
        id: 'task-004',
        title: 'Perencanaan Schedule Proyek',
        description: 'Membuat S-curve dan baseline schedule proyek',
        status: 'done',
        priority: 'medium',
        assignee: { id: 'user-001', name: 'Budi Santoso', email: 'budi@example.com', role: 'owner', joinedAt: new Date('2024-03-01') },
        dueDate: new Date('2024-03-10'),
        estimatedHours: 80,
        actualHours: 75,
        tags: ['planning', 'schedule'],
        subtasks: [
          { id: 'sub-008', title: 'WBS breakdown', isCompleted: true },
          { id: 'sub-009', title: 'Estimasi durasi aktivitas', isCompleted: true },
          { id: 'sub-010', title: 'Resource loading', isCompleted: true },
          { id: 'sub-011', title: 'Baseline approval', isCompleted: true }
        ],
        attachments: [],
        comments: [],
        createdBy: 'user-001',
        createdAt: new Date('2024-03-01'),
        updatedAt: new Date('2024-03-10')
      },
      {
        id: 'task-005',
        title: 'Izin Pembangunan (IMB/SLF)',
        description: 'Pengurusan izin mendirikan bangunan atau sertifikat laik fungsi',
        status: 'backlog',
        priority: 'medium',
        dueDate: new Date('2024-05-01'),
        estimatedHours: 60,
        tags: ['permit', 'legal', 'izin'],
        subtasks: [],
        attachments: [],
        comments: [],
        createdBy: 'user-002',
        createdAt: new Date('2024-03-15'),
        updatedAt: new Date('2024-03-15')
      }
    ],
    documents: [
      { id: 'doc-001', name: 'Kontrak Kerja.pdf', type: 'contract', url: '#', uploadedBy: 'user-001', uploadedAt: new Date('2024-03-01') },
      { id: 'doc-002', name: 'Gambar Arsitektur.dwg', type: 'drawing', url: '#', uploadedBy: 'user-002', uploadedAt: new Date('2024-03-05') },
      { id: 'doc-003', name: 'Gambar Struktur.dwg', type: 'drawing', url: '#', uploadedBy: 'user-003', uploadedAt: new Date('2024-03-08') }
    ],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-03-20')
  },
  {
    id: 'proj-002',
    name: 'Renovasi Rumah Tinggal Pak Ahmad',
    description: 'Renovasi dan penambahan lantai 2 rumah tinggal',
    client: 'Bapak Ahmad',
    location: 'Bandung, Jawa Barat',
    status: 'planning',
    startDate: new Date('2024-04-15'),
    budget: 500000000, // 500 Juta
    progress: 0,
    members: [
      { id: 'user-001', name: 'Budi Santoso', email: 'budi@example.com', role: 'owner', joinedAt: new Date('2024-04-01') }
    ],
    tasks: [
      {
        id: 'task-006',
        title: 'Survey Kondisi Eksisting',
        description: 'Pengecekan kondisi struktur dan arsitektur bangunan eksisting',
        status: 'todo',
        priority: 'high',
        dueDate: new Date('2024-04-10'),
        estimatedHours: 24,
        tags: ['survey', 'assesment'],
        subtasks: [],
        attachments: [],
        comments: [],
        createdBy: 'user-001',
        createdAt: new Date('2024-04-01'),
        updatedAt: new Date('2024-04-01')
      }
    ],
    documents: [],
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-04-01')
  }
];

// ============================================================
// HELPER FUNCTIONS
// ============================================================

export function getTasksByStatus(project: Project, status: TaskStatus): Task[] {
  return project.tasks.filter(task => task.status === status);
}

export function getTaskCounts(project: Project): Record<TaskStatus, number> {
  return {
    backlog: project.tasks.filter(t => t.status === 'backlog').length,
    todo: project.tasks.filter(t => t.status === 'todo').length,
    in_progress: project.tasks.filter(t => t.status === 'in_progress').length,
    review: project.tasks.filter(t => t.status === 'review').length,
    done: project.tasks.filter(t => t.status === 'done').length
  };
}

export function getPriorityColor(priority: TaskPriority): string {
  const colors = {
    low: 'bg-slate-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    urgent: 'bg-red-500'
  };
  return colors[priority];
}

export function getPriorityLabel(priority: TaskPriority): string {
  const labels = {
    low: 'Rendah',
    medium: 'Sedang',
    high: 'Tinggi',
    urgent: 'Mendesak'
  };
  return labels[priority];
}

export function getStatusColor(status: ProjectStatus): string {
  const colors = {
    planning: 'bg-blue-500',
    active: 'bg-green-500',
    on_hold: 'bg-yellow-500',
    completed: 'bg-purple-500',
    cancelled: 'bg-red-500'
  };
  return colors[status];
}

export function getStatusLabel(status: ProjectStatus): string {
  const labels = {
    planning: 'Perencanaan',
    active: 'Aktif',
    on_hold: 'Ditunda',
    completed: 'Selesai',
    cancelled: 'Dibatalkan'
  };
  return labels[status];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDuration(hours: number): string {
  if (hours < 24) return `${hours} jam`;
  const days = Math.floor(hours / 8);
  const remainingHours = hours % 8;
  if (remainingHours === 0) return `${days} hari`;
  return `${days} hari ${remainingHours} jam`;
}

export function calculateProgress(project: Project): number {
  if (project.tasks.length === 0) return 0;
  const completedTasks = project.tasks.filter(t => t.status === 'done').length;
  return Math.round((completedTasks / project.tasks.length) * 100);
}
