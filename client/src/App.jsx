
import './App.css'
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from './pages/login';
import SignUp from './pages/singup';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LeadPage from './components/LeadPage';

function App() {
  

  return (
  
    <Router>
       <Routes>
        <Route path="/login" element={<Login/>}/>
        <Route path="/signin" element={<SignUp/>}/>
        <Route path="/Lead" element={<LeadPage/>}/>
       </Routes>
       <ToastContainer position="top-right" autoClose={3000} />

    </Router>
  )
}

export default App
