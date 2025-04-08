import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Home from './components/Home'
import Login from './components/Login'
import Resume_analyzer from './components/Resume_analyzer'
import { Routes, Route } from 'react-router-dom';

function App() {
  

  return (
   <>
    
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path='/analyze' element={<Resume_analyzer/>}/>
        
      </Routes>

   </>
  )
}

export default App
