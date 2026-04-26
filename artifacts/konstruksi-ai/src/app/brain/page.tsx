'use client';

import { useState, useMemo } from 'react';
import Link from '@/shims/next-link';
import { 
  SAMPLE_PROJECTS,
  getTasksByStatus,
  getTaskCounts,
  getPriorityColor,
  getPriorityLabel,
  getStatusColor,
  getStatusLabel,
  formatCurrency,
  calculateProgress,
  type Project,
  type Task,
  type TaskStatus
} from '@/lib/brain';
import { 
  Brain, 
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Calendar,
  MoreHorizontal,
  Clock,
  DollarSign,
  Users,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Edit3,
  Trash2,
  FileText,
  FolderOpen
} from 'lucide-react';

const COLUMNS: { id: TaskStatus; title: string; color: string }[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-slate-500' },
  { id: 'todo', title: 'To Do', color: 'bg-blue-500' },
  { id: 'in_progress', title: 'In Progress', color: 'bg-yellow-500' },
  { id: 'review', title: 'Review', color: 'bg-purple-500' },
  { id: 'done', title: 'Done', color: 'bg-green-500' }
];

export default function BrainPage() {
  const [projects] = useState<Project[]>(SAMPLE_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project>(SAMPLE_PROJECTS[0]);
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');

  const taskCounts = useMemo(() => getTaskCounts(selectedProject), [selectedProject]);
  const totalTasks = selectedProject.tasks.length;
  const completedTasks = selectedProject.tasks.filter(t => t.status === 'done').length;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-slate-900">Project Brain</span>
              </Link>
              
              <div className="h-6 w-px bg-slate-200" />
              
              {/* Project Selector */}
              <select
                value={selectedProject.id}
                onChange={(e) => {
                  const project = projects.find(p => p.id === e.target.value);
                  if (project) setSelectedProject(project);
                }}
                className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2 text-sm font-medium text-slate-700 focus:ring-2 focus:ring-purple-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-4">
              {/* View Mode Toggle */}
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('board')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    viewMode === 'board' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                  Board
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm transition-colors ${
                    viewMode === 'list' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                  List
                </button>
              </div>

              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                New Task
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Project Info Bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-slate-500">Status</p>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(selectedProject.status)}`}>
                  {getStatusLabel(selectedProject.status)}
                </span>
              </div>
              
              <div>
                <p className="text-sm text-slate-500">Progress</p>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-purple-500 rounded-full transition-all"
                      style={{ width: `${calculateProgress(selectedProject)}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-slate-700">{calculateProgress(selectedProject)}%</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-slate-500">Tasks</p>
                <p className="text-sm font-medium text-slate-700">{completedTasks}/{totalTasks} done</p>
              </div>

              {selectedProject.budget && (
                <div>
                  <p className="text-sm text-slate-500">Budget</p>
                  <p className="text-sm font-medium text-slate-700">{formatCurrency(selectedProject.budget)}</p>
                </div>
              )}

              <div>
                <p className="text-sm text-slate-500">Team</p>
                <div className="flex -space-x-2">
                  {selectedProject.members.slice(0, 4).map((member, i) => (
                    <div 
                      key={member.id}
                      className="w-7 h-7 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                      title={member.name}
                    >
                      {member.name.charAt(0)}
                    </div>
                  ))}
                  {selectedProject.members.length > 4 && (
                    <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 text-xs font-medium border-2 border-white">
                      +{selectedProject.members.length - 4}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 w-64"
                />
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {viewMode === 'board' ? (
          <BoardView project={selectedProject} searchQuery={searchQuery} />
        ) : (
          <ListView project={selectedProject} searchQuery={searchQuery} />
        )}
      </main>
    </div>
  );
}

// ============ BOARD VIEW ============
function BoardView({ project, searchQuery }: { project: Project; searchQuery: string }) {
  const filteredColumns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      tasks: getTasksByStatus(project, col.id).filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }));
  }, [project, searchQuery]);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4">
      {filteredColumns.map(column => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${column.color}`} />
              <h3 className="font-semibold text-slate-700">{column.title}</h3>
              <span className="bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                {column.tasks.length}
              </span>
            </div>
            <button className="text-slate-400 hover:text-slate-600">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {column.tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ============ LIST VIEW ============
function ListView({ project, searchQuery }: { project: Project; searchQuery: string }) {
  const filteredTasks = useMemo(() => {
    return project.tasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [project, searchQuery]);

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <table className="w-full">
        <thead className="bg-slate-50 border-b border-slate-200">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Task</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Priority</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Assignee</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Due Date</th>
            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Progress</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {filteredTasks.map(task => (
            <tr key={task.id} className="hover:bg-slate-50">
              <td className="px-6 py-4">
                <p className="font-medium text-slate-900">{task.title}</p>
                <p className="text-sm text-slate-500 line-clamp-1">{task.description}</p>
              </td>
              <td className="px-6 py-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 capitalize">
                  {task.status.replace('_', ' ')}
                </span>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                  task.priority === 'urgent' ? 'text-red-600' :
                  task.priority === 'high' ? 'text-orange-600' :
                  task.priority === 'medium' ? 'text-yellow-600' : 'text-slate-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  {getPriorityLabel(task.priority)}
                </span>
              </td>
              <td className="px-6 py-4">
                {task.assignee ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-medium">
                      {task.assignee.name.charAt(0)}
                    </div>
                    <span className="text-sm text-slate-700">{task.assignee.name}</span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">Unassigned</span>
                )}
              </td>
              <td className="px-6 py-4">
                {task.dueDate ? (
                  <span className={`text-sm ${
                    new Date(task.dueDate) < new Date() && task.status !== 'done' 
                      ? 'text-red-600' 
                      : 'text-slate-600'
                  }`}>
                    {task.dueDate.toLocaleDateString()}
                  </span>
                ) : (
                  <span className="text-sm text-slate-400">-</span>
                )}
              </td>
              <td className="px-6 py-4">
                {task.subtasks.length > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 rounded-full"
                        style={{ 
                          width: `${(task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100}%` 
                        }}
                      />
                    </div>
                    <span className="text-xs text-slate-500">
                      {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm text-slate-400">No subtasks</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============ TASK CARD ============
function TaskCard({ task }: { task: Task }) {
  const subtaskProgress = task.subtasks.length > 0 
    ? Math.round((task.subtasks.filter(s => s.isCompleted).length / task.subtasks.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
      <div className="flex items-start justify-between mb-2">
        <span className={`inline-flex items-center gap-1 text-xs font-medium ${
          task.priority === 'urgent' ? 'text-red-600' :
          task.priority === 'high' ? 'text-orange-600' :
          task.priority === 'medium' ? 'text-yellow-600' : 'text-slate-600'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
          {getPriorityLabel(task.priority)}
        </span>
        <button className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h4 className="font-medium text-slate-900 mb-1">{task.title}</h4>
      <p className="text-sm text-slate-500 line-clamp-2 mb-3">{task.description}</p>

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 2).map((tag, i) => (
            <span key={i} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {task.assignee ? (
            <div 
              className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 text-xs font-medium"
              title={task.assignee.name}
            >
              {task.assignee.name.charAt(0)}
            </div>
          ) : (
            <div className="w-6 h-6 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
              <Users className="w-3 h-3" />
            </div>
          )}

          {task.dueDate && (
            <span className={`text-xs flex items-center gap-1 ${
              new Date(task.dueDate) < new Date() && task.status !== 'done'
                ? 'text-red-500'
                : 'text-slate-400'
            }`}>
              <Clock className="w-3 h-3" />
              {task.dueDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {task.subtasks.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <CheckCircle2 className="w-3 h-3" />
            {task.subtasks.filter(s => s.isCompleted).length}/{task.subtasks.length}
          </div>
        )}
      </div>

      {/* Progress bar for subtasks */}
      {task.subtasks.length > 0 && (
        <div className="mt-3">
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all"
              style={{ width: `${subtaskProgress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
