"use client"
import Image from 'next/image';
import React, { useState } from 'react'
import logo from '@/public/assets/profile/Avatarlogo.png'
import { FiX } from 'react-icons/fi';

const Personal_info = () => {
      const [jobTypes, setJobTypes] = useState(["Permanent", "Contract", "N/A"]);
  
      const removeJobType = (type: string) => {
        setJobTypes(jobTypes.filter(t => t !== type));
      };

  return (
    <div className="flex-1 ">
          <div className="flex items-center gap-4 mb-6">
            <Image
              src={logo}
              alt="Profile"
              width={96}
              className="rounded-full object-cover"
            />
            <div>
              <div className="mb-3">
                <h2 className="text-xl font-semibold">John Doe</h2>
                <p className="text-gray-500">Data Analyst</p>
              </div>
              <div className="ml-auto space-x-2">
                <button className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer">
                  Change Photo
                </button>
                <button className="px-4 py-2 border  border-gray-200 rounded hover:bg-gray-100 cursor-pointer">
                  Remove
                </button>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg">
            <div className=" border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold">
              <h1>Profile</h1>
            </div>
            <form className="grid grid-cols-2 gap-4 shadow p-6">
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1 ">Full name</label>
                <input
                  type="text"
                  placeholder="First name"
                  className="w-full px-4 py-2 border border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-2 border  border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  placeholder="yourname@company.com"
                  className="w-full px-4 py-2 border  border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Country</label>
                <select className="w-full px-4 py-2 border  border-gray-200 rounded">
                  <option>Country</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  placeholder="Your city"
                  className="w-full px-4 py-2 border  border-gray-200 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Industry</label>
                <select className="w-full px-4 py-2 border  border-gray-200 rounded">
                  <option>Select your industry</option>

                </select>
              </div>

              <div className="">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Preferred Employment Type</label>
                  <select className="w-full px-4 py-2 border  border-gray-200 rounded">
                    <option>Select preferred job type</option>
                    <option>Permanent</option>
                    <option>Contract</option>
                    <option>N/A</option>
                  </select>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {jobTypes.map(type => (
                    <div
                      key={type}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm"
                    >
                      {type}
                      <button
                        onClick={() => removeJobType(type)}
                        className="ml-1 text-gray-500 hover:text-gray-700"
                      >
                        <FiX />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </form>
            <div className="mt-6 flex justify-end gap-3 mb-6 p-6">
              <button className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer">
                Save changes
              </button>
              <button className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">
                Cancel
              </button>
            </div>

          </div>
        </div>
  )
}

export default Personal_info