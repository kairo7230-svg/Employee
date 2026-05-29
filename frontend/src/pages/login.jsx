import React, { useState } from "react";
import axios from "axios";
import {useAuth} from "../context/authContext.js"
import { useNavigate, Link } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]=useState(null)
  const {login} = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      if(response.data.success){
       login(response.data.user)
       localStorage.setItem("token",response.data.token);
       if(response.data.user.role==="admin"){
       navigate("/admin-dashboard")
       }else{
        navigate("/emp-dashboard")
       }
      }
      
    } catch (error) {
     if(error.response && !error.response.data.success){
      setError(error.response.data.error)
     }else{
      setError("server error")
     }
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-indigo-500 to-purple-700 font-sans antialiased">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-800">
          Welcome Back
        </h2>

        {/* 1. Wired handleSubmit to onSubmit */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Email Input */}
          <div className="flex flex-col gap-2">
            {error&&<p className="text-red-500">{error}</p>}
            <label htmlFor="email" className="text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              /* 2. Tied value and onChange to email state */
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-indigo-500"
              required
            />
          </div>

          {/* Password Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-sm font-semibold text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              /* 3. Tied value and onChange to password state */
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-indigo-500"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between text-sm">
            
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 p-3 text-base font-bold text-white transition-colors hover:bg-indigo-700 cursor-pointer"
          >
            Log In
          </button>
        </form>


        {/* Signup Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;