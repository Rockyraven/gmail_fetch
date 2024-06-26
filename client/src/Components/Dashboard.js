import axios from 'axios';
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import MailListBox from './MailList';

const Dashboard = () => {

  const navigate = useNavigate();

  const getUser = async () => {
    try {
        const response = await axios.get("http://localhost:6005/login/sucess", { withCredentials: true });

        console.log("response",response)
    } catch (error) {
      navigate("*")
    }
}


useEffect(() => {
  getUser()
}, [])
  return (
    <div style={{textAlign:"center"}}>
        <MailListBox/>
      </div>
  )
}

export default Dashboard