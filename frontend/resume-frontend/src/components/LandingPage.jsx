import React, { useRef, useState } from 'react'
import resume from '../svg/resume.svg'
import { motion } from "framer-motion"
// import Navbar from '../comp/Navbar'
import GradientText from '../comp/GradientText'
import '../Css/LandingPage.css'
import FeatureCard from '../comp/FeatureCard'
import StepCard from '../comp/StepCard'
import { MessageSquare, CheckCircle, FileText, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom'
import Footer from '../comp/Footer'

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const featureRef = useRef(null)
  const howItsWorkRef = useRef(null)
  const navigate = useNavigate()

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const features = [
    {
      title: "AI-Powered Suggestions",
      description: "Get personalized content suggestions based on your experience and the job description.",
      icon: <MessageSquare className="feature-icon" />,
      color: "purple",
    },
    {
      title: "ATS Optimization",
      description: "Ensure your resume passes through Applicant Tracking Systems with our smart keyword analysis.",
      icon: <CheckCircle className="feature-icon" />,
      color: "teal",
    },
    {
      title: "Beautiful Templates",
      description: "Choose from dozens of professionally designed templates that stand out.",
      icon: <FileText className="feature-icon" />,
      color: "orange",
    },
    {
      title: "Easy Export",
      description: "Download your resume in multiple formats including PDF, DOCX, and more.",
      icon: <Download className="feature-icon" />,
      color: "pink",
    },
  ]

  const steps = [
    {
      number: 1,
      title: "Enter Your Information",
      description: "Fill in your basic details, experience, and skills.",
      color: "purple",
    },
    {
      number: 2,
      title: "AI Enhancement",
      description: "Our AI analyzes and suggests improvements to your content.",
      color: "teal",
    },
    {
      number: 3,
      title: "Choose a Template",
      description: "Select from our beautiful, ATS-friendly templates.",
      color: "orange",
    },
    {
      number: 4,
      title: "Download & Apply",
      description: "Export your resume and start applying with confidence.",
      color: "pink",
    },
  ]

  React.useEffect(() => {
    const handleScroll = () => {
      const nav = document.querySelector('.nav');
      if (window.scrollY > 10) {
        nav.classList.add('blurred');
      } else {
        nav.classList.remove('blurred');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className='main'>

      <div className="nav">
        <div className="hamburger" onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>

        <div className={`leftbutton ${isMenuOpen ? 'active' : ''}`}>
          <motion.button
            style={{ borderRadius: "10px", padding: "5px 10px" }}
            whileHover={{ boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)" }}
            onClick={() => scrollToSection(featureRef)}
          >
            Features
          </motion.button>

          <motion.button
            style={{ borderRadius: "10px", padding: "5px 10px" }}
            whileHover={{ boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)" }}
            onClick={() => scrollToSection(howItsWorkRef)}
          >
            How It Works
          </motion.button>

          <motion.button
            style={{ borderRadius: "10px", padding: "5px 10px" }}
            whileHover={{ boxShadow: "0px 3px 8px rgba(0, 0, 0, 0.24)" }}
          >
            Testimonials
          </motion.button>
        </div>

        <div className={`rightbutton ${isMenuOpen ? 'active' : ''}`}>
          <button className='signin' onClick={()=>navigate('/load')}>Sign In</button>
          <button className='get-start'>Get Started for free</button>
        </div>
      </div>

      <div className="core">
        <div className="leftdiv">
          <motion.div className='leftdivchild'
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: 1, y: 5 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            <h1>
              Build Your <br />
              Perfect Resume <br />
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
            <p>Get personalized suggestions, ATS optimization, and <br />stunning templates in seconds.</p>
          </motion.div>
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

      <div className="container" ref={featureRef}>
        <h2 className="section-title">Powerful Features</h2>
        <p className="section-subtitle">Everything you need to create a professional, ATS-optimized resume</p>

        <div className="feature-card">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              index={index}
              color={feature.color}
            />
          ))}
        </div>
      </div>

      <div className="step-container" ref={howItsWorkRef}>
        <div className="containers">
          <div className="step-titles">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Four simple steps to your perfect resume</p>
          </div>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <StepCard
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                index={index}
                color={step.color}
              />
            ))}
          </div>
        </div>
      </div>
      <div>
      <Footer/>
      </div>
    
    </div>
  )
}

export default LandingPage