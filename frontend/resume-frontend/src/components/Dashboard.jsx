import React, { useState } from 'react'
import { Trash2,Pencil ,Eye } from 'lucide-react';

const Dashboard = () => {

  const [title, setTitel] = useState([{'title':'h1'},{'title':'h1'},{'title':'h1'},{'title':'h1'},{'title':'h1'},{'title':'h1'},])



  return (
    <div>
      <div className='DashBar'>

            <div className='dash-header'>

                <span><h1>Dashboard</h1></span>
                <span><button>New Resume</button></span>
            </div>

            <div className='dash-cards'>
                <p>Resume Created</p>
                <p>Downloads</p>
            </div>

            <div className='yourResume'>

                <div>
                    <h1>Your Resumes</h1>
                    <p>Manage and edit your created resume</p>
                </div>
                <div>

                {/* why use index if just title can do work. becuse if title did't exist index can still render the our data */}
                {title.map((title, index)=>( 

                  <div className='resumecards' key={index}>
                  <h4>Software Devloper Resume</h4>
                  <span>
                  <button><Eye size={20}/>View</button>
                  <button> <Pencil size={20}/>edit</button>
                  <button><Trash2 size={20}/></button>
                  </span>
                  </div>
                ))}
                    
                </div>

            </div>


      </div>
    </div>
  )
}

export default Dashboard
