"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import { BsGripVertical } from "react-icons/bs";
import Tool from "@/public/assets/icons/Tooltip.svg"
import check from "@/public/assets/icons/Vector (1).svg"
import Doc from "@/public/assets/icons/doc.svg"
import cut from "@/public/assets/icons/cutt.svg"
import Link from "next/link";

const InsightsPage = () => {
  const [skills] = useState(["SQL", "Tableau", "Python", "Power Automate", "DAX",
    "Power BI "
  ]);
  const [skills2] = useState(["Project Management", "Agile", "Scrum", "Process Improvement", "Communication",
    "Patience "
  ]);
  const routes = useRouter()
      const [duration, setDuration] = useState("< 6 months");
          const [teamSize, setTeamSize] = useState("0-10");
            const [industry, setIndustry] = useState("Finance");
  const [files, setFiles] = useState<any[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        progress: 50, // 
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
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
            <span className="text-gray-800 font-semibold">New</span>
          </div>
          <button 
            className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm font-medium"
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
          
          {/* Stepper - Responsive */}
          <div className="flex items-center text-sm font-medium gap-3 sm:gap-4 justify-center px-6 py-6 sm:py-8 border-b border-gray-200 bg-gray-50/50">
            
            {/* Step 1: Introduction - Completed */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
                <Image src={check} alt="" className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline text-gray-600 font-medium">Introduction</span>
            </div>
            <span className="text-gray-300">›</span>
            
            {/* Step 2: Competencies - Completed */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
                <Image src={check} alt="" className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline text-gray-600 font-medium">Competencies</span>
            </div>
            <span className="text-gray-300">›</span>
            
            {/* Step 3: Insights - Current */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-md flex-shrink-0 font-semibold">
                3
              </div>
              <span className="hidden sm:inline text-gray-900 font-semibold">Insights</span>
            </div>
          </div>

          {/* Content - Responsive Padding */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-4 sm:space-y-5">
            
            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
              <input
                type="text"
                defaultValue="GSTC Bank"
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="text"
                defaultValue="http://www.designsystem.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none"
              />
            </div>

            {/* Industry and Duration - Responsive */}
            <div className="flex flex-col sm:flex-row gap-4">
              {/* <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                  <option>Finance</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                </select>
              </div> */}

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

              {/* <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                  <option>&lt; 6 months</option>
                  <option>6-12 months</option>
                  <option>1+ year</option>
                </select>
              </div> */}

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

            {/* Team Size */}
            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                <option>0-10</option>
                <option>10-25</option>
                <option>25+</option>
              </select>
            </div> */}


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


            {/* Summary Textarea */}
            <div> 
              <label className="block text-sm font-medium text-gray-700 mb-2">Summarise the value you added in 3 paragraphs</label>
              <textarea
                rows={4}
                placeholder="Type your message here"
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">max 1200 characters (AI will tweak it in the preview)</p>
            </div>

            {/* Technical Skills */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <span className="text-sm font-medium text-gray-600">Technical skills</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100 w-fit">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="text-gray-800 text-sm font-medium flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate">{skill}</span>
                      {index === 0 && (
                        <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition">
                          <Image
                            src="/assets/icons/Tect.svg"
                            alt="Edit"
                            width={16}
                            height={16}
                            className="opacity-60 hover:opacity-100 transition"
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center ml-3 flex-shrink-0">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
                        <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transferable Skills */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                <span className="text-sm font-medium text-gray-600">Transferable skills</span>
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100 w-fit">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills2.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all"
                  >
                    <div className="text-gray-800 text-sm font-medium flex items-center gap-2 flex-1 min-w-0">
                      <span className="truncate">{skill}</span>
                      {index === 0 && (
                        <button className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition">
                          <Image
                            src="/assets/icons/Tect.svg"
                            alt="Edit"
                            width={16}
                            height={16}
                            className="opacity-60 hover:opacity-100 transition"
                          />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center ml-3 flex-shrink-0">
                      <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition">
                        <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* File Upload Section */}
            <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
              <div className="mb-4">
                <label className="text-sm font-medium text-gray-800 block mb-2">Upload supporting materials (optional)</label>
                <div className="border border-dashed bg-white border-gray-300 rounded-md flex items-center justify-center flex-col py-6 sm:py-8 text-sm text-gray-600 min-h-[120px] sm:min-h-[150px]">
                  <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                  <p className="flex flex-col sm:flex-row items-center gap-1 text-center px-2">
                    <span className="hidden sm:inline">Drag & drop file here or</span>
                    <span className="sm:hidden">Upload files or</span>
                    <label className="text-blue-600 font-medium cursor-pointer hover:underline">
                      choose file
                      <input
                        type="file"
                        className="hidden"
                        multiple
                        onChange={handleFileChange}
                      />
                    </label>
                  </p>
                  <p className="text-gray-500 text-xs mt-1">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</p>
                </div>
              </div>

              {/* File List */}
              <div className="space-y-3">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-start flex-1 mr-3 gap-3 min-w-0">
                      <Image src={Doc} alt="doc" className="w-6 h-5 sm:w-8 sm:h-6 mt-1 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                        <div className="w-full bg-gray-200 h-1.5 rounded mt-2">
                          <div
                            className="bg-blue-500 h-1.5 rounded transition-all duration-300"
                            style={{ width: `${file.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="ml-2 hover:opacity-80 flex-shrink-0 p-1"
                    >
                      <Image src={cut} alt="remove" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Add New Insight Button */}
            <Link href="/insights-overview">
              <button
                type="button"
                className="w-full flex  gap-2  py-3 text-sm font-medium text-teal-600 hover:bg-gray-50 transition"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-5 h-5 text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add a new insight
              </button>
            </Link>

            {/* Action Buttons - Responsive */}
            <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <button 
                className="w-full sm:w-auto text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition shadow-sm text-sm font-medium"
                onClick={() => routes.push("/competencies")}
              >
                Back
              </button>
              <button 
                className="w-full sm:w-auto review text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 cursor-pointer transition shadow-md text-sm font-semibold"
                onClick={() => routes.push("/insight-preview")}
              >
                Preview
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InsightsPage;
