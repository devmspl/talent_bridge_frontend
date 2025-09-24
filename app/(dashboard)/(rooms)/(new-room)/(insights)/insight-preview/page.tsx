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

  return (
<>
     <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
            <div>
            <Link href="/showcase-rooms">Showcase rooms </Link>  <span className="text-gray-800 font-semibold"> / Preview</span>
            </div>
            <div className="flex gap-2">
              <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
              >
                Save as draft
              </button>
            </div>
          </div>
    <div className="min-h-screen bg-white px-6 py-6">

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6 flex justify-between items-start">
        <div>
          <h2 className="text-xl font-semibold">Data Analytics Portfolio</h2>
          <p className="text-gray-700 text-sm mt-1">John Doe • London, UK</p>

          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              MS-PL60
            </span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">CISSP</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">ACCA</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">LLB</span>
            <span className="bg-gray-100 px-2 py-1 rounded text-xs">LLM</span>
          </div>
        </div>

        <div className="flex gap-4 mt-3">
          <Image src={call} alt="" />
          <Image src={msg} alt="" />
        </div>
      </div>

       <div className="bg-white rounded-xl border border-gray-200 shadow-sm  mb-6">
       <div className="mb-2 p-[20px]">
  <div className="flex justify-between items-center ">
    <h3 className="font-inter font-semibold text-[#111827]">Cover Image</h3>
    <span>
      <Image src={delw} alt="" />
    </span>
  </div>
  
</div>
<div className="border-b border-gray-300 mt-1 "></div>
       <div className="relative w-full h-[457px] rounded-lg overflow-hidden mt-4 p-6">
  <Image
    src={cover}
    alt="Intro Video"
    className="w-full h-full object-cover rounded-lg"
  />
</div>

      </div>

      {/* Intro Video */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm  mb-6">
       <div className="mb-2 p-[20px]">
  <div className="flex justify-between items-center ">
    <h3 className="font-inter font-semibold text-[#111827]">Intro Video</h3>
    <span>
      <Image src={delw} alt="" />
    </span>
  </div>
  
</div>
<div className="border-b border-gray-300 mt-1 "></div>
       <div className="relative w-full h-[457px] rounded-lg overflow-hidden mt-4 p-6">
  <Image
    src={introvid}
    alt="Intro Video"
    className="w-full h-full object-cover rounded-lg"
  />
</div>

      </div>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Core competencies */}
     <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
  <div className="flex  mb-3">
    <span className="text-lg font-inter font-semibold text-[#111827]">Technical Skills</span>
    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 border border-gray-300">
      AI Generated
    </span>
  </div>
<div className="border-b border-gray-300 mt-1 "></div>
  <div className="grid grid-cols-2 gap-3 mt-9">
    {coreSkills.map((skill, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-50 text-sm px-4 py-2 rounded-md  hover:bg-gray-100"
      >
        <div className="text-gray-800 flex items-center">
          <span>{skill}</span>
          {index === 0 && (
            <Image
              src="/assets/icons/Tect.svg"
              alt="Text Icon"
              width={14}
              height={14}
              className="ml-2 cursor-pointer"
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-dark-400">
            <Image src={Tool} alt="" />
          </span>
        </div>
      </div>
    ))}
  </div>
</div>


        {/* Transferable skills */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
  <div className="flex  mb-3">
    <span className="text-lg font-inter font-semibold text-[#111827]">Transferable Skills</span>
    <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-600 border border-gray-300">
      AI Generated
    </span>
  </div>
<div className="border-b border-gray-300 mt-1 "></div>
  <div className="grid grid-cols-2 gap-3 mt-9">
    {transferableSkills.map((skill, index) => (
      <div
        key={index}
        className="flex items-center justify-between bg-gray-50 text-sm px-4 py-2 rounded-md  hover:bg-gray-100"
      >
        <div className="text-gray-800 flex items-center">
          <span>{skill}</span>
          {index === 0 && (
            <Image
              src="/assets/icons/Tect.svg"
              alt="Text Icon"
              width={14}
              height={14}
              className="ml-2 cursor-pointer"
            />
          )}
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-dark-400">
            <Image src={Tool} alt="" />
          </span>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>

      <div className="p-6 rounded-xl border border-gray-200 shadow-sm">
       
            <p className="text-[#111827] text-lg font-inter font-semibold">Insights</p>
            <div className="border-b border-gray-300 mt-4 "></div>
        
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
    {caseStudies.map((item, index) => (
      <div key={index} className={`${item.color} border border-gray-100 rounded-lg p-6`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{item.description}</p>
            <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
          </div>
          <div className="text-sm text-red-500 space-y-1">
            <div>
              <button className="flex items-center gap-1 text-gray-600 hover:text-black cursor-pointer">
                <Image src={edit} alt="" width={16} />
                Continue Editing
              </button>
            </div>
            <div className="flex justify-end">
              <button className="flex items-center gap-1 hover:text-red-700 hover:cursor-pointer">
                <Image src={delete_i} alt="" width={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>


      {/* Footer */}
       <div className=" flex justify-end gap-3 mb-4 mt-5">

              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => router.push("/insights")}
              >
                Back
              </button>
             <button
  onClick={() => setIsModalOpen(true)}
  className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
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
