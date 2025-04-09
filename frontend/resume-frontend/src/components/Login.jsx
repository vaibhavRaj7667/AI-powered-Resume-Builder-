import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {

    const [islogin, setIsLogin]= useState(false)
    const [credentials, setcredentials] = useState({"username":'',"password":''})
    const navigate = useNavigate()

  

    const HandelLogin = async()=>{
        try {
            const response = await axios.post('http://127.0.0.1:8000/api/token/',{
                username:credentials.username,
                password: credentials.password
            })
            localStorage.setItem("access_token", response.data.access)
            localStorage.setItem("refresh_token", response.data.refresh)
            console.log("Login successful:", response.data);
            setcredentials({username:'',password:''})
            
            if(localStorage.getItem("access_token")){
              navigate('/home')
            }
            else{
              console.log("login view not working")
            }

            
        } catch (error) {
            console.log(error)
            
        }
        
    }

 


  return (
    <div>
      <h1>this is login page </h1>
        <div className='login'>
            <input type="text" placeholder='username' value={credentials.username} onChange={(e)=>setcredentials({...credentials , username: e.target.value})}/>

            <input type="password" placeholder='password' value={credentials.password} onChange={(e)=>setcredentials({...credentials , password: e.target.value})}/>

            <button onClick={HandelLogin}>Login</button>

        </div>

    </div>
  )
}

export default Login
