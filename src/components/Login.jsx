import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import { login } from '../states/Slice'

const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post("http://localhost:8089/loginUser", {
                username,
                password
            });
            
            if(response.status === 200) {
                const { token, role, message } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                dispatch(login({
                    token: token,
                    role: role,
                    isAuthenticated: true
                }));
                setMessage(message);
                
                if(role === 'ROLE_ORGANIZER') {
                    navigate('/dashboard');
                } else {
                    navigate('/home');
                }
            }
        } catch(error) {
            const errorMessage = error.response?.data || 'Login failed';
            setMessage(errorMessage);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-gray-50 flex flex-col justify-center py-6 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h2 className="text-center text-2xl font-bold text-gray-900 mb-4">
                    Sign in to your account
                </h2>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-4 px-4 shadow sm:rounded-lg sm:px-8">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </form>

                    {message && (
                        <div className={`mt-3 text-center text-sm font-medium ${
                            message.includes('Successful') ? 'text-green-600' : 'text-red-600'
                        }`}>
                            {message}
                        </div>
                    )}

                    <p className="mt-4 text-center text-sm text-gray-600">
                        Don't have an account?{' '}
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Register here
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login
