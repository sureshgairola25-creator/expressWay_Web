import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Replace this with your actual authentication logic
const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

export default function ProtectedRoute({ children }) {
  const userInfo = useSelector((state) => state?.userInfo?.userInfo)
  console.log("userInfo in ProtectedRoute => ",userInfo)

  if (Object.keys(userInfo).length == 0){
    return <Navigate to="/login" replace />
  }

  return children 
}