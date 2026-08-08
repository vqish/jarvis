import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { ScheduleItem, Priority, ScheduleType, ScheduleStatus } from '../types';
import { ScheduleEngine } from '../services/study/ScheduleEngine';
import { 
  Play, 
  Plus, 
  Edit3, 
  Trash2, 
  Sun, 
  Sunrise, 
  Sunset,
  X
} from 'lucide-react';

export const TodayPlanPage: React.FC = () => {
  const { schedule, subjects, startFocusTimer, updateScheduleItem, deleteScheduleItem, addScheduleItem, setActiveTab } = useJarvis();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    subjectId: 'sub-phys',
    topicName: '',
    startTime: '11:30',
    endTime: '12:15',
    timeOfDay: 'MORNING' as 'MORNING' | 'AFTERNOON' | 'EVENING',
    type: 'STUDY' as ScheduleType,
    priority: 'HIGH' as Priority,
    notes: '',
  });

  const grouped = ScheduleEngine.getGroupedSchedule(schedule);

  const handleStartSession = (item: ScheduleItem) => {
    updateScheduleItem(item.id, { status: 'CURRENT' });
    startFocusTimer(45, item.subjectId, item.topicName);
    setActiveTab('focus');
  };

  const handleStatusChange = (id: string, newStatus: ScheduleStatus) => {
    updateScheduleItem(id, { status: newStatus });
  };

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.topicName) return;

    if (editingItem) {
      updateScheduleItem(editingItem.id, { ...formData });
      setEditingItem(null);
    } else {
      addScheduleItem({
        ...formData,
        date: new Date().toISOString().split('T')[0],
        status: 'UPCOMING',
      });
    }
    setIsAddModalOpen(false);
    setFormData({
      title: '',
      subjectId: 'sub-phys',
      topicName: '',
      startTime: '11:30',
      endTime: '12:15',
      timeOfDay: 'MORNING',
      type: 'STUDY',
      priority: 'HIGH',
      notes: '',
    });
  };

  const openEdit = (item: ScheduleItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      subjectId: item.subjectId,
      topicName: item.topicName,
      startTime: item.startTime,
      endTime: item.endTime,
      timeOfDay: item.timeOfDay,
      type: item.type,
      priority: item.priority,
      notes: item.notes || '',
    });
    setIsAddModalOpen(true);
  };

  const renderSection = (title: string, icon: any, items: ScheduleItem[], timeOfDayLabel: string) => {
    const Icon = icon;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2 text-slate-200 font-display font-bold text-base">
            <Icon className="w-4 h-4 text-teal-400" />
            <span>{title}</span>
            <span className="text-xs font-mono text-slate-400 font-normal">({items.length} blocks)</span>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="p-4 rounded-xl bg-slate-900/40 border border-dashed border-slate-800 text-xs text-slate-500 font-mono text-center">
            No study blocks scheduled for {timeOfDayLabel.toLowerCase()}.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item: ScheduleItem) => {
              const sub = subjects.find((s) => s.id === item.subjectId);
              const isCompleted = item.status === 'COMPLETED';
              const isCurrent = item.status === 'CURRENT';
              const isSkipped = item.status === 'SKIPPED';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isCurrent
                      ? 'bg-teal-950/40 border-teal-500/50 shadow-md shadow-teal-500/10'
                      : isCompleted
                      ? 'bg-slate-950/70 border-slate-800 text-slate-400 opacity-85'
                      : isSkipped
                      ? 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                      : 'bg-slate-900/80 border-slate-800 text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start md:items-center gap-4">
                    <div className="text-center font-mono shrink-0">
                      <div className="text-sm font-bold text-slate-100">{item.startTime}</div>
                      <div className="text-[10px] text-slate-500">{item.endTime}</div>
                    </div>

                    <div className="h-10 w-px bg-slate-800 hidden md:block" />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-100 text-sm">{item.title}</span>
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
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-mono mt-0.5">
                        Topic: {item.topicName}
                      </div>
                      {item.notes && (
                        <div className="text-[11px] text-slate-400 mt-1 italic">
                          "{item.notes}"
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-center">
                    <select
                      value={item.status}
                      onChange={(e) => handleStatusChange(item.id, e.target.value as ScheduleStatus)}
                      className="px-2.5 py-1 text-xs font-mono rounded-lg bg-slate-950 border border-slate-700 text-slate-300 focus:outline-none"
                    >
                      <option value="UPCOMING">UPCOMING</option>
                      <option value="CURRENT">CURRENT</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="SKIPPED">SKIPPED</option>
                    </select>

                    <button
                      onClick={() => handleStartSession(item)}
                      className="px-3 py-1 rounded-lg bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs flex items-center gap-1 shadow transition-all active:scale-95"
                      title="Start Focus Timer on this topic"
                    >
                      <Play className="w-3 h-3" />
                      <span>Start</span>
                    </button>

                    <button
                      onClick={() => openEdit(item)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
                      title="Edit Block"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => deleteScheduleItem(item.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete Block"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">Today's Study Plan</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Segmented daily schedule across Morning, Afternoon, and Evening blocks
          </p>
        </div>

        <button
          onClick={() => {
            setEditingItem(null);
            setIsAddModalOpen(true);
          }}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-semibold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Study Block</span>
        </button>
      </div>

      {/* Plan Timeline Sections */}
      <div className="space-y-8">
        {renderSection('Morning Blocks (08:00 - 12:00)', Sunrise, grouped.morning, 'Morning')}
        {renderSection('Afternoon Blocks (12:00 - 17:00)', Sun, grouped.afternoon, 'Afternoon')}
        {renderSection('Evening Blocks (17:00 - 22:00)', Sunset, grouped.evening, 'Evening')}
      </div>

      {/* Add / Edit Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-slate-900 rounded-2xl border border-slate-800 shadow-2xl p-6 relative">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="font-display font-bold text-base text-slate-100">
                {editingItem ? 'Edit Study Block' : 'Schedule New Study Block'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Session Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Electrostatics Gauss Law Review"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject</label>
                  <select
                    value={formData.subjectId}
                    onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  >
                    {subjects.map((sub) => (
                      <option key={sub.id} value={sub.id}>{sub.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Topic Name</label>
                  <input
                    type="text"
                    required
                    value={formData.topicName}
                    onChange={(e) => setFormData({ ...formData, topicName: e.target.value })}
                    placeholder="e.g. Electric Flux"
                    className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Start Time</label>
                  <input
                    type="text"
                    required
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="10:30"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">End Time</label>
                  <input
                    type="text"
                    required
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    placeholder="11:15"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Time of Day</label>
                  <select
                    value={formData.timeOfDay}
                    onChange={(e) => setFormData({ ...formData, timeOfDay: e.target.value as any })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="MORNING">MORNING</option>
                    <option value="AFTERNOON">AFTERNOON</option>
                    <option value="EVENING">EVENING</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduleType })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="STUDY">STUDY</option>
                    <option value="REVISION">REVISION</option>
                    <option value="QUIZ">QUIZ</option>
                    <option value="BREAK">BREAK</option>
                    <option value="EXAM">EXAM</option>
                    <option value="OTHER">OTHER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as Priority })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Notes / Objectives</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Optional objectives or formula sheet reminders"
                  rows={2}
                  className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  {editingItem ? 'Save Changes' : 'Create Block'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
