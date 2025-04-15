import React, { useState } from 'react'
import '../Css/Navbar.css'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div>
      <div className="nav">
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`leftbutton ${isMenuOpen ? 'active' : ''}`}>
          <button>Features</button>
          <button>How It Works</button>
          <button>Testimonials</button>
        </div>

        <div className={`rightbutton ${isMenuOpen ? 'active' : ''}`}>
          <button className='signin'>Sign In</button>
          <button className='get-start'>Get Started for free</button>
        </div>
      </div>
    </div>
  )
}

export default Navbar