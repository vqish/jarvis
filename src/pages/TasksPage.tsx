import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { Task, Priority, TaskStatus } from '../types';
import { 
  CheckSquare, 
  Square, 
  Plus, 
  Trash2, 
  Search, 
  Calendar, 
  X 
} from 'lucide-react';

export const TasksPage: React.FC = () => {
  const { tasks, subjects, addTask, updateTask, deleteTask } = useJarvis();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterPriority, setFilterPriority] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    subjectId: 'sub-phys',
    priority: 'HIGH' as Priority,
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  });

  const filtered = tasks.filter((t: Task) => {
    if (filterStatus !== 'ALL' && t.status !== filterStatus) return false;
    if (filterPriority !== 'ALL' && t.priority !== filterPriority) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase()) && !t.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const handleToggle = (task: Task) => {
    const nextStatus: TaskStatus = task.status === 'COMPLETED' ? 'TODO' : 'COMPLETED';
    updateTask(task.id, { status: nextStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    addTask(newTask.title.trim(), newTask.subjectId, newTask.priority, newTask.dueDate);
    setIsAddOpen(false);
    setNewTask({
      title: '',
      description: '',
      subjectId: 'sub-phys',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    });
  };

  const getPriorityBadge = (prio: Priority) => {
    switch (prio) {
      case 'URGENT': return 'bg-red-950/80 text-red-300 border-red-800';
      case 'HIGH': return 'bg-orange-950/80 text-orange-300 border-orange-800';
      case 'MEDIUM': return 'bg-amber-950/80 text-amber-300 border-amber-800';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">Study Task Manager</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Organize homework, problem sets, proof derivations, and exam milestones
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="md:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search problem sets, proofs, topics..."
            className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
          />
        </div>

        <div className="md:col-span-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="TODO">To Do</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Priorities</option>
            <option value="URGENT">Urgent</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-xs font-mono text-slate-500">
            No study tasks match your filter criteria.
          </div>
        ) : (
          filtered.map((task: Task) => {
            const sub = subjects.find((s) => s.id === task.subjectId);
            const isDone = task.status === 'COMPLETED';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isDone
                    ? 'bg-slate-950/40 border-slate-800/60 opacity-65'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3.5 flex-1">
                  <button
                    onClick={() => handleToggle(task)}
                    className="mt-0.5 text-teal-400 hover:text-teal-300 transition-colors"
                  >
                    {isDone ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5 text-slate-500" />}
                  </button>

                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`text-sm font-semibold ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-100'
                        }`}
                      >
                        {task.title}
                      </span>

                      <span
                        className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold"
                        style={{
                          color: sub?.color || '#2dd4bf',
                          backgroundColor: `${sub?.color || '#2dd4bf'}15`,
                          borderColor: `${sub?.color || '#2dd4bf'}40`,
                        }}
                      >
                        {sub?.name || 'Subject'}
                      </span>

                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-full border font-bold ${getPriorityBadge(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.description && (
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {task.description}
                      </p>
                    )}

                    <div className="flex items-center gap-3 text-[11px] font-mono text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        Due: {task.dueDate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => deleteTask(task.id)}
                    className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    title="Delete Task"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-display font-bold text-base text-slate-100">Create New Study Task</h3>
              <button
                onClick={() => setIsAddOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  placeholder="e.g. Solve Halliday & Resnick Gauss Law Problems"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  placeholder="Additional context or page numbers..."
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject</label>
                  <select
                    value={newTask.subjectId}
                    onChange={(e) => setNewTask({ ...newTask, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Due Date</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs text-slate-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
