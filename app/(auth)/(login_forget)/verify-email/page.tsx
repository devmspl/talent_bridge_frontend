"use client"
import React from 'react';
import Image from 'next/image'; // If using Next.js
import logo from '@/public/assets/Icon.png'; // Adjust your logo path
import { useRouter } from 'next/navigation';

const VerifyEmailPage = () => {
    const router = useRouter()
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 text-center space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-teal-500 rounded-full p-2">
            <Image src={logo} alt="TalentBridge" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Title and subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify email address</h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter the unique 5 digit code we just sent to <br />
            <span className="text-teal-600 font-medium">johndoe@gmail.com</span>
          </p>
        </div>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3">
          {[...Array(5)].map((_, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer"
        onClick={(e)=>{
            e.preventDefault()
            router.push('/create-new-password')
        }}
        >
          Verify Email
        </button>

        {/* Resend link */}
        <p className="text-sm text-gray-600">
          Didn’t get a code?{' '}
          <a href="#" className="text-teal-600 font-medium hover:underline">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
