import React, { useState } from 'react'
import resume from '../svg/resume.svg'
// import Navbar from '../comp/Navbar'
import GradientText from '../comp/GradientText'
import '../Css/LandingPage.css'
const LandingPage = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }


  return (
    <div className='main'>

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

      <div className="core">

              <div className="leftdiv">
                  <div className='leftdivchild'>
                  <h1>
                    Build Your <br/> 
                    Perfect Resume <br/> 
                    With{" "}
                    <GradientText
                      colors={["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"]}
                      animationSpeed={7}
                      showBorder={false}
                      className="custom"
                    >
                      Ai
                    </GradientText>
                  </h1>
                    <p>Get personalized suggestions, ATS optimization, and <br/>stunning templates in seconds.</p>
                  </div>
              </div>
              <div className="rightdiv">

                <div className="bro">
               
                <div className="lol">
                    
                    <div className="pinks"></div>
                    <img src={resume} className='resume' alt="" />
                    <div className="blue"></div>
                </div>

          </div>
        </div>

      </div>
    </div>
  )
}

export default LandingPage
