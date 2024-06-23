import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <div className="bg-blue-400 p-2 flex flex-row">
    <div className="w-1/2">
        <h1 className="text-white font-bold text-xl">NotePad</h1>
    </div>
    <div className="w-1/2 flex flex-row justify-end">
        <Link to="/" className="text-white font-semibold mx-2">Home</Link>
        <Link to="/addnotes" className="text-white font-semibold mx-2">Add Notes</Link>
        <Link to="/flashcards" className="text-white font-semibold mx-2">FlashCards</Link>
        <Link to="/addflashcards" className="text-white font-semibold mx-2">Add FlashCards</Link>
    </div>
    </div>
  )
}
