"use client"
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image'; // If using Next.js
import logo from '@/public/assets/Icon1.svg'; // Adjust your logo path
import { useRouter } from 'next/navigation';
import bgShape from "@/public/Gradientbackground.svg";
import { useVerifyOTPMutation } from '@/app/store/api/userApi';
import { toast } from 'react-toastify';

const VerifyEmailPage = () => {
  const router = useRouter(); 
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '']);
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [verifyOTP, { isLoading }] = useVerifyOTPMutation();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Get email and token from sessionStorage
    if (typeof window !== 'undefined') {
      const storedEmail = sessionStorage.getItem('resetPasswordEmail') || '';
      const storedToken = sessionStorage.getItem('resetPasswordToken') || '';
      setEmail(storedEmail);
      setToken(storedToken);
      
      // If no token, redirect back to forget password
      if (!storedToken) {
        toast.error('Please start the password reset process again', { toastId: 'token-missing' });
        router.push('/forget-password');
      }
    }
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (/^\d{5}$/.test(pastedData)) {
      const newOtp = pastedData.split('').slice(0, 5);
      setOtp(newOtp);
      // Focus the last input
      inputRefs.current[4]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const otpString = otp.join('');
    
    if (otpString.length !== 4) {
      toast.error('Please enter the complete 4-digit code', { toastId: 'otp-incomplete' });
      return;
    }

    if (!token) {
      toast.error('Token is missing. Please start the password reset process again.', { toastId: 'token-missing' });
      router.push('/forget-password');
      return;
    }

    try {
      await verifyOTP({ otp: otpString, token }).unwrap();
      toast.success('Email verified successfully!', { toastId: 'verify-success' });
      router.push('/create-new-password');
    } catch (err: any) {
      const status = err?.status;
      const data = err?.data;
      let message = 'OTP verification failed';
      if (data) {
        if (typeof data === 'string') {
          message = data;
        } else if (Array.isArray(data?.message)) {
          message = data.message.join('\n');
        } else if (data?.message) {
          message = String(data.message);
        } else if (data?.error) {
          message = String(data.error);
        } else if (data?.detail) {
          message = String(data.detail);
        }
      } else if (err?.error) {
        message = String(err.error);
      }
      if (status) message = `${status} - ${message}`;
      toast.error(message, { toastId: 'verify-api' });
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex items-center justify-center px-4">
<div className="bg_gradient">
        <Image
          src={bgShape}
          className="absolute top-0 right-0 pointer-events-none"
          alt="Background Shape"
          fill
        />
         <Image
    src={bgShape}
    className="absolute bottom-0 left-0 pointer-events-none"
    alt="Background Shape"
    fill
  />
      </div>

      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8 text-center space-y-6">

        {/* Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="review rounded-full p-2">
            <Image src={logo} alt="TalentBridge" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Title and subtitle */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Verify email address</h1>
          <p className="text-sm text-gray-600 mt-2">
            Enter the unique 5 digit code we just sent to <br />
            {email ? (
              <span className="text-teal-600 font-medium">{email}</span>
            ) : (
              <span className="text-teal-600 font-medium">your email</span>
            )}
          </p>
        </div>

        {/* OTP Inputs */}
        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center gap-3">
            {[...Array(4)].map((_, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={otp[i]}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                onPaste={i === 0 ? handlePaste : undefined}
                className="w-12 h-12 text-center text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            className="w-full review text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer disabled:opacity-60"
            disabled={isLoading || otp.join('').length !== 4}
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

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
