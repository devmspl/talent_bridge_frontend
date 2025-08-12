"use client";
import React, { useEffect } from 'react';
import Image from "next/image";
import auth_video from '@/public/assets/Frame 1707479571.png'
import logo from '@/public/assets/Icon.png'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('tb_token') : null;
    if (token) router.replace('/dashboard');
  }, [router]);

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row items-center bg-white rounded-lg shadow-md max-w-5xl w-full p-8">
        {/* Left Section */}
        <div className="md:w-1/2 w-full text-center md:text-left space-y-6">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className=" rounded-full p-2">
              <Image
                src={logo}
                alt="TalentBridge Logo"
                width={30}
                height={30}
                className="rounded-full w-[30px] h-[30px]"
              />
            </div>
            <h1 className="text-lg font-semibold text-gray-800">TalentBridge</h1>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome to <br /> TalentBridge</h2>
            <p className="text-gray-600 mt-2">Ditch the CV. <a href="#" className="text-teal-600 font-medium">Own Your Story.</a></p>
          </div>

          <div className="space-y-3">
            <Link
              href="/signup"
              className="block w-full text-center bg-teal-500 text-white font-medium py-2 rounded-md hover:bg-teal-600 transition "
            >
              Sign Up →
            </Link>

            <Link
              href="/login"
              className="block w-full text-center border border-teal-500 text-teal-600 font-medium py-2 rounded-md hover:bg-teal-50 transition"
            >
              Log in
            </Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="md:w-1/2 w-full mt-8 md:mt-0 flex justify-center">
          <div className="relative w-full max-w-md">
            <Image
              src={auth_video}
              alt="Video thumbnail"
              width={481}
              height={582}
              className="rounded-xl object-cover shadow-md"
            />
            <button className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white bg-opacity-80 rounded-full p-3 shadow">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6 4l12 6-12 6V4z" />
                </svg>
              </div>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Page;
