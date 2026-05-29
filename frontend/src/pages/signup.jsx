import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("employee");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!name || !email || !password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password, role }
      );

      if (response.data.success) {
        // Signup successful, redirect to login
        navigate("/login", { replace: true });
      }
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.error || "Signup failed");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-screen items-center justify-center bg-gradient-to-br from-purple-600 to-indigo-500 font-sans antialiased">
      <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-2xl">
        <h2 className="mb-8 text-center text-3xl font-bold tracking-tight text-gray-800">
          Create Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-lg bg-red-100 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Name Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="name" className="text-sm font-semibold text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-purple-500"
              required
            />
          </div>

          {/* Email Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-semibold text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-purple-500"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-purple-500"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div className="flex flex-col gap-2">
            <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-600">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-purple-500"
              required
            />
          </div>

          {/* Role Selection */}
          <div className="flex flex-col gap-2">
            <label htmlFor="role" className="text-sm font-semibold text-gray-600">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-lg border-2 border-gray-200 p-3 text-base text-gray-800 outline-none transition-colors focus:border-purple-500 bg-white"
            >
              <option value="employee">Employee</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 p-3 text-base font-bold text-white transition-colors hover:bg-purple-700 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Login Link */}
        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-purple-600 hover:text-purple-700">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
