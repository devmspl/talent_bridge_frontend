'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/assets/Icon.png'; // adjust path as needed
import { useRouter } from 'next/navigation';

const ResetPasswordPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    router.push('/login'); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md text-center">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-teal-500 rounded-full p-2">
            <Image src={logo} alt="Logo" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create new password</h1>
        <p className="text-sm text-gray-600 mb-6">
          Enter the unique 5 digit code we just sent to <br />
          <span className="text-teal-600 font-medium">johndoe@gmail.com</span>
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create a new password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Minimum of 8 characters with upper & lowercase & number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Re enter Password</label>
            <input
              type="password"
              placeholder="Re enter password"
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer"
          >
            Create new password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
