import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '../redux/noteSlice';
import { fetchGroups } from '../redux/groupSlice';
import { Link } from 'react-router-dom';
import Navbar from './common/Navbar';
import Layout from './common/Layout';
import Spinner from './common/Spinner';
import EmptyState from './common/EmptyState';
import NoteCard from './common/NoteCard';
import { SearchIcon, PlusIcon, NoteIcon } from './common/Icons';
import { colorOptions } from './common/colorOptions';

export default function NotePad() {
  const dispatch = useDispatch();
  const { notes, status } = useSelector((state) => state.notes);
  const groups = useSelector((state) => state.groups.groups);
  const activeGroups = groups.filter((group) => !group.archived);
  const groupMap = Object.fromEntries(groups.map((group) => [group._id, group.name]));

  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');

  useEffect(() => {
    dispatch(fetchNotes());
    dispatch(fetchGroups());
  }, [dispatch]);

  const matchesGroup = (note) => {
    if (selectedGroup === 'all') return true;
    if (selectedGroup === 'ungrouped') return !note.groupId;
    return note.groupId === selectedGroup;
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchName.toLowerCase()) &&
      note.type.toLowerCase().includes(searchCategory.toLowerCase()) &&
      (selectedColor ? note.bgColor === selectedColor : true) &&
      matchesGroup(note)
  );

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete "${name}"? This can't be undone.`)) {
      dispatch(deleteNote(id));
    }
  };

  return (
    <Layout>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-semibold text-slate-100">My Notes</h1>
          <Link
            to="/addnotes"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            Add Note
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Search by name"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg placeholder-slate-500 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
            />
          </div>
          <div className="relative flex-1">
            <SearchIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              placeholder="Search by category"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-900 border border-slate-800 rounded-lg placeholder-slate-500 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/60 focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex items-center gap-3 mb-8">
          <span className="text-xs text-slate-500">Filter by color:</span>
          <button
            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
              selectedColor === ''
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-slate-800 text-slate-400 hover:border-slate-600'
            }`}
            onClick={() => setSelectedColor('')}
          >
            All
          </button>
          {colorOptions.map((option) => (
            <button
              key={option.bgColor}
              title={option.name}
              aria-label={`Filter by ${option.name}`}
              aria-pressed={selectedColor === option.bgColor}
              className={`w-6 h-6 rounded-full ${option.bgColor} border transition-transform hover:scale-110 ${
                selectedColor === option.bgColor ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-slate-950' : 'border-white/10'
              }`}
              onClick={() => setSelectedColor(option.bgColor)}
            />
          ))}
        </div>

        {activeGroups.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap mb-8">
            <span className="text-xs text-slate-500 mr-1">Group:</span>
            {[
              { key: 'all', label: 'All' },
              { key: 'ungrouped', label: 'Ungrouped' },
              ...activeGroups.map((group) => ({ key: group._id, label: group.name })),
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => setSelectedGroup(chip.key)}
                aria-pressed={selectedGroup === chip.key}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                  selectedGroup === chip.key
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-slate-800 text-slate-400 hover:border-slate-600'
                }`}
              >
                {chip.label}
              </button>
            ))}
            <Link
              to="/groups"
              className="text-xs font-medium text-slate-500 hover:text-slate-300 underline underline-offset-2 ml-1"
            >
              Manage
            </Link>
          </div>
        )}

        {status === 'loading' ? (
          <div className="flex justify-center py-20 text-slate-500">
            <Spinner className="w-6 h-6" />
          </div>
        ) : filteredNotes.length === 0 ? (
          <EmptyState
            icon={NoteIcon}
            title={notes.length === 0 ? 'No notes yet' : 'No notes match your filters'}
            description={
              notes.length === 0
                ? 'Create your first note to get started.'
                : 'Try adjusting your search or color filter.'
            }
            actionTo={notes.length === 0 ? '/addnotes' : undefined}
            actionLabel="Add Note"
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note._id}
                note={note}
                groupName={groupMap[note.groupId]}
                onDelete={(n) => handleDelete(n._id, n.name)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
