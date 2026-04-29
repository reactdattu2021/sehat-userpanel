import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoClose } from "react-icons/io5";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../../context/AuthContext';

const Login = ({ setSignInOpen, setSignUpOpen }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(email, password);

        if (result.success) {
            setSignInOpen(false);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleGoogleLogin = () => {
        // console.log('Google login clicked');
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.5:5002/Sehatmitra';
        window.location.href = `${baseURL}/users/google`;
    };

    const handleForgotPassword = () => {
        setSignInOpen(false); // Close the login modal
        navigate('/forgot-password'); // Navigate to forgot password page
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-y-auto py-4'>
            <div className='bg-white max-w-[300px] md:max-w-[560px] lg:max-w-[800px] rounded-[24px] my-auto'>
                <div className='relative'>
                    <IoClose
                        className='absolute w-[24px] h-[24px] top-4 right-4 cursor-pointer z-10'
                        onClick={() => setSignInOpen(false)}
                    />
                </div>
                <div className='grid grid-cols-12 lg:grid-cols-12'>
                    <div className='hidden lg:block lg:col-span-3'>
                        <img
                            src="/assets/signInImage.png"
                            alt="Sign In"
                            className='w-full h-full object-cover rounded-l-[24px]'
                        />
                    </div>
                    <div className='col-span-12 lg:col-span-9'>
                        <div className='p-6 md:p-[32px]'>
                            <h1 className='text-[24px] tracking-[0.48px] md:text-[36px] md:tracking-[0.72px] font-semibold mb-6'>
                                Sign In
                            </h1>

                            {/* Error Message */}
                            {error && (
                                <div className='bg-red-100 text-red-700 px-4 py-3 rounded-[12px] mb-4 text-[14px]'>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* Email Input */}
                                <div>
                                    <input
                                        type="email"
                                        placeholder="Enter email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full"
                                        required
                                    />
                                </div>

                                {/* Password Input */}
                                <div className='relative'>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full pr-12"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className='absolute right-4 top-1/2 -translate-y-1/2 text-[#3D3D3D]'
                                    >
                                        {showPassword ? (
                                            <BsFillEyeSlashFill className='w-[20px] h-[20px]' />
                                        ) : (
                                            <BsFillEyeFill className='w-[20px] h-[20px]' />
                                        )}
                                    </button>
                                </div>

                                {/* Forgot Password & Remember Me */}
                                <div className='flex justify-between items-center'>
                                    <div className='flex items-center gap-2'>
                                        <input
                                            type="checkbox"
                                            id="rememberMe"
                                            checked={rememberMe}
                                            onChange={(e) => setRememberMe(e.target.checked)}
                                            className='w-[16px] h-[16px] cursor-pointer'
                                        />
                                        <label
                                            htmlFor="rememberMe"
                                            className='text-[14px] text-[#3D3D3D] cursor-pointer'
                                        >
                                            Remember Me
                                        </label>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleForgotPassword}
                                        className='text-[14px] text-[#34658C] font-semibold hover:underline'
                                    >
                                        Forgot Password?
                                    </button>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className='w-full bg-[#34658C] text-white px-6 py-3 rounded-[12px] text-[16px] font-semibold hover:bg-[#2a5270] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                >
                                    {loading ? 'Signing in...' : 'Sign In'}
                                </button>

                                {/* Divider */}
                                <div className='flex items-center gap-3 my-4'>
                                    <div className='flex-1 h-[1px] bg-[#CCCCCC]'></div>
                                    <span className='text-[14px] text-[#666666]'>or Continue With</span>
                                    <div className='flex-1 h-[1px] bg-[#CCCCCC]'></div>
                                </div>

                                {/* Google Login Button */}
                                <button
                                    type="button"
                                    onClick={handleGoogleLogin}
                                    className='w-full border-[1px] border-[#3D3D3D] px-6 py-3 rounded-[12px] text-[16px] font-semibold flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors'
                                >
                                    <FcGoogle className='w-[24px] h-[24px]' />
                                    Login With Google
                                </button>

                                {/* Sign Up Link */}
                                <div className='text-center mt-4'>
                                    <p className='text-[14px] text-[#666666]'>
                                        Don't have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSignInOpen(false);
                                                if (setSignUpOpen) {
                                                    setSignUpOpen(true);
                                                }
                                            }}
                                            className='text-[#34658C] font-semibold hover:underline'
                                        >
                                            Sign Up
                                        </button>
                                    </p>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
