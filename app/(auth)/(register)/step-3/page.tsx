"use client"
import Image from 'next/image';
import React, { useEffect } from 'react';
import logo from "@/public/assets/Icon1.svg"
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/store/store';
import { useCreateUserMutation, useUploadProfileMutation } from '@/app/store/api/userApi';
import { completeUserValidationSchema } from '@/app/utils/validation';
import { toast } from 'react-toastify';
import check from "@/public/assets/icons/Vector (1).svg"
import Link from 'next/link';
import tick from "@/public/assets/tick.svg";

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
      <nav className="relative w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full icon flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            <Image src={logo} alt="" />
          </div>
          <Link href="/auth"> <span className="text-sm sm:text-base font-semibold text-gray-900">TalentBridge</span> </Link>
        </div>

        {/* Desktop/tablet stepper */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            <div className="flex items-center gap-1 text-gray-700">
              <div className="w-5 h-5 sm:w-5 sm:h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center"><Image src={check} alt="" /> </div>
              <span className="hidden md:inline">Account</span>
              <span className="text-gray-400 hidden sm:inline">›</span>
            </div>

            <div className="flex items-center gap-1 text-gray-700">
              <div className="w-5 h-5 sm:w-5 sm:h-5 bg-teal-500 text-white text-[10px] rounded-full flex items-center justify-center"><Image src={check} alt="" /> </div>
              <span className="hidden md:inline">Profile</span>
              <span className="text-gray-400 hidden sm:inline">›</span>
            </div>

            <div className="flex items-center gap-1">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 text-white text-[10px] sm:text-xs flex items-center justify-center">3</div>
              <span className="text-gray-900 font-semibold hidden md:inline">Showcase</span>
            </div>
          </div>
        </div>

        {/* Mobile step indicator */}
        <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] flex items-center justify-center">3</div>
            <span className="text-gray-500">of 3</span>
          </div>
        </div>

        <button className="text-gray-400 hover:text-gray-600 text-sm sm:text-base">×</button>
      </nav>

      <div className="bg-gray-50 flex items-center justify-center min-h-screen px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="bg-white rounded-xl shadow-md w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg p-4 sm:p-6 md:p-8 text-center">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-1 sm:mb-2">Showcase Your Skills</h2>
          <p className="text-gray-500 mb-4 sm:mb-6 text-xs sm:text-sm">
            TalentBridge allows you to create personalized showcase rooms featuring your best work.
          </p>
          <div className="bg-[#E6F7F780] text-left p-3 sm:p-4 rounded-lg mb-4 sm:mb-6">
            <h3 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-sm sm:text-base">What is a Showcase Room?</h3>
            <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2">
              Think of it as your digital portfolio where you can:
            </p>
            <ul className="text-xs sm:text-sm text-gray-700 space-y-1">
              <li className="flex items-start"><span className="text-teal-500 mr-2"> <Image className='mt-1.5 w-3' src={tick} alt=''></Image> </span>Display your projects and achievements</li>
              <li className="flex items-start"><span className="text-teal-500 mr-2"><Image className='mt-1.5 w-3' src={tick} alt=''></Image></span>Share your work experience</li>
              <li className="flex items-start"><span className="text-teal-500 mr-2"><Image className='mt-1.5 w-3' src={tick} alt=''></Image></span>Connect with industry professionals and recruiters</li>
            </ul>
          </div>
          
          <button 
            className="review hover:bg-teal-600 text-white font-medium py-2.5 sm:py-3 px-4 rounded-lg w-full cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
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
