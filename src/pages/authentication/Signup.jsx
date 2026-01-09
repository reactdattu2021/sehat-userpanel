import React, { useState } from 'react';
import { IoClose } from "react-icons/io5";
import { BsFillEyeFill, BsFillEyeSlashFill } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from '../../context/AuthContext';

const Signup = ({ setSignUpOpen, setSignInOpen }) => {
    const { signup } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        password: ''
    });

    const [agreeTerms, setAgreeTerms] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        // Check if all fields are filled
        if (!formData.firstname || !formData.lastname || !formData.email || !formData.phone || !formData.password) {
            setError('All fields are required');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Please enter a valid email address');
            return false;
        }

        // Validate phone number (10 digits)
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(formData.phone)) {
            setError('Phone number must be 10 digits');
            return false;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters long');
            return false;
        }

        // Check terms agreement
        if (!agreeTerms) {
            setError('You must agree to Terms & Conditions and Privacy Policies');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate form
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        // Include agreeTerms in the payload
        const signupData = {
            ...formData,
            agreeTerms: agreeTerms,
            termsAndCondition: agreeTerms
        };

        const result = await signup(signupData);

        if (result.success) {
            setSuccess('Signup successful! Please check your email to verify your account.');
            // Clear form
            setFormData({
                firstname: '',
                lastname: '',
                email: '',
                phone: '',
                password: ''
            });
            setAgreeTerms(false);

            // Optionally close signup modal after 2 seconds and open login
            setTimeout(() => {
                setSignUpOpen(false);
                if (setSignInOpen) {
                    setSignInOpen(true);
                }
            }, 2000);
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    const handleGoogleLogin = () => {
        console.log('Google login clicked');
        const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5002/Sehatmitra';
        window.location.href = `${baseURL}/users/google`;
    };

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] overflow-y-auto py-4'>
            <div className='bg-white max-w-[300px] md:max-w-[560px] lg:max-w-[800px] rounded-[24px] my-auto'>
                <div className='relative'>
                    <IoClose
                        className='absolute w-[24px] h-[24px] top-4 right-4 cursor-pointer z-10'
                        onClick={() => setSignUpOpen(false)}
                    />
                </div>
                <div className='grid grid-cols-12 lg:grid-cols-12'>
                    <div className='hidden lg:block lg:col-span-3'>
                        <img
                            src="/assets/signInImage.png"
                            alt="Sign Up"
                            className='w-full h-full object-cover rounded-l-[24px]'
                        />
                    </div>
                    <div className='col-span-12 lg:col-span-9'>
                        <div className='p-6 md:p-[32px]'>
                            <h1 className='text-[24px] tracking-[0.48px] md:text-[36px] md:tracking-[0.72px] font-semibold mb-6'>
                                Sign Up
                            </h1>

                            {/* Error Message */}
                            {error && (
                                <div className='bg-red-100 text-red-700 px-4 py-3 rounded-[12px] mb-4 text-[14px]'>
                                    {error}
                                </div>
                            )}

                            {/* Success Message */}
                            {success && (
                                <div className='bg-green-100 text-green-700 px-4 py-3 rounded-[12px] mb-4 text-[14px]'>
                                    {success}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className='space-y-4'>
                                {/* First Name and Last Name - Side by Side */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <div>
                                        <input
                                            type="text"
                                            name="firstname"
                                            placeholder="Enter first name"
                                            value={formData.firstname}
                                            onChange={handleChange}
                                            className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <input
                                            type="text"
                                            name="lastname"
                                            placeholder="Enter last name"
                                            value={formData.lastname}
                                            onChange={handleChange}
                                            className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Email Input - Full Width */}
                                <div>
                                    <input
                                        type="email"
                                        name="email"
                                        placeholder="Enter email address"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full"
                                        required
                                    />
                                </div>

                                {/* Mobile Number and Password - Side by Side */}
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                                    <div>
                                        <input
                                            type="tel"
                                            name="phone"
                                            placeholder="Enter Mobile Number"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            maxLength="10"
                                            className="px-4 py-3 text-[14px] leading-[22px] tracking-[0.56px] rounded-[12px] placeholder:text-[#3D3D3D] border-[1px] border-[#3D3D3D] w-full"
                                            required
                                        />
                                    </div>
                                    <div className='relative'>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleChange}
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
                                </div>

                                {/* Terms & Conditions */}
                                <div className='flex items-start gap-2'>
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className='w-[16px] h-[16px] mt-1 cursor-pointer'
                                    />
                                    <label
                                        htmlFor="agreeTerms"
                                        className='text-[14px] text-[#3D3D3D] cursor-pointer'
                                    >
                                        I Agree With{' '}
                                        <span className='text-[#34658C] font-semibold hover:underline'>
                                            Terms And Conditions
                                        </span>
                                        {' '}&{' '}
                                        <span className='text-[#34658C] font-semibold hover:underline'>
                                            Privacy Policies
                                        </span>
                                    </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className='w-full bg-[#34658C] text-white px-6 py-3 rounded-[12px] text-[16px] font-semibold hover:bg-[#2a5270] disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                                >
                                    {loading ? 'Creating Account...' : 'Sign Up'}
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

                                {/* Sign In Link */}
                                <div className='text-center mt-4'>
                                    <p className='text-[14px] text-[#666666]'>
                                        Already have an account?{' '}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSignUpOpen(false);
                                                if (setSignInOpen) {
                                                    setSignInOpen(true);
                                                }
                                            }}
                                            className='text-[#34658C] font-semibold hover:underline'
                                        >
                                            Sign In
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

export default Signup;