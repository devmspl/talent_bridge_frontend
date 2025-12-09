'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import logo from '@/public/assets/Icon1.svg'; // adjust path as needed
import { useRouter, useSearchParams } from 'next/navigation';
import { useResetPasswordMutation } from '@/app/store/api/userApi';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string }>({});
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  useEffect(() => {
    // Get email from URL params or sessionStorage
    const emailParam = searchParams.get('email');
    const storedEmail = typeof window !== 'undefined' ? sessionStorage.getItem('resetPasswordEmail') : null;
    const emailToUse = emailParam || storedEmail || '';
    setEmail(emailToUse);
  }, [searchParams]);

  const validatePassword = (pwd: string): string | null => {
    if (pwd.length < 8) {
      return 'Password must be at least 8 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pwd)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pwd)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate passwords match
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      toast.error('Passwords do not match', { toastId: 'password-mismatch' });
      return;
    }

    // Validate password requirements
    const passwordError = validatePassword(password);
    if (passwordError) {
      setErrors({ password: passwordError });
      toast.error(passwordError, { toastId: 'password-validation' });
      return;
    }

    // Check if email is available
    if (!email) {
      toast.error('Email is required. Please start the password reset process again.', { toastId: 'email-missing' });
      router.push('/forget-password');
      return;
    }

    try {
      await resetPassword({ email, newPassword: password }).unwrap();
      toast.success('Password reset successfully!', { toastId: 'reset-success' });
      // Clear stored email
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('resetPasswordEmail');
      }
      router.push('/login');
    } catch (err: any) {
      const status = err?.status;
      const data = err?.data;
      let message = 'Password reset failed';
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
      toast.error(message, { toastId: 'reset-api' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-md text-center">
        {/* Logo & Brand */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="review rounded-full p-2">
            <Image src={logo} alt="Logo" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create new password</h1>
        <p className="text-sm text-gray-600 mb-6">
          {email ? (
            <>
              Create a new password for <br />
              <span className="text-teal-600 font-medium">{email}</span>
            </>
          ) : (
            'Create a new password for your account'
          )}
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Create a new password"
              className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Minimum of 8 characters with upper & lowercase & number
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Re enter Password</label>
            <input
              type="password"
              placeholder="Re enter password"
              className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-teal-500 focus:outline-none ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
              }}
              required
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full review text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Resetting password...' : 'Create new password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
