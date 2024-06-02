import './App.css'
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import NotePad from './components/NotePad'
import AddNotes from './components/AddNotes'


function App() {

  return (
   
   <div className="">
    <Router>
      <Routes>
        <Route path="/" element={<NotePad/>} />
        <Route path="/addnotes" element={<AddNotes/>} />
      </Routes>
    </Router>
   </div>
   
  )
}

export default App
