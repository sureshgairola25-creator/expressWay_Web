import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router-dom'

// Replace this with your actual authentication logic
const isAuthenticated = () => {
  return !!localStorage.getItem('token')
}

// export default function ProtectedRoute({ children }) {
//   const userInfo = useSelector((state) => state?.userInfo?.userInfo)
//   console.log("userInfo in ProtectedRoute => ",userInfo)

//   if (Object.keys(userInfo).length == 0){
//     return <Navigate to="/login" replace />
//   }

//   return children 
// }


export default function ProtectedRoute({ children }) {
  const localStorageUserInfo = JSON.parse(localStorage.getItem("userInfo"));
  const token = localStorage.getItem("token");

  // Auth condition — accept if token exists OR userInfo with valid ID and role=user
  const isAuthenticated =
    (token && token !== "null") ||
    (localStorageUserInfo?.id && localStorageUserInfo?.role === "user");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

