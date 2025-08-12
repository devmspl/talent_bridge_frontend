"use client"
import { useRouter } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";

export default function page() {
  const competencies = [
    "Statistical & Predictive Analysis",
    "ETL & Data Processing",
    "Data Visualization (Power BI, Tableau)",
    "Stakeholder Communication & Reporting",
    "DAX",
    "PYTHON",
  ];
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
      <div className="min-h-screen  p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl ">
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
                2
              </div>
              <span className="text-gray-800 font-semibold">Competencies</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                3
              </div> Insights</div>
          </div>
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between p-6">
              <h2 className="text-lg font-medium text-gray-900">
                Core competencies
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                  AI Generated
                </span>
              </h2>
              <div className="relative group">
                <span className="text-sm text-gray-400">🛈</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 p-2 text-sm bg-white border border-gray-300 shadow-md rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  <strong className="block text-gray-800">Tooltip</strong>
                  Move the skills in the order you want and feel free to adjust the skill
                </div>
              </div>
            </div>
            <div className="space-y-3">
              {competencies.map((skill, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <span className="text-gray-800 text-sm flex gap-3">{skill}
                    {skill === "Statistical & Predictive Analysis" && (<FaRegEdit />)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <span className=" text-dark-400">≡</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => routes.push("/new-room")}
              >
                Back
              </button>
              <button className="bg-teal-500 text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/insights")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
