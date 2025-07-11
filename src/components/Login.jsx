import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";
import { login } from "../states/Slice";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("https://api.srss.live/loginUser", {
        username,
        password,
      });

      if (response.status === 200) {
        const { token, role, message } = response.data;
        localStorage.setItem("token", token);
        localStorage.setItem("role", role);
        dispatch(
          login({
            token: token,
            role: role,
            isAuthenticated: true,
          })
        );
        setMessage(message);

        if (role === "ROLE_ORGANIZER") {
          navigate("/dashboard");
        } else {
          navigate("/home");
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data || "Login failed";
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {loading ? (
                  <svg
                    className="animate-spin h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Sign in"
                )}
              </button>
            </div>
          </form>

          {message && (
            <div
              className={`mt-3 text-center text-sm font-medium ${
                message.includes("Successful")
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <Link
                to="/register"
                className="font-medium text-indigo-600 hover:text-indigo-500 ml-1"
              >
                Register here
              </Link>
            </p>
          </div>

          <div className="mt-8 bg-yellow-50 border-2 border-dashed border-orange-400 rounded-xl p-4 shadow-md flex flex-col items-center">
            <h3 className="text-lg font-bold text-orange-600 mb-2 flex items-center">
              <span className="mr-2">🔓</span> Demo Account Available
            </h3>
            <div className="w-full text-left space-y-1 mb-2">
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-medium text-gray-700">Username:</span>
                <span className="text-orange-700 font-mono break-all">demo_user</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                <span className="font-medium text-gray-700">Password:</span>
                <span className="text-orange-700 font-mono break-all">demo_user</span>
              </div>
            </div>
            <p className="text-xs text-red-500 text-center">
              Use these credentials to explore the app. No sign-up required.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;