import React, { useState } from 'react'
import '../Css/profile.css'
import { User, LogOut,NotebookText,HandCoins ,BellRing ,Settings ,MessageCircleQuestion  } from 'lucide-react';
import Dashboard from './Dashboard';


const Profile = () => {
    const [showDropdown, setShowDropdown] = useState(false);
    const handleLogout = () => {
        try {
          axios.post('http://127.0.0.1:8000/logout/',
            {
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
            }
          )
          .then((res)=>{
            console.log(res.status)
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
          })
         
        } catch (error) {
          console.log(error)
        }
        navigate('/')
        
      };



  return (
    <div className='profilePage'>
        <nav className="navbar">
            <div className='logo'>ResumeBuilder</div>

            <div className="user-section">
                      <div className="user-icon" onClick={() => setShowDropdown(!showDropdown)}>
                        <User size={24} />
                      </div>
                      {showDropdown && (
                        <div className="dropdown-menu">
                          <button className="dropdown-item" onClick={handleLogout}>
                            <LogOut size={16} />
                            <span>Logout</span>
                          </button>
                        </div>
                      )}
            </div>
        
        </nav>

        <div className='all'>

            <div className='leftSideBar'>
                <div className='personalinfo'>
                
                <div className='pfp'>
                <User size={50} style={{background:'lightgray', borderRadius:'50px',padding:'10px'}} />
                <span><h1>Vaibhav raj</h1></span>
                </div>
                <div className='info'>

                <div className='allbutton'>
                <button> <NotebookText/>Dashboard</button>
                <button><User/> My profile</button>
                <button> <HandCoins/>Subscription</button>
                <button> <BellRing/>Notification</button>
                <button> <Settings/>setting</button>
                <button> <MessageCircleQuestion/>Help and Support</button>

                </div>
                </div>
                


                </div>
            </div>
            <div className='rightContent'>
                      <Dashboard/>
            </div>

        </div>
    </div>
  )
}

export default Profile
