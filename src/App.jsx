import React from 'react'
import { Routes, Route } from 'react-router-dom'
import MainRoute from './mainroutes/MainRoute'
import VerifyEmail from './pages/authentication/VerifyEmail'
import GoogleCallback from './pages/authentication/GoogleCallback'
import GoogleAuthHandler from './components/GoogleAuthHandler'
import ForgotPassword from './pages/authentication/ForgotPassword'
import ResetPassword from './pages/authentication/ResetPassword'

const App = () => {
  return (
    <GoogleAuthHandler>
      <Routes>
        {/* Standalone routes - No Header/Footer */}
        <Route path="/verify" element={<VerifyEmail />} />
        <Route path="/auth/google/callback" element={<GoogleCallback />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* All other routes with Header/Footer */}
        <Route path="/*" element={<MainRoute />} />
      </Routes>
    </GoogleAuthHandler>
  )
}

export default App
