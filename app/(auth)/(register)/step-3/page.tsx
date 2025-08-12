"use client"
import Image from 'next/image';
import React, { useEffect } from 'react';
import logo from "@/public/assets/Icon.png"
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useCreateUserMutation, useUploadProfileMutation } from '@/app/store/api/userApi';
import { completeUserValidationSchema } from '@/app/utils/validation';
import { toast } from 'react-toastify';

const Page = () => {
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [createUser, { isLoading }] = useCreateUserMutation();
  const [uploadProfile] = useUploadProfileMutation();
  const dataUrlToBlob = (dataUrl: string): Blob => {
    try {
      const [meta, base64] = dataUrl.split(',');
      const mimeMatch = /data:(.*?);base64/.exec(meta || '') || [];
      const mime = mimeMatch[1] || 'image/jpeg';
      const binary = atob(base64 || '');
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) array[i] = binary.charCodeAt(i);
      return new Blob([array], { type: mime });
    } catch {
      return new Blob();
    }
  };

  const handleCreateShowcase = async () => {
    const toastId = 'register-flow';
    toast.dismiss();
    toast.loading('Creating your account...', { toastId });

    try {
      await completeUserValidationSchema.validate(user ?? {}, { abortEarly: false });
      const res = await createUser(user as any).unwrap();

      const userId =
        res?.userId || res?.data?.userId ||
        res?._id || res?.data?._id ||
        res?.id || res?.data?.id ||
        res?.userKey || res?.data?.userKey ||
        res?.key || res?.data?.key;

      let finalMessage = 'Account created successfully';

      if (userId && user?.profileImage) {
        try {
          const blob = dataUrlToBlob(user.profileImage);
          if (blob.size > 0) {
            await uploadProfile({ userKey: String(userId), file: blob, filename: 'profile.jpg' }).unwrap();
            finalMessage = 'Account created and profile image uploaded';
          }
        } catch (e: any) {
          const status = e?.status;
          const data = e?.data;
          let message = 'Profile upload failed';
          if (data) {
            if (typeof data === 'string') message = data;
            else if (Array.isArray(data?.message)) message = data.message.join('\n');
            else if (data?.message) message = String(data.message);
            else if (data?.error) message = String(data.error);
          }
          if (status) message = `${status} - ${message}`;
          finalMessage = `Account created. ${message}`;
        }
      }

      toast.update(toastId, { render: finalMessage, type: 'success', isLoading: false, autoClose: 3000 });
      router.push('/dashboard');
    } catch (err: any) {
      if (err?.inner) {
        const msgs = err.inner.map((e: any) => e.message).join('\n') || 'Please correct the highlighted errors';
        toast.update(toastId, { render: msgs, type: 'error', isLoading: false, autoClose: 4000 });
      } else {
        const status = err?.status;
        const data = err?.data;
        let message = 'Failed to create user';
        if (data) {
          if (typeof data === 'string') message = data;
          else if (Array.isArray(data?.message)) message = data.message.join('\n');
          else if (data?.message) message = String(data.message);
          else if (data?.error) message = String(data.error);
        }
        if (status) message = `${status} - ${message}`;
        toast.update(toastId, { render: message, type: 'error', isLoading: false, autoClose: 4000 });
      }
    }
  };

  return (
    <>
      <nav className="relative w-full flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-10">
          <div className="flex itemscenter space-x-2">
            <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
              <Image src={logo} alt="" />
            </div>
            <span className="text-base font-semibold text-gray-900">TalentBridge</span>
          </div>
        </div>
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center">✓</div>
              <span className="text-gray-700">Account</span>
            </div>
            <span className="text-gray-400 text-xs">{'>'}</span>

            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center">✓</div>
              <span className="text-gray-700">Profile</span>
            </div>
            <span className="text-gray-400 text-xs">{'>'}</span>

            <div className="flex items-center space-x-1">
              <div className="w-5 h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center">3</div>
              <span className="text-gray-900 font-semibold">Showcase</span>
            </div>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600 text-sm">
          ×
        </button>
      </nav>

      <div className="bg-gray-50 flex items-center justify-center min-h-screen">
        <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">Showcase Your Skills</h2>
          <p className="text-gray-500 mb-6">
            TalentBridge allows you to create personalized showcase rooms featuring your best work.
          </p>
          <div className="bg-teal-50 text-left p-4 rounded-lg mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">What is a Showcase Room?</h3>
            <p className="text-sm text-gray-600 mb-2">
              Think of it as your digital portfolio where you can:
            </p>
            <ul className="text-sm text-gray-700 space-y-1">
              <li className="flex items-start"><span className="text-teal-500 mr-2">✔</span>Display your projects and achievements</li>
              <li className="flex items-start"><span className="text-teal-500 mr-2">✔</span>Share your work experience</li>
              <li className="flex items-start"><span className="text-teal-500 mr-2">✔</span>Connect with industry professionals and recruiters</li>
            </ul>
          </div>
          
          <button 
            className="bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleCreateShowcase}
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create My First Showcase Room'}
          </button>
        </div>
      </div>
    </>
  );
};

export default Page;
