import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NotePad from './components/NotePad'
import AddNotes from './components/AddNotes'
import AddFlashCards from './components/FlashCards/AddFlashCards'
import FlashCards from './components/FlashCards/FlashCards'
import NoteDetail from './components/NoteDetail'


function App() {

  return (
   
   <div className="">
    <Router>
      <Routes>
      
        <Route path="/" element={<NotePad/>} />
        <Route path="/addnotes" element={<AddNotes/>} />
        <Route path="/note/:id" element={<NoteDetail/>} />
        <Route path="/addflashcards" element={<AddFlashCards/>} />
        <Route path="/flashcards" element={<FlashCards/>} />

      </Routes>
    </Router>
   </div>
   
  )
}

export default App
