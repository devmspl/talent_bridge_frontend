"use client";
import Image from "next/image";

import { useRouter } from "next/navigation";
import { useState } from "react";

import profile from "@/public/assets/profile/profilepreview.svg"
import call from "@/public/assets/icons/call.svg";
import msg from "@/public/assets/icons/msgg.svg";
import share from "@/public/assets/icons/share.svg";
import up from "@/public/assets/icons/up-arrow.svg"
import logo from "@/public/assets/icons/logo.svg"
import Link from "next/link";

export default function PreviewPage() {
  const router = useRouter();
  

  const technicalSkills = ["SQL", "Python", "Tableau", "Power BI", "Power Automate", "DAX"];
  const transferableSkills = ["Project Management", "Process Improvement", "Agile", "Communication", "Scrum", "Patience"];

  const insights = [
    {
      id: 1,
      title: "GSTC Bank",
      description: "Multinational Bank Listed on the FTSE 100 Index",
      tag: "Finance",
      bgColor: "bg-[#FFF7ED]",
      tagColor: "bg-[#FFFBEB]",
      tagTextColor: "text-[#B45309]",
      tagBorderColor: "border-[#FDE68A]"
    },
    {
      id: 2,
      title: "Pets World Co.",
      description: "Fastest Growing Pet Store in the UK",
      tag: "Retail",
      bgColor: "bg-[#F9FAFB]",
      tagColor: "bg-[#F9FAFB]",
      tagTextColor: "text-[#374151]",
      tagBorderColor: "border-[#E5E7EB]"
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Profile Header Section */}
          <div className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#111827] mb-2">Data/BI Analyst</h1>
                <p className="text-base sm:text-lg lg:text-[18px] text-[#4B5563] mb-2">John Doe • London, UK</p>
                
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="text-sm sm:text-base lg:text-[16px] text-[#4B5563]">Qualifications:</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">MS-PLGO</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">CISSP</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">ACCA</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">LLB</span>
                  <span className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">LLM</span>
                </div>
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={call} alt="" />
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={msg} alt="" />
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={share} alt="" />
              </div>
            </div>
          </div>

          {/* Video Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              {/* Profile Image Background */}
              <Image
                src={profile}
                alt="Profile Preview"
                className="w-full h-full object-cover"
                fill
              />
            </div>
          </div>

          {/* Skills Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            
            {/* Technical Skills */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">Technical Skills</h3>
                <span className="text-xs bg-[#F9FAFB] px-2 py-1 rounded-[20px] text-[#374151] border border-[#E5E7EB] w-fit">AI Assessed</span>
              </div>
              <div className="border-b border-[#E5E7EB] mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-4 sm:p-6 pt-0">
                {technicalSkills.map((skill, index) => (
                  <div key={index} className="bg-[#F9FAFB] px-3 py-2 rounded-[10px] text-sm sm:text-[14px] text-[#333333] flex items-start justify-start">
                    {skill}
                  </div>
                ))}
              </div>
            </div>

            {/* Transferable Skills */}
            <div className="bg-white rounded-xl border border-[#E5E7EB]">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-semibold text-[#111827]">Transferable Skills</h3>
                <span className="text-xs bg-[#F9FAFB] px-2 py-1 rounded-[20px] text-[#374151] border border-[#E5E7EB] w-fit">AI Assessed</span>
              </div>
              <div className="border-b border-[#E5E7EB] mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 p-4 sm:p-6 pt-0">
                {transferableSkills.map((skill, index) => (
                  <div key={index} className="bg-[#F9FAFB] px-3 py-2 rounded-[10px] text-sm sm:text-[14px] text-[#333333] flex items-start justify-start">
                    {skill}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Insights Section */}
          <div className="bg-white rounded-xl border border-[#E5E7EB] mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-[#111827] p-4 sm:p-6">Insights</h3>
            <div className="border-b border-[#E5E7EB] mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 sm:p-6">
              {insights.map((insight) => (
                <div key={insight.id} className={`${insight.bgColor} rounded-[10px] p-4`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#111827] mb-1 text-sm sm:text-base">{insight.title}</h4>
                      <p className="text-xs sm:text-sm text-[#4B5563] mb-2">{insight.description}</p>
                      <span className={`text-xs ${insight.tagColor} ${insight.tagTextColor} ${insight.tagBorderColor} px-2 py-1 rounded-full border`}>
                        {insight.tag}
                      </span>
                    </div>
                    <Link href="/preview/view">
                      <div className="flex items-center gap-2 text-[#374151] text-xs sm:text-[12px] cursor-pointer hover:text-gray-800">
                        <span>View project</span>
                        <Image src={up} alt="" width={7} height={7} />
                      </div>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center py-4 sm:py-6">
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 review rounded-full flex items-center justify-center">
                <Image src={logo} alt="" width={20} height={20} className="sm:w-6 sm:h-6" />
              </div>
              <span className="text-xs sm:text-sm text-gray-600">Powered by <span className="text-gray-800 font-semibold">TalentBridge.</span></span>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
