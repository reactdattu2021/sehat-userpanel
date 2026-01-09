import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleCallback = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback } = useAuth();
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        const processGoogleCallback = async () => {
            try {
                // Extract parameters from URL
                const token = searchParams.get('token');
                const firstname = searchParams.get('firstname');
                const lastname = searchParams.get('lastname');
                const role = searchParams.get('role');
                const userId = searchParams.get('userId');

                // Validate required parameters
                if (!token || !userId) {
                    setStatus('error');
                    setTimeout(() => navigate('/'), 3000);
                    return;
                }

                // Process the Google login
                const userData = {
                    userId,
                    firstname: firstname || '',
                    lastname: lastname || '',
                    role: role || 'user',
                };

                // Call the context method to save auth data
                handleGoogleCallback(token, userData);

                setStatus('success');

                // Redirect to home after 1.5 seconds
                setTimeout(() => {
                    navigate('/');
                }, 1500);

            } catch (error) {
                console.error('Google callback error:', error);
                setStatus('error');
                setTimeout(() => navigate('/'), 3000);
            }
        };

        processGoogleCallback();
    }, [searchParams, navigate, handleGoogleCallback]);

    return (
        <div className='fixed inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center'>
            <div className='bg-white rounded-[24px] p-8 md:p-12 max-w-md w-full mx-4 shadow-2xl'>
                {status === 'processing' && (
                    <div className='text-center'>
                        <div className='inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[#34658C] mb-6'></div>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Completing Sign In...
                        </h2>
                        <p className='text-gray-600'>
                            Please wait while we set up your account
                        </p>
                    </div>
                )}

                {status === 'success' && (
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <svg className='w-8 h-8 text-green-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                            </svg>
                        </div>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Success!
                        </h2>
                        <p className='text-gray-600'>
                            You've been successfully signed in with Google
                        </p>
                    </div>
                )}

                {status === 'error' && (
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6'>
                            <svg className='w-8 h-8 text-red-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12'></path>
                            </svg>
                        </div>
                        <h2 className='text-2xl font-semibold text-gray-800 mb-2'>
                            Authentication Failed
                        </h2>
                        <p className='text-gray-600'>
                            Something went wrong. Redirecting to home...
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GoogleCallback;
