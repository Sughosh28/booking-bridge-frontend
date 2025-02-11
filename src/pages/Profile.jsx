import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { FiMail, FiLock } from 'react-icons/fi'
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
import { useNavigate } from 'react-router-dom'

export const Profile = () => {
  const [newEmail, setNewEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('') // 'success' or 'error'
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()
  
  const token = useSelector((state) => state.auth.token)

  const handleSendOtp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:8089/api/users/send-otp-to-new-mail', 
        { email: newEmail },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if(response.status === 200) {
      setMessage('OTP sent successfully! Check your email')
      setMessageType('success')
      setShowOtpInput(true)
    }
    } catch (error) {
      setMessage(error.response?.data || 'Error sending OTP')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateEmail = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await axios.put('http://localhost:8089/api/users/updateEmail',
        { otp: otp },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      if(response.status === 200) {
      setMessage('Email updated successfully!')
      setTimeout(() => {
        setMessage('')
      }, 3000)
      navigate("/home")
      setMessageType('success')
      setShowOtpInput(false)
      setNewEmail('')
      setOtp('')
    }
    } catch (error) {
      setMessage(error.response?.data || 'Error updating email')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 transform hover:scale-105 transition-transform duration-300">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 border-b pb-4">Update to New Email</h2>

        
        {message && (
          <div className={`mb-4 p-4 rounded-lg flex items-center justify-center font-medium ${
            messageType === 'success' 
              ? 'bg-green-100 text-green-700 border border-green-400'
              : 'bg-red-100 text-red-700 border border-red-400'
          }`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">New Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                className="pl-10 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                placeholder="Enter your new email"
                required
              />
            </div>
          </div>
          
          {!showOtpInput && (
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : null}
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </button>
          )}
        </form>

        {showOtpInput && (
          <form onSubmit={handleUpdateEmail} className="mt-6 space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Enter OTP</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="pl-10 w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  placeholder="Enter OTP received in email"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 rounded-lg text-white bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200 font-medium"
            >
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
              ) : null}
              {isLoading ? 'Updating...' : 'Update Email'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
