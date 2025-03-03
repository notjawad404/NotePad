import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotes, deleteNote } from '../redux/noteSlice';
import { Link } from 'react-router-dom';
import Navbar from './common/Navbar';

const colorOptions = [
  { bgColor: 'bg-white', color: 'text-black' },
  { bgColor: 'bg-red-500', color: 'text-white' },
  { bgColor: 'bg-green-500', color: 'text-white' },
  { bgColor: 'bg-blue-500', color: 'text-white' },
  { bgColor: 'bg-yellow-500', color: 'text-black' },
];

export default function NotePad() {
  const dispatch = useDispatch();
  const notes = useSelector((state) => state.notes.notes);

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

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      <h1 className="text-center text-4xl font-bold py-6">Notepad</h1>

      <div className="max-w-4xl mx-auto px-4">
        <div className="flex gap-4 mb-6">
          <input
            type="text"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            placeholder="Search by name"
            className="flex-1 p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-200"
          />
          <input
            type="text"
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
            placeholder="Search by category"
            className="flex-1 p-3 bg-gray-700 rounded-lg placeholder-gray-400 text-gray-200"
          />
        </div>

        <div className="flex gap-4 mb-6">
          <button
            className="p-3 bg-gray-600 rounded-lg"
            onClick={() => setSelectedColor('')}
          >
            All
          </button>
          {colorOptions.map((option, index) => (
            <div
              key={index}
              className={`p-3 ${option.bgColor} rounded-lg cursor-pointer`}
              onClick={() => setSelectedColor(option.bgColor)}
            ></div>
          ))}
        </div>

        {filteredNotes.length === 0 ? (
          <p className="text-center text-gray-400">No notes available</p>
        ) : (
          filteredNotes.map((note) => (
            <div
              key={note._id}
              className={`${note.bgColor} ${note.color} p-4 rounded-lg mb-4`}
            >
              <h3 className="text-xl font-bold">{note.name}</h3>
              <p className="mb-4">{note.description.split('\n')[0]}</p>
              <div className="flex gap-4">
                <Link
                  to={`/note/${note._id}`}
                  className="text-blue-400 underline"
                >
                  Show More
                </Link>
                <button
                  className="bg-red-600 px-4 py-2 rounded-lg"
                  onClick={() => dispatch(deleteNote(note._id))}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
