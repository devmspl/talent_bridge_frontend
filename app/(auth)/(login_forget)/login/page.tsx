"use client"
import React, { useState } from 'react';
import Image from 'next/image';
import logo from '@/public/assets/Icon.png';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import google from "@/public/assets/media/google.png"
import linkedin from "@/public/assets/media/Icon.png"
import { useGoogleSigninMutation, useLoginMutation } from '@/app/store/api/userApi';
import { toast } from 'react-toastify';
import { loginValidationSchema } from '@/app/utils/validation';
import { useGoogleLogin } from '@react-oauth/google';

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [login, { isLoading }] = useLoginMutation();
  const [googleSignin, { isLoading: isGoogleSigning }] = useGoogleSigninMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await loginValidationSchema.validate({ email, password }, { abortEarly: false });
      setErrors({});
    } catch (err: any) {
      const newErrors: Record<string, string> = {};
      err?.inner?.forEach((e: any) => { if (e.path) newErrors[e.path] = e.message; });
      setErrors(newErrors);
      const msgs = Object.values(newErrors).join('\n') || 'Please fix the form errors';
      // toast.error(msgs, { toastId: 'login-validation' });
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      if (res?.token) {
        localStorage.setItem('tb_token', res?.token);
        localStorage.setItem('user',  JSON.stringify(res));
        toast.success('Logged in successfully', { toastId: 'login-success' });
        router.push('/dashboard');
      } else {
        toast.error('Login failed')
      }

    } catch (err: any) {
      const status = err?.status;
      const data = err?.data;
      let message = 'Login failed';
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
      toast.error(message, { toastId: 'login-api' });
    }
  };

  const onEmailChange = (v: string) => {
    setEmail(v);
    if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
  };
  const onPasswordChange = (v: string) => {
    setPassword(v);
    if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
  };

  const sendTokenToBackend = async (token: string) => {
    try {
      const res = await googleSignin({ token }).unwrap();
      if (res?.token) {
        localStorage.setItem("tb_token", res.token);
        localStorage.setItem("user", JSON.stringify(res));
        toast.success("Logged in successfully", { toastId: "login-success" });
        router.push("/dashboard");
      } else {
        toast.error("Google login failed");
      }
    } catch (err: any) {
      console.error("google-signin error:", err);
      toast.error("Google login error");
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      const token = tokenResponse?.access_token ?? tokenResponse?.credential;
      if (!token) {
        toast.error("Google did not return a token");
        return;
      }
      await sendTokenToBackend(token);
    },
    onError: () => {
      toast.error("Google sign-in failed (popup closed or blocked)");
    },
    scope: "openid profile email",
    flow: "implicit", 
  });


const handleLinkedInLogin = () => {
  const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID;
  const redirectUri = encodeURIComponent("http://localhost:3000/linkedin");
  const state = Math.random().toString(36).slice(2);
  sessionStorage.setItem("linkedin_oauth_state", state); // store state to verify later
  const scope = encodeURIComponent("r_liteprofile r_emailaddress"); // basic profile + email

  const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`;
  window.location.href = url;
};





  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow-md w-full max-w-md p-8">
        {/* Logo & Title */}
        <div className="flex flex-col items-center gap-2 mb-6">
          <div className="bg-teal-500 rounded-full p-2">
            <Image src={logo} alt="Logo" width={24} height={24} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">TalentBridge</h2>
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Log in to your account</h1>
          <p className="text-sm text-gray-500 mt-1">Please enter your details to get started</p>
        </div>

        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`mt-1 w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="form-checkbox" />
              Remember me
            </label>
            <Link href="/forget-password" className="text-sm text-teal-600 font-medium hover:underline">Forgot password?</Link>
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer disabled:opacity-60"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-200" />
          <span className="mx-2 text-sm text-gray-500">Or</span>
          <div className="flex-grow h-px bg-gray-200" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-3">
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer"
          onClick={() => loginWithGoogle()}
          >
            <Image src={google} alt="google icon" width={24} />
            Continue with Google
          </button>
          <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-md text-sm hover:bg-gray-50 transition cursor-pointer"
          onClick={handleLinkedInLogin}>
            <Image src={linkedin} alt="linkedin icon" width={24} />
            Continue with LinkedIn
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account? <a href="/signup" className="text-teal-600 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
