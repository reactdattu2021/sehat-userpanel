import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPasswordApi } from '../../apis/authapis';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validation
        if (!email) {
            setError('Email is required');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        try {
            setLoading(true);

            const response = await forgotPasswordApi(email);

            if (response.data.success) {
                setSuccess(response.data.message || 'A password reset link has been sent to your email. It will expire in 15 minutes.');
                setEmail(''); // Clear email field
            }
        } catch (error) {
            console.error('Forgot Password Error:', error);
            setError(error.response?.data?.message || 'Failed to send reset link. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f0f9ff] via-[#e0f2fe] to-[#f0fdf4] px-4 py-8">
            <div className="w-full max-w-md">
                {/* Card Container */}
                <div className="bg-white rounded-[24px] shadow-2xl p-8 md:p-10">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <h1 className="text-[28px] md:text-[32px] font-bold text-[#1a1a1a] mb-2">
                            Forgot Password?
                        </h1>
                        <p className="text-[14px] md:text-[16px] text-[#666666] leading-relaxed">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 text-green-700 px-4 py-4 rounded-[12px] shadow-sm">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-[14px] leading-relaxed">{success}</p>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 bg-gradient-to-r from-red-50 to-rose-50 border-l-4 border-red-500 text-red-700 px-4 py-4 rounded-[12px] shadow-sm">
                            <div className="flex items-start">
                                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                <p className="text-[14px] leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-[14px] font-semibold text-[#3D3D3D] mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border-[2px] border-[#e0e0e0] rounded-[12px] px-4 py-3 text-[14px] md:text-[16px] font-medium placeholder:text-[#999999] focus:border-[#A2CD48] focus:outline-none transition-colors"
                                disabled={loading}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#A2CD48] to-[#8fb83d] text-white text-[16px] md:text-[18px] font-bold px-6 py-4 rounded-[12px] hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </span>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>
                    </form>

                    {/* Back to Login Link */}
                    <div className="mt-8 text-center">
                        <Link
                            to="/login"
                            className="inline-flex items-center text-[14px] md:text-[16px] font-semibold text-[#A2CD48] hover:text-[#8fb83d] transition-colors"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Login
                        </Link>
                    </div>
                </div>

                {/* Additional Help Text */}
                <div className="mt-6 text-center">
                    <p className="text-[13px] text-[#666666]">
                        Didn't receive the email? Check your spam folder or{' '}
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email}
                            className="text-[#A2CD48] font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            resend
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
