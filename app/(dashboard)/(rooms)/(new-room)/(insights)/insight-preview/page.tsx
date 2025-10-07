"use client";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineEdit } from "react-icons/ai";
import { BsTrash } from "react-icons/bs";
import { BsTelephone, BsEnvelope } from "react-icons/bs";
import { BsGripVertical } from "react-icons/bs";
import introVideoImg from "@/public/assets/Frame 1216401620.svg";
import introvid from "@/public/assets/icons/intro vid.svg";
import checkIcon from "@/public/assets/icons/check.svg";
import call from "@/public/assets/icons/call.svg";
import msg from "@/public/assets/icons/msgg.svg";
import share from "@/public/assets/icons/share.svg";
import delw from "@/public/assets/icons/delete.svg";
import Tool from "@/public/assets/icons/Tooltip.svg"
import delete_i from "@/public/assets/icons/delete.svg"
import edit from "@/public/assets/icons/text.svg"
import Link from "next/link";
import PublishModal from "@/app/component/modals/showcase-modal/showcase-model";
import cover from "@/public/assets/image cover.svg"

const PortfolioPage = () => {
  const router = useRouter();
const [isModalOpen, setIsModalOpen] = useState(false);
  const [coreSkills] = useState(["SQL", "Tableau", "Python", "Power BI"]);
  const [transferableSkills] = useState([
    "Project Management",
    "Leadership",
    "Agile",
    "Scrum",
  ]);

  const [caseStudies, setCaseStudies] = useState([
    {
      id: 1,
      title: "GSTC BANK",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
      
      color: "bg-[#FFF7ED]",
    },
    {
      id: 2,
      title: "Pet World Co.",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
     
       color: "bg-[#F9FAFB]",
    },
    {
      id: 3,
      title: "Bridge Fx",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
   
      color: "bg-[#F0F8FF]",
    },
    {
      id: 4,
      title: "Bridge Fx",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
   
      color: "bg-[#EEF2FF]",
    },
    {
      id: 5,
      title: "Bridge Fx",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
  
      color: "bg-[#F0FDFA]",
    },
     {
      id: 5,
      title: "Bridge Fx",
      description: "AI Summary of the 3 paragraphs here",
      tag: "Finance",
  
      color: "bg-[#FDF2F8]",
    },
  ]);

  const handleDeleteInsight = (id: number) => {
    setCaseStudies(caseStudies.filter(insight => insight.id !== id));
  };

  return (
    <>
      {/* Breadcrumb and Save Draft - Responsive */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/showcase-rooms" className="hover:text-gray-800 transition">
              Showcase rooms
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">Preview</span>
          </div>
          <button 
            className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm font-medium"
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        
        {/* Profile Header - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Data Analytics Portfolio</h2>
              <p className="text-gray-700 text-sm mt-1">John Doe • London, UK</p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">MS-PL60</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">CISSP</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">ACCA</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">LLB</span>
                <span className="bg-gray-100 px-2 py-1 rounded text-xs font-medium">LLM</span>
              </div>
            </div>

            <div className="flex gap-2 sm:gap-3 flex-shrink-0">
              <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition">
                <Image className="w-5 h-5 sm:w-6 sm:h-6" src={call} alt="Call" />
              </button>
              <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition">
                <Image className="w-5 h-5 sm:w-6 sm:h-6" src={msg} alt="Message" />
              </button>
              <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition">
                <Image className="w-5 h-5 sm:w-6 sm:h-6" src={share} alt="Share" />
              </button>
            </div>
          </div>
        </div>

        {/* Cover Image - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Cover Image</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <Image src={delw} alt="Delete" className="w-4 h-4" />
              </button>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src={cover}
                alt="Cover Image"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Intro Video - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 mb-4 sm:mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Intro Video</h3>
              <button className="p-1 hover:bg-gray-100 rounded transition">
                <Image src={delw} alt="Delete" className="w-4 h-4" />
              </button>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96 rounded-lg overflow-hidden">
              <Image
                src={introvid}
                alt="Intro Video"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Skills Section - Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
          
          {/* Technical Skills */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Technical Skills</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100 w-fit">
                AI Generated
              </span>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {coreSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="text-gray-800 text-sm font-medium flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate">{skill}</span>
                    {index === 0 && (
                      <button className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition">
                        <Image
                          src="/assets/icons/Tect.svg"
                          alt="Edit"
                          width={14}
                          height={14}
                          className="opacity-60 hover:opacity-100 transition"
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center ml-2 flex-shrink-0">
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition">
                      <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transferable Skills */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Transferable Skills</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100 w-fit">
                AI Generated
              </span>
            </div>
            <div className="border-b border-gray-200 mb-4"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {transferableSkills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-gray-50 px-3 sm:px-4 py-2.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <div className="text-gray-800 text-sm font-medium flex items-center gap-2 flex-1 min-w-0">
                    <span className="truncate">{skill}</span>
                    {index === 0 && (
                      <button className="flex-shrink-0 p-1 hover:bg-gray-200 rounded transition">
                        <Image
                          src="/assets/icons/Tect.svg"
                          alt="Edit"
                          width={14}
                          height={14}
                          className="opacity-60 hover:opacity-100 transition"
                        />
                      </button>
                    )}
                  </div>
                  <div className="flex items-center ml-2 flex-shrink-0">
                    <button className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded transition">
                      <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insights Section - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Insights</h3>
          </div>
          <div className="border-b border-gray-200 mb-4"></div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {caseStudies.map((item, index) => (
              <div key={index} className={`${item.color} border border-gray-100 rounded-lg p-4 sm:p-6`}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base truncate">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 line-clamp-2">{item.description}</p>
                    <span className="text-xs bg-teal-50 border border-teal-200 text-teal-700 px-2 py-1 rounded-full font-medium">
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 text-xs sm:text-sm">
                    <Link href={`case-study?title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}&tag=${encodeURIComponent(item.tag)}`}>
                      <button className="flex items-center gap-1 text-gray-600 hover:text-gray-900 cursor-pointer transition">
                        <Image src={edit} alt="Edit" width={14} height={14} />
                        <span className="hidden sm:inline">Continue Editing</span>
                        <span className="sm:hidden">Edit</span>
                      </button>
                    </Link>
                    <button 
                      className="flex items-center gap-1 text-red-500 hover:text-red-700 cursor-pointer transition"
                      onClick={() => handleDeleteInsight(item.id)}
                    >
                      <Image src={delete_i} alt="Delete" width={14} height={14} />
                      <span className="hidden sm:inline">Delete</span>
                      <span className="sm:hidden">Del</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons - Responsive */}
        <div className="flex flex-col-reverse sm:flex-row justify-between gap-3 mb-4 sm:mb-6">
          <button 
            className="w-full sm:w-auto text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition shadow-sm text-sm font-medium"
            onClick={() => router.push("/insights")}
          >
            Back
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto review text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 cursor-pointer transition shadow-md text-sm font-semibold"
          >
            Publish
          </button>
        </div>
      </div>
      
      <PublishModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default PortfolioPage;
