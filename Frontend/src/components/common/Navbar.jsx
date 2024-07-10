import { Link } from "react-router-dom"
import logo from '../../assets/notepadLogo.jpeg'

export default function Navbar() {
  return (
    <div className=" bg-transparent p-2 flex flex-row">
    <div className="w-1/2 flex flex-row">
        <img src={logo} alt="Logo" className="w-10 h-10 rounded-full"/>
        <h1 className="text-black font-bold text-xl py-1 px-5">NotePad</h1>
    </div>
    <div className="w-1/2 flex flex-row justify-end py-1">
        <Link to="/" className="text-black font-semibold mx-2 text-xl">Home</Link>
        <Link to="/addnotes" className="text-black font-semibold mx-2 text-xl">Add Notes</Link>
        <Link to="/flashcards" className="text-black font-semibold mx-2 text-xl">FlashCards</Link>
        <Link to="/addflashcards" className="text-black font-semibold mx-2 text-xl">Add FlashCards</Link>
    </div>
    </div>
  )
}
