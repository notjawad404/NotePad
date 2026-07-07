import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NotePad from './components/NotePad'
import AddNotes from './components/AddNotes'
import AddFlashCards from './components/FlashCards/AddFlashCards'
import FlashCards from './components/FlashCards/FlashCards'
import NoteDetail from './components/NoteDetail'
import Profile from './components/Profile'
import Login from './components/Auth/Login'
import SignUp from './components/Auth/SignUp'
import ProtectedRoute from './components/Auth/ProtectedRoute'


function App() {

  return (

   <div className="">
    <Router>
      <Routes>

        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />

        <Route path="/" element={<ProtectedRoute><NotePad/></ProtectedRoute>} />
        <Route path="/addnotes" element={<ProtectedRoute><AddNotes/></ProtectedRoute>} />
        <Route path="/note/:id" element={<ProtectedRoute><NoteDetail/></ProtectedRoute>} />
        <Route path="/addflashcards" element={<ProtectedRoute><AddFlashCards/></ProtectedRoute>} />
        <Route path="/flashcards" element={<ProtectedRoute><FlashCards/></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile/></ProtectedRoute>} />

      </Routes>
    </Router>
   </div>

  )
}

export default App
