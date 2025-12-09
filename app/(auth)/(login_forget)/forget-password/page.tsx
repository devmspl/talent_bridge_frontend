"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/assets/Icon1.svg';
import { useRouter } from 'next/navigation';
import { useForgotPasswordMutation } from '@/app/store/api/userApi';
import { toast } from 'react-toastify';
import bgShape from "@/public/Gradientbackground.svg";

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      const msg = 'Please enter a valid email';
      setError(msg);
      toast.error(msg, { toastId: 'forgot-validation' });
      return;
    }

    try {
      const res = await forgotPassword({ email }).unwrap();
      // Store email in sessionStorage for the reset password page
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('resetPasswordEmail', email);
        // Store token if returned from the API response
        if (res?.token) {
          sessionStorage.setItem('resetPasswordToken', res.token);
        } else if (res?.data?.token) {
          sessionStorage.setItem('resetPasswordToken', res.data.token);
        }
      }
      toast.success('Reset link sent to your email', { toastId: 'forgot-success' });
      router.push('/verify-email');
    } catch (err: any) {
      const status = err?.status;
      const data = err?.data;
      let message = 'Request failed';
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
      toast.error(message, { toastId: 'forgot-api' });
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
                className="absolute bottom-0 left-0 pointer-events-none "
                alt="Background Shape"
                fill
              />
              </div>

      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        {/* Logo and Brand */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="review rounded-full p-2">
            <Image src={logo} alt="Logo" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Title and Subtitle */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Forgot Password</h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the email address associated with your account.
          </p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="e.g johndoe@gmail.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(''); }}
              className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${error ? 'border-red-500' : 'border-gray-300'}`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full review text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Continue'}
          </button>
        </form>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-sm text-gray-500">Or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>
         <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?{" "}
          <a
            href="/signup"
            className="text-teal-600 font-medium hover:underline"
          >
            Sign up
          </a>
        </p>
      </div>

      
    </div>
  );
};

export default Page;
