import React, { useState } from "react";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // UI state
  const [error, setError]=useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password }
      );
      if(response.data.success){
        alert("successfully login")
      }
      
      // Typical next steps:
      // 1. Save token: localStorage.setItem('token', response.data.token);
      // 2. Redirect user: navigate('/dashboard');
      
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
            <label className="flex items-center gap-2 text-gray-600 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
              Remember me
            </label>
            <a href="#forgot" className="text-indigo-600 hover:text-purple-700 hover:underline transition-colors font-medium">
              Forgot Password?
            </a>
          </div>



          {/* Submit Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 p-3 text-base font-bold text-white transition-colors hover:bg-indigo-700 cursor-pointer"
          >
            Log In
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <a href="#signup" className="font-bold text-indigo-600 hover:underline">
            Sign up
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;