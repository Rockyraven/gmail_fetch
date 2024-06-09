import React from 'react'
import "./login.css"
import axios from 'axios'

const Login = () => {

    const loginwithgoogle = async () => {
        console.log("working");
        try {
            const res = await axios.get("http://localhost:6005/auth/google/");
            console(res);
            
        } catch (error) {
            console.log(error);
        }
        // window.open("http://localhost:6005/auth/google/", "_self")
    }
    return (
        <>
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center space-y-8">
                    <div>
                        <button onClick={loginwithgoogle} className="px-4 py-2 text-white bg-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-400">
                            Login with Google
                        </button>
                    </div>
                    <button className="px-4 py-2 text-white bg-transparent border border-white rounded focus:outline-none focus:ring-2 focus:ring-white">
                        Enter OpenAI API
                    </button>
                </div>
            </div>
        </>
    )
}

export default Login