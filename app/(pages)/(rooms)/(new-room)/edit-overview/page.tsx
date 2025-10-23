"use client"
import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import edit from "@/public/assets/icons/text.svg"
import delete_i from "@/public/assets/icons/delete.svg"
import Image from "next/image";
import { useRouter } from "next/navigation";
import check from "@/public/assets/icons/Vector (1).svg"
import Link from "next/link";

const InsightsPage: React.FC = () => {
    const [companyName, setCompanyName] = useState("Pets World Co.");
    const [website, setWebsite] = useState("www.designsystem.com");
    const [industry, setIndustry] = useState("Finance");
    const [duration, setDuration] = useState("< 6 months");
    const [teamSize, setTeamSize] = useState("0-10");
    const routes =useRouter()

    const insights = [
        {
            name: "GSTC Bank",
            description: "Multinational Bank Listed on the FTSE 100 Index",
            tag: "Finance",
        },
        {
            name: "Pets World Co.",
            description: "Fastest Growing Pet Store in the UK",
            tag: "Retail",
        },
    ];

    return (
        <>
            <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
                <div>
                   <Link href="/showcase-rooms"> Showcase rooms</Link><span className='text-sm text-gray-500'>/ ...  </span> <span className="text-gray-800 font-semibold"> / New</span>
                </div>
                <div className="flex gap-2">
                    <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
                    >
                        Save as draft
                    </button>
                </div>
            </div>
            <div className="min-h-screen bg-white  py-10 flex justify-center">
                <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md ">
                    <div className="flex text-gray-500 items-center w-full text-sm font-medium mb-6 gap-4 justify-center border-b border-gray-200 p-6 ">
                        <div className="flex items-center gap-1 text-gray-500 ">
                            <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                                {/* <AiOutlineCheck className="text-white text-xs" /> */}
                                  <Image src={check} alt="" />
                            </div>
                            Introduction
                        </div>
                        <span className="text-gray-400">›</span>
                        <div className="text-gray-500 flex gap-2">
                            <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                                {/* <AiOutlineCheck className="text-white text-xs" /> */}
                                  <Image src={check} alt="" />
                            </div>
                            Competencies
                        </div>
                        <span className="text-gray-400">›</span>
                        <div className="text-gray-500 rounded-full flex gap-2">
                            <div className="w-5 h-5 review  text-white text-xs flex items-center justify-center rounded-full border">
                                3
                            </div> <span className="text-gray-800 font-semibold">Insights</span></div>
                    </div>
                    <div className="p-6">
                        {insights.map((item, index) => (
                            <div key={index} className="bg-gray-20 bg-[#F9FAFB] border border-gray-100 rounded-lg p-6 mb-4">
                                <div className="flex justify-between items-start ">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                        <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
                                    </div>
                                    <div className="text-sm text-red-500 space-y-1">
                                        <div>
                                            <button className="flex items-center gap-1 text-gray-600 hover:text-black cursor-pointer"
                                            onClick={()=>routes.push("/insights")}>
                                                <Image src={edit} alt="" width={16} />
                                                Continue Editing
                                            </button>
                                        </div>
                                        <div className="flex justify-end">
                                            <button className="flex items-center gap-1 hover:text-red-700 hover:cursor-pointer"
                                             onClick={()=>routes.push("/insights")}>
                                                <Image src={delete_i} alt="" width={16} />
                                                Delete
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center  pl-6 pr-6" >
  <div className="flex-grow border-t border-gray-300"></div>
  <h4 className="px-3 text-center text-[#4B5563] text-sm">Insight 3</h4>
  <div className="flex-grow border-t border-gray-300"></div>
</div>
                    <div className="mt-2 p-6">
                        {/* <h4 className="text-center text-gray-600 text-sm mb-6">Insight 3</h4> */}
                        
                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">Company name</label>
                            <input
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none  "
                                type="text"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">Website</label>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none  "
                                type="text"
                                placeholder="http://"
                            />
                        </div>

                        <div className="flex gap-4 mb-4">
                           
                            <div className="w-1/2 relative">
  <label className="block text-sm text-gray-700 mb-1">Industry</label>
  <select
    value={industry}
    onChange={(e) => setIndustry(e.target.value)}
    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
  >
    <option>Finance</option>
    <option>Retail</option>
    <option>Healthcare</option>
  </select>
  {/* custom dropdown icon */}
  <svg
    className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>
                         

                            <div className="w-1/2 relative">
  <label className="block text-sm text-gray-700 mb-1">Duration</label>
  <select
    value={duration}
    onChange={(e) => setDuration(e.target.value)}
    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
  >
    <option>{"< 6 months"}</option>
    <option>6-12 months</option>
    <option>1+ year</option>
  </select>
  {/* custom dropdown icon */}
  <svg
    className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>
                        </div>

                        <div className="mb-6 relative">
  <label className="block text-sm text-gray-700 mb-1">Team Size</label>
  <select
    value={teamSize}
    onChange={(e) => setTeamSize(e.target.value)}
    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
  >
    <option>0-10</option>
    <option>10-25</option>
    <option>25+</option>
  </select>
  <svg
    className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
  </svg>
</div>

                    </div>
                     <div className=" flex justify-end gap-3 mb-4 ">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push("/edit-insights")}
              >
                Back
              </button>
              <button className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/edit-previiew")}
              >
                Preview
              </button>
            </div>
                </div>
            </div>
        </>
    );
};

export default InsightsPage;
