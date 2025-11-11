"use client"
import React, { useEffect, useState } from "react";
import { AiOutlineEdit, AiOutlineDelete, AiOutlineCheck, AiOutlineCloudUpload } from "react-icons/ai";
import edit from "@/public/assets/icons/text.svg"
import delete_i from "@/public/assets/icons/delete.svg"
import Image from "next/image";
import { useRouter } from "next/navigation";
import check from "@/public/assets/icons/Vector (1).svg"
import Link from "next/link";
import Tool from "@/public/assets/icons/Tooltip.svg"
import Doc from "@/public/assets/icons/doc.svg"
import cut from "@/public/assets/icons/cutt.svg"
import { lsGet, lsSet, ROOM_KEYS, InsightsData, InsightItem } from "@/app/utils/roomStorage";
const InsightsPage: React.FC = () => {
  const [skills] = useState(["SQL", "Tableau", "Python", "Power Automate", "DAX",
      "Power BI "
    ]);
    const [skills2] = useState(["Project Management", "Agile", "Scrum", "Process Improvement", "Communication",
      "Patience "
    ]);

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
    const [companyName, setCompanyName] = useState("Pets World Co.");
    const [website, setWebsite] = useState("www.designsystem.com");
    const [industry, setIndustry] = useState("Finance");
    const [duration, setDuration] = useState("< 6 months");
    const [teamSize, setTeamSize] = useState("0-10");
    const routes =useRouter()

    const [insightsList, setInsightsList] = useState<InsightItem[]>([]);

    // hydrate dynamic insights list from localStorage
    useEffect(() => {
      const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName: "",
        website: "",
        industry: "Finance",
        duration: "< 6 months",
        teamSize: "0-10",
        summary: "",
        technicalSkills: [],
        transferableSkills: [],
        insights: [],
      });
      setInsightsList(saved.insights || []);
    }, []);

    const persistInsights = (next: InsightItem[]) => {
      setInsightsList(next);
      const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName: companyName,
        website: website,
        industry: industry,
        duration: duration,
        teamSize: teamSize,
        summary: "",
        technicalSkills: [],
        transferableSkills: [],
        insights: next,
      });
      lsSet(ROOM_KEYS.insights, { ...saved, insights: next });
    };

    // When navigating to Preview, also append current form as a new insight
    const handlePreview = () => {
      const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName: "",
        website: "",
        industry: "Finance",
        duration: "< 6 months",
        teamSize: "0-10",
        summary: "",
        technicalSkills: [],
        transferableSkills: [],
        insights: [],
      });
      const filesFromStorage = saved.currentFormFiles || [];
      const newItem = {
        title: companyName.trim() || "Untitled",
        description: "",
        tag: industry || "",
        files: filesFromStorage,
      };
      const next = [...insightsList, newItem];
      // clear temp files from storage after attaching to the new insight
      const { currentFormFiles, ...rest } = saved as any;
      lsSet(ROOM_KEYS.insights, { ...rest, insights: next } as any);
      setInsightsList(next);
      routes.push("/insight-preview");
    };

    const handleDeleteCard = (idx: number) => {
      const next = insightsList.filter((_, i) => i !== idx);
      persistInsights(next);
    };

    return (
        <>
            <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
                <div>
                   <Link href="/showcase-rooms"> Showcase rooms</Link> <span className="text-gray-800 font-semibold"> / New</span>
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
                        {insightsList.map((item, index) => (
                            <div key={index} className="bg-gray-20 bg-[#F9FAFB] border border-gray-100 rounded-lg p-6 mb-4">
                                <div className="flex justify-between items-start ">
                                    <div>
                                        <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                                        <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                                        <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
                                        {Array.isArray(item.files) && item.files.length > 0 && (
                                          <div className="mt-3 flex gap-2 flex-wrap">
                                            {item.files.map((f: any, i: number) => (
                                              f?.type?.startsWith("image/") ? (
                                                // eslint-disable-next-line @next/next/no-img-element
                                                <img key={i} src={f.data} alt={f.name} className="w-16 h-16 object-cover rounded border" />
                                              ) : f?.type?.startsWith("video/") ? (
                                                <video key={i} src={f.data} className="w-16 h-16 rounded border" />
                                              ) : (
                                                <div key={i} className="flex items-center gap-1 text-xs text-gray-600 border rounded px-2 py-1">
                                                  <Image src={Doc} alt="doc" className="w-4 h-4" />
                                                  <span className="truncate max-w-[100px]">{f?.name}</span>
                                                </div>
                                              )
                                            ))}
                                          </div>
                                        )}
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
                                             onClick={()=>handleDeleteCard(index)}>
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
      </div>
               {/* Add New Insight Button */}
               <Link href="/insights-overview">
                 <button
                   type="button"
                   onClick={() => {
                     const newItem = { title: (companyName || '').trim() || "Untitled", description: "", tag: industry || "" };
                     const next = [...insightsList, newItem];
                     persistInsights(next);
                   }}
                   className="w-full flex gap-2 py-3 text-sm font-medium text-teal-600 hover:bg-gray-50 transition"
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
                   Add a new project
                 </button>
               
               </Link>
                

                     <div className=" flex justify-end gap-3 mb-4 ">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push("/insights")}
              >
                Back
              </button>
              <button className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={handlePreview}
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
