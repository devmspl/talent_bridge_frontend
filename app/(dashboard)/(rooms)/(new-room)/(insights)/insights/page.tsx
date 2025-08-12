"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineEdit } from "react-icons/ai";
import { BsGripVertical } from "react-icons/bs";

const InsightsPage = () => {
  const [skills] = useState(["SQL", "Tableau", "Python"]);
  const routes = useRouter()
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
      <div className="min-h-screen  px-6 py-8">
     
        <div className="relative bg-white rounded-xl max-w-xl mx-auto border border-gray-200 shadow-sm">
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
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input
                type="text"
                defaultValue="GSTC Bank"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                defaultValue="http://www.designsystem.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>Finance</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                  <option>&lt; 6 months</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                <option>0-10</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summarise the value you added in 3 paragraphs</label>
              <textarea
                rows={4}
                placeholder="Type your message here"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <p className="text-xs text-gray-500 mt-1">max 1200 characters (AI will tweak it in the preview)</p>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-900">Technical skills</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    <div className="text-gray-800 flex items-center">
                      <span>{skill}</span>
                      {index === 0 && (
                        <AiOutlineAccountBook size={14} className="ml-2 text-gray-500 cursor-pointer" />
                      )}
                    </div>
                    {/* <BsGripVertical size={18} className="text-gray-400 cursor-move" /> */}
                    <div className="flex items-center space-x-2">
                      <span className=" text-dark-400">≡</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push("/competencies")}
              >
                Back
              </button>
              <button className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/insights-overview")}
              >
                Next
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default InsightsPage;
