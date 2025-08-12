"use client"
import React, { useState } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck } from "react-icons/ai";
import edit from "@/public/assets/icons/edit.png"
import delete_i from "@/public/assets/icons/trash-3.png"
import Image from "next/image";
import { useRouter } from "next/navigation";

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
                    Showcase rooms <span className="text-gray-800 font-semibold"> / New</span>
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
                            <div className="w-5 h-5 bg-teal-500 text-white text-xs flex items-center justify-center rounded-full">
                                <AiOutlineCheck className="text-white text-xs" />
                            </div>
                            Introduction
                        </div>
                        <span className="text-gray-400">›</span>
                        <div className="text-gray-500 flex gap-2">
                            <div className="w-5 h-5 bg-teal-500 text-white text-xs flex items-center justify-center rounded-full">
                                <AiOutlineCheck className="text-white text-xs" />
                            </div>
                            Competencies
                        </div>
                        <span className="text-gray-400">›</span>
                        <div className="text-gray-500 rounded-full flex gap-2">
                            <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                                3
                            </div> <span className="text-gray-800 font-semibold">Insights</span></div>
                    </div>
                    <div className="p-6">
                        {insights.map((item, index) => (
                            <div key={index} className="bg-gray-20 border border-gray-100 rounded-lg p-6 mb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                        <span className="text-xs bg-teal-50 text-teal-600 px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
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
                    <div className="mt-8 p-6">
                        <h4 className="text-center text-gray-600 text-sm mb-6">Insight 3</h4>
                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">Company name</label>
                            <input
                                value={companyName}
                                onChange={(e) => setCompanyName(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                type="text"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm text-gray-700 mb-1">Website</label>
                            <input
                                value={website}
                                onChange={(e) => setWebsite(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                type="text"
                                placeholder="http://"
                            />
                        </div>

                        <div className="flex gap-4 mb-4">
                            <div className="w-1/2">
                                <label className="block text-sm text-gray-700 mb-1">Industry</label>
                                <select
                                    value={industry}
                                    onChange={(e) => setIndustry(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    <option>Finance</option>
                                    <option>Retail</option>
                                    <option>Healthcare</option>
                                </select>
                            </div>
                            <div className="w-1/2">
                                <label className="block text-sm text-gray-700 mb-1">Duration</label>
                                <select
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                                >
                                    <option>{"< 6 months"}</option>
                                    <option>6-12 months</option>
                                    <option>1+ year</option>
                                </select>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm text-gray-700 mb-1">Team Size</label>
                            <select
                                value={teamSize}
                                onChange={(e) => setTeamSize(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                            >
                                <option>0-10</option>
                                <option>10-25</option>
                                <option>25+</option>
                            </select>
                        </div>
                    </div>
                     <div className=" flex justify-end gap-3 mb-4 ">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push("/insights")}
              >
                Back
              </button>
              <button className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/showcase-rooms")}
              >
                Next
              </button>
            </div>
                </div>
            </div>
        </>
    );
};

export default InsightsPage;
