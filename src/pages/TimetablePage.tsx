import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { ScheduleItem, ScheduleType, Priority } from '../types';
import { Plus, Trash2, Play, Filter, Clock } from 'lucide-react';

export const TimetablePage: React.FC = () => {
  const { schedule, subjects, addScheduleItem, deleteScheduleItem, startFocusTimer, setActiveTab } = useJarvis();
  const [filterType, setFilterType] = useState<string>('ALL');
  const [filterSubject, setFilterSubject] = useState<string>('ALL');
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [newItem, setNewItem] = useState({
    title: '',
    subjectId: 'sub-phys',
    topicName: '',
    startTime: '14:00',
    endTime: '15:00',
    date: new Date().toISOString().split('T')[0],
    timeOfDay: 'AFTERNOON' as any,
    type: 'STUDY' as ScheduleType,
    priority: 'MEDIUM' as Priority,
    status: 'UPCOMING' as any,
  });

  const filtered = schedule.filter((s: ScheduleItem) => {
    if (filterType !== 'ALL' && s.type !== filterType) return false;
    if (filterSubject !== 'ALL' && s.subjectId !== filterSubject) return false;
    return true;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.title || !newItem.topicName) return;
    addScheduleItem(newItem);
    setIsAddOpen(false);
    setNewItem({
      title: '',
      subjectId: 'sub-phys',
      topicName: '',
      startTime: '14:00',
      endTime: '15:00',
      date: new Date().toISOString().split('T')[0],
      timeOfDay: 'AFTERNOON',
      type: 'STUDY',
      priority: 'MEDIUM',
      status: 'UPCOMING',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">Weekly Study Timetable</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Master study plan with multi-subject filtering and schedule item creation
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Activity</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Filter className="w-3.5 h-3.5 text-teal-400" />
            <span>Type:</span>
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Types</option>
            <option value="STUDY">Study</option>
            <option value="REVISION">Revision</option>
            <option value="QUIZ">Quiz</option>
            <option value="BREAK">Break</option>
            <option value="EXAM">Exam</option>
          </select>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400 ml-2">
            <span>Subject:</span>
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-1.5 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none"
          >
            <option value="ALL">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Showing <strong>{filtered.length}</strong> items
        </div>
      </div>

      {/* Timetable Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item: ScheduleItem) => {
          const sub = subjects.find((s) => s.id === item.subjectId);

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between shadow-sm relative group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border"
                    style={{
                      color: sub?.color || '#2dd4bf',
                      backgroundColor: `${sub?.color || '#2dd4bf'}15`,
                      borderColor: `${sub?.color || '#2dd4bf'}40`,
                    }}
                  >
                    {sub?.name || 'Subject'}
                  </span>

                  <div className="flex items-center gap-1.5 font-mono text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5 text-teal-400" />
                    <span>{item.startTime} - {item.endTime}</span>
                  </div>
                </div>

                <h3 className="font-display font-bold text-base text-slate-100">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Topic: {item.topicName}
                </p>

                {item.notes && (
                  <p className="text-xs text-slate-500 mt-2 bg-slate-950/60 p-2 rounded-lg border border-slate-850 italic">
                    "{item.notes}"
                  </p>
                )}
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                    {item.type}
                  </span>
                  <span className="text-[10px] font-mono text-red-400">
                    {item.priority}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      startFocusTimer(45, item.subjectId, item.topicName);
                      setActiveTab('focus');
                    }}
                    className="p-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40"
                    title="Launch Focus Session"
                  >
                    <Play className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => deleteScheduleItem(item.id)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10"
                    title="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 rounded-2xl border border-slate-800 p-6">
            <h3 className="font-display font-bold text-base text-slate-100 mb-4">Add Timetable Item</h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  placeholder="e.g. Physics Formula Recall"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject</label>
                  <select
                    value={newItem.subjectId}
                    onChange={(e) => setNewItem({ ...newItem, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Topic</label>
                  <input
                    type="text"
                    required
                    value={newItem.topicName}
                    onChange={(e) => setNewItem({ ...newItem, topicName: e.target.value })}
                    placeholder="Topic name"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={newItem.startTime}
                    onChange={(e) => setNewItem({ ...newItem, startTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={newItem.endTime}
                    onChange={(e) => setNewItem({ ...newItem, endTime: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
