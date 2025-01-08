import { Link } from "react-router-dom";
import logo from '../../assets/notepadLogo.jpeg';

export default function Navbar() {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-4 flex flex-wrap items-center">
      <div className="flex items-center w-full md:w-1/2">
        <img src={logo} alt="Logo" className="w-12 h-12 rounded-full shadow-md" />
        <h1 className="text-white font-bold text-2xl px-4 tracking-wide">
          NotePad
        </h1>
      </div>
      <div className="flex justify-center md:justify-end w-full md:w-1/2 space-x-6 mt-2 md:mt-0">
        <Link
          to="/"
          className="text-white font-semibold text-lg hover:text-gray-200 transition duration-300"
        >
          Home
        </Link>
        <Link
          to="/addnotes"
          className="text-white font-semibold text-lg hover:text-gray-200 transition duration-300"
        >
          Add Notes
        </Link>
        <Link
          to="/flashcards"
          className="text-white font-semibold text-lg hover:text-gray-200 transition duration-300"
        >
          FlashCards
        </Link>
        <Link
          to="/addflashcards"
          className="text-white font-semibold text-lg hover:text-gray-200 transition duration-300"
        >
          Add FlashCards
        </Link>
      </div>
    </div>
  );
}
