import React, { useState } from 'react';
import { useJarvis } from '../state/JarvisContext';
import { Note } from '../types';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Save, 
  Tag, 
  BookOpen
} from 'lucide-react';

export const NotesPage: React.FC = () => {
  const { notes, subjects, addNote, updateNote, deleteNote } = useJarvis();
  const [selectedNoteId, setSelectedNoteId] = useState<string>(notes[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);

  const [editTitle, setEditTitle] = useState('');
  const [editSubjectId, setEditSubjectId] = useState('sub-phys');
  const [editTopic, setEditTopic] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState('');

  const filteredNotes = notes.filter((n: Note) => {
    if (subjectFilter !== 'ALL' && n.subjectId !== subjectFilter) return false;
    if (searchQuery && !n.title.toLowerCase().includes(searchQuery.toLowerCase()) && !n.content.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const activeNote = notes.find((n: Note) => n.id === selectedNoteId) || filteredNotes[0] || notes[0];

  const handleStartCreate = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setEditTitle('');
    setEditSubjectId('sub-phys');
    setEditTopic('');
    setEditContent('# New Study Note\n\n- Key points:\n- Equations:\n- Exam tips:');
    setEditTags('Physics, Formulas');
  };

  const handleStartEdit = (note: Note) => {
    setIsCreatingNew(false);
    setIsEditing(true);
    setEditTitle(note.title);
    setEditSubjectId(note.subjectId);
    setEditTopic(note.topicName);
    setEditContent(note.content);
    setEditTags(note.tags.join(', '));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) return;

    const tagsArray = editTags.split(',').map((t) => t.trim()).filter(Boolean);

    if (isCreatingNew) {
      addNote({
        title: editTitle.trim(),
        subjectId: editSubjectId,
        topicName: editTopic.trim() || 'General Study',
        content: editContent,
        tags: tagsArray,
      });
      setIsCreatingNew(false);
    } else if (activeNote) {
      updateNote(activeNote.id, {
        title: editTitle.trim(),
        subjectId: editSubjectId,
        topicName: editTopic.trim() || activeNote.topicName,
        content: editContent,
        tags: tagsArray,
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-100">Study Notes & Cheat Sheets</h1>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Markdown-enabled revision notes, formula repositories, and theorem proofs
          </p>
        </div>

        <button
          onClick={handleStartCreate}
          className="px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-teal-500/20 flex items-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left Column: Note list & search */}
        <div className="md:col-span-4 space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes..."
                className="w-full pl-8 pr-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none focus:border-teal-500"
              />
            </div>

            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Subjects</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredNotes.length === 0 ? (
              <div className="p-6 text-center rounded-2xl bg-slate-900/30 border border-dashed border-slate-800 text-xs font-mono text-slate-500">
                No study notes found.
              </div>
            ) : (
              filteredNotes.map((note) => {
                const sub = subjects.find((s) => s.id === note.subjectId);
                const isSelected = activeNote?.id === note.id && !isCreatingNew;

                return (
                  <button
                    key={note.id}
                    onClick={() => {
                      setSelectedNoteId(note.id);
                      setIsEditing(false);
                      setIsCreatingNew(false);
                    }}
                    className={`w-full p-3.5 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-teal-500/10 border-teal-500/50 shadow-md shadow-teal-500/10'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-full border"
                        style={{
                          color: sub?.color || '#2dd4bf',
                          backgroundColor: `${sub?.color || '#2dd4bf'}15`,
                          borderColor: `${sub?.color || '#2dd4bf'}40`,
                        }}
                      >
                        {sub?.name || 'Subject'}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {new Date(note.updatedAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h4 className="font-semibold text-slate-100 text-xs line-clamp-1">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 line-clamp-1">
                      Topic: {note.topicName}
                    </p>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Note Content Viewer / Editor */}
        <div className="md:col-span-8 p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl min-h-[500px]">
          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="font-display font-bold text-sm text-slate-100">
                  {isCreatingNew ? 'Create New Study Note' : 'Edit Note'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      setIsCreatingNew(false);
                    }}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Save Note</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="e.g. Coulomb Law & Potential"
                  className="w-full px-3 py-2 text-sm bg-slate-950 border border-slate-700 rounded-xl text-slate-100 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Subject</label>
                  <select
                    value={editSubjectId}
                    onChange={(e) => setEditSubjectId(e.target.value)}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  >
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Topic</label>
                  <input
                    type="text"
                    value={editTopic}
                    onChange={(e) => setEditTopic(e.target.value)}
                    placeholder="Topic name"
                    className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Content (Markdown / LaTeX supported)</label>
                <textarea
                  rows={14}
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-3 font-mono text-xs bg-slate-950 border border-slate-700 rounded-xl text-slate-200 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={editTags}
                  onChange={(e) => setEditTags(e.target.value)}
                  placeholder="Physics, Formulas, Gauss-Law"
                  className="w-full px-3 py-1.5 text-xs font-mono bg-slate-950 border border-slate-700 rounded-xl text-slate-300 focus:outline-none"
                />
              </div>
            </form>
          ) : activeNote ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-bold">
                      {subjects.find((s) => s.id === activeNote.subjectId)?.name || 'Subject'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Topic: {activeNote.topicName}
                    </span>
                  </div>
                  <h2 className="text-xl font-display font-bold text-slate-100">
                    {activeNote.title}
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleStartEdit(activeNote)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs flex items-center gap-1.5 transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => deleteNote(activeNote.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="prose prose-invert max-w-none text-xs md:text-sm font-mono leading-relaxed bg-slate-950/60 p-5 rounded-2xl border border-slate-850 whitespace-pre-wrap">
                {activeNote.content}
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {activeNote.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 text-[10px] font-mono flex items-center gap-1"
                  >
                    <Tag className="w-2.5 h-2.5 text-teal-400" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center text-slate-500 font-mono text-xs">
              <BookOpen className="w-8 h-8 mb-2 text-slate-600" />
              <span>Select a note from the left or create a new one.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
