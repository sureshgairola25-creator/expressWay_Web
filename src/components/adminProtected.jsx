// import React from 'react'
// import { useSelector } from 'react-redux'
// import { Navigate } from 'react-router-dom'

// // Replace this with your actual authentication logic
// const isAuthenticated = () => {
//   return !!localStorage.getItem('token')
// }

// export default function AdminProtected({ children }) {
//   const userInfo = useSelector((state) => state.userInfo.userInfo)
//   console.log("insite the AdminProtected userInfo => ",userInfo)
// console.log("insite the AdminProtected children => ",children);

//   if (userInfo?.role === 'admin'){
//     return children 
//   }
//   return <Navigate to="/" replace />
// }

import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const getUserInfo = () => {
  try {
    return JSON.parse(localStorage.getItem('userInfo'));
  } catch {
    return null;
  }
};

export default function AdminProtected({ children }) {
  const userInfoFromRedux = useSelector((state) => state.userInfo.userInfo);
  const userInfo = userInfoFromRedux && Object.keys(userInfoFromRedux).length > 0
    ? userInfoFromRedux
    : getUserInfo();

  console.log("AdminProtected userInfo => ", userInfo);

  if (userInfo?.role === 'admin') {
    return children;
  }

  return <Navigate to="/" replace />;
}

