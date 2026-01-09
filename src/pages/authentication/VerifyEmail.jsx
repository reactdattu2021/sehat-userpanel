// src/pages/authentication/VerifyEmail.jsx
import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { VerifyEmailApi } from '../../apis/authapis';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    verifyEmail();
  }, []);

  const verifyEmail = async () => {
    try {
      const email = searchParams.get('email');
      const encryptedID = searchParams.get('verificationKey'); // Backend sends 'verificationKey'

      if (!email || !encryptedID) {
        setStatus('error');
        setMessage('Invalid verification link. Please check your email for the correct link.');
        return;
      }

      const response = await VerifyEmailApi(email, encryptedID);

      // Handle successful verification (status 200)
      if (response.data.success) {
        setStatus('success');
        setMessage(response.data.message || 'Account verified successfully! You can now login.');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setStatus('error');
        setMessage(response.data.message || 'Verification failed. Please try again.');
      }
    } catch (error) {
      const statusCode = error.response?.status;
      const errorMessage = error.response?.data?.message;

      // Handle different error status codes
      if (statusCode === 410) {
        // Link expired - new link sent
        setStatus('warning');
        setMessage(errorMessage || 'Verification link expired. A new verification link has been sent to your email.');
      } else if (statusCode === 401) {
        // Account already active or blocked
        setStatus('info');
        setMessage(errorMessage || 'Account status issue. Please contact support.');
      } else if (statusCode === 404) {
        // User not found
        setStatus('error');
        setMessage('User not found. Please sign up first.');
      } else if (statusCode === 409) {
        // Unable to activate
        setStatus('error');
        setMessage(errorMessage || 'Unable to activate account. Please try again.');
      } else {
        // Generic error
        setStatus('error');
        setMessage(errorMessage || 'Verification failed. Please try again or contact support.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#34658C] via-[#4A7FA7] to-[#5B9AC2] p-4">
      <div className="bg-white p-8 md:p-12 rounded-[24px] shadow-2xl max-w-md w-full text-center transform transition-all duration-500">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#34658C] mb-2">SehatMitra</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-[#34658C] to-[#A2CD48] mx-auto rounded-full"></div>
        </div>

        {/* Verifying State */}
        {status === 'verifying' && (
          <div className="animate-fade-in">
            <div className="relative mx-auto mb-6 w-20 h-20">
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-[#34658C] border-r-[#A2CD48] border-b-[#34658C] border-l-transparent"></div>
              <div className="absolute inset-2 animate-spin-slow rounded-full border-4 border-t-transparent border-r-[#A2CD48] border-b-transparent border-l-[#34658C]"></div>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-gray-800">Verifying Email</h2>
            <p className="text-gray-600 text-sm md:text-base">{message}</p>
            <div className="mt-6 flex justify-center gap-1">
              <div className="w-2 h-2 bg-[#34658C] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-[#34658C] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-[#34658C] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}

        {/* Success State */}
        {status === 'success' && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-green-600">Success!</h2>
            <p className="text-gray-700 mb-2 text-sm md:text-base font-medium">{message}</p>
            <p className="text-sm text-gray-500 mt-4 flex items-center justify-center gap-2">
              <span className="animate-pulse">Redirecting to home...</span>
              <span className="text-[#34658C]">3s</span>
            </p>
          </div>
        )}

        {/* Error State */}
        {status === 'error' && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-red-600">Verification Failed</h2>
            <p className="text-gray-700 mb-6 text-sm md:text-base">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#34658C] text-white px-8 py-3 rounded-[12px] font-semibold hover:bg-[#2a5270] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Warning State (Expired Link) */}
        {status === 'warning' && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-12 h-12 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-yellow-600">Link Expired</h2>
            <p className="text-gray-700 mb-2 text-sm md:text-base font-medium">{message}</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 my-4 rounded">
              <p className="text-sm text-yellow-800">
                📧 Please check your email for the new verification link.
              </p>
            </div>
            <button
              onClick={() => navigate('/')}
              className="bg-[#34658C] text-white px-8 py-3 rounded-[12px] font-semibold hover:bg-[#2a5270] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Info State (Already Active/Blocked) */}
        {status === 'info' && (
          <div className="animate-fade-in">
            <div className="mx-auto mb-6 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-scale-in">
              <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-3 text-blue-600">Account Status</h2>
            <p className="text-gray-700 mb-6 text-sm md:text-base">{message}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#34658C] text-white px-8 py-3 rounded-[12px] font-semibold hover:bg-[#2a5270] transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Go to Home
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Need help? Contact us at{' '}
            <a href="mailto:supportsehatmitra@gmail.com" className="text-[#34658C] hover:underline font-medium">
              supportsehatmitra@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default VerifyEmail;