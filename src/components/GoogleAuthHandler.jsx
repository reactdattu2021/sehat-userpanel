import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * GoogleAuthHandler - Handles Google OAuth callback parameters on any page
 * This component checks for Google OAuth parameters in the URL and processes them
 */
const GoogleAuthHandler = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const { handleGoogleCallback } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        // Check if URL contains Google OAuth callback parameters
        const token = searchParams.get('token');
        const userId = searchParams.get('userId');
        const firstname = searchParams.get('firstname');
        const lastname = searchParams.get('lastname');
       

        // If we have token and userId, it's a Google OAuth callback
        if (token && userId) {
            // console.log('🔐 Processing Google OAuth callback...');
            setIsProcessing(true);

            // Prepare user data
            const userData = {
                userId,
                firstname: firstname || '',
                lastname: lastname || '',
               
            };

            // Save authentication data
            handleGoogleCallback(token, userData);

            // console.log('✅ Google login successful!', userData);

            // Clean up URL parameters after a short delay
            setTimeout(() => {
                searchParams.delete('token');
                searchParams.delete('userId');
                searchParams.delete('firstname');
                searchParams.delete('lastname');
               

                // Update URL without the OAuth parameters
                setSearchParams(searchParams, { replace: true });
                setIsProcessing(false);
            }, 500);
        }
    }, [searchParams, setSearchParams, handleGoogleCallback]);

    return (
        <>
            {isProcessing && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-[9999] animate-fadeIn">
                    <p className="font-semibold">✓ Logged in successfully!</p>
                </div>
            )}
            {children}
        </>
    );
};

export default GoogleAuthHandler;
