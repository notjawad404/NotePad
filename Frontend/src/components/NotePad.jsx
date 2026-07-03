import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '../redux/noteSlice';
import { Link } from 'react-router-dom';
import Navbar from './common/Navbar';
import Layout from './common/Layout';
import Spinner from './common/Spinner';
import EmptyState from './common/EmptyState';
import { SearchIcon, TrashIcon, PlusIcon, NoteIcon } from './common/Icons';
import { colorOptions } from './common/ColorPicker';

export default function NotePad() {
  const dispatch = useDispatch();
  const { notes, status } = useSelector((state) => state.notes);

  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [selectedColor, setSelectedColor] = useState('');

  useEffect(() => {
    dispatch(fetchNotes());
  }, [dispatch]);

  const filteredNotes = notes.filter(
    (note) =>
      note.name.toLowerCase().includes(searchName.toLowerCase()) &&
      note.type.toLowerCase().includes(searchCategory.toLowerCase()) &&
      (selectedColor ? note.bgColor === selectedColor : true)
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
              <div
                key={note._id}
                className={`${note.bgColor} ${note.color} p-5 rounded-xl flex flex-col justify-between border border-black/5 transition-transform hover:-translate-y-0.5`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold leading-snug">{note.name}</h3>
                    <button
                      className="opacity-50 hover:opacity-100 hover:text-red-400 transition-opacity shrink-0"
                      onClick={() => handleDelete(note._id, note.name)}
                      aria-label={`Delete ${note.name}`}
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <p className="text-sm opacity-70 line-clamp-3 mb-4">
                    {note.description.split('\n')[0]}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-black/20">
                    {note.type}
                  </span>
                  <Link to={`/note/${note._id}`} className="text-sm font-medium underline underline-offset-2 opacity-90 hover:opacity-100">
                    Show More
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
