"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import { BsGripVertical } from "react-icons/bs";
import Tool from "@/public/assets/icons/Tooltip.svg"
import check from "@/public/assets/icons/Vector (1).svg"
import Doc from "@/public/assets/icons/doc.svg"
import cut from "@/public/assets/icons/cutt.svg"
import Link from "next/link";
import { lsGet, lsSet, ROOM_KEYS, InsightsData } from "@/app/utils/roomStorage";

const InsightsPage = () => {
  const [skills, setSkills] = useState<string[]>(["SQL", "Tableau", "Python", "Power Automate", "DAX",
    "Power BI "
  ]);
  const [skills2, setSkills2] = useState<string[]>(["Project Management", "Agile", "Scrum", "Process Improvement", "Communication",
    "Patience "
  ]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [hoveredSkill2, setHoveredSkill2] = useState<string | null>(null);
  const routes = useRouter()
  const [duration, setDuration] = useState("< 6 months");
  const [teamSize, setTeamSize] = useState("0-10");
  const [industry, setIndustry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [summary, setSummary] = useState("");
  const [insights, setInsights] = useState<{ title: string; description: string; tag: string; files?: any[] }[]>([]);
  const [files, setFiles] = useState<any[]>([]);
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => {
        const url = URL.createObjectURL(file);
        const isImage = file.type.startsWith('image/');
        const isVideo = file.type.startsWith('video/');
        return {
          name: file.name,
          size: (file.size / 1024).toFixed(1) + " KB",
          progress: 100,
          url,
          type: isImage ? 'image' : isVideo ? 'video' : 'file',
          file, // Store actual File object for upload
        };
      });
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  // hydrate from localStorage
  useEffect(() => {
    const savedSelected = lsGet<string[]>(ROOM_KEYS.competencies, []);
    if (savedSelected.length) {
      setSkills(savedSelected);
      setSkills2(savedSelected);
    }
    const savedInsights = lsGet<InsightsData>(ROOM_KEYS.insights, {
      companyName: "",
      website: "",
      industry: "",
      duration: "< 6 months",
      teamSize: "0-10",
      summary: "",
      technicalSkills: savedSelected.length ? savedSelected : skills,
      transferableSkills: savedSelected.length ? savedSelected : skills2,
      insights: [],
    });
    setCompanyName(savedInsights.companyName || "");
    setWebsite(savedInsights.website || "");
    setIndustry(savedInsights.industry || "");
    setDuration(savedInsights.duration || "< 6 months");
    setTeamSize(savedInsights.teamSize || "0-10");
    setSummary(savedInsights.summary || "");
    if (savedInsights.technicalSkills?.length) setSkills(savedInsights.technicalSkills);
    if (savedInsights.transferableSkills?.length) setSkills2(savedInsights.transferableSkills);
    // Only show insights if they exist, otherwise start empty
    setInsights(savedInsights.insights || []);
  }, []);

  // persist to localStorage on changes
  useEffect(() => {
    const data: InsightsData = {
      companyName,
      website,
      industry,
      duration,
      teamSize,
      summary,
      technicalSkills: skills,
      transferableSkills: skills2,
      insights,
    };
    lsSet(ROOM_KEYS.insights, data);
  }, [companyName, website, industry, duration, teamSize, summary, skills, skills2, insights]);

  // Save current form files to localStorage when files change
  useEffect(() => {
    const saveCurrentFiles = async () => {
      if (files.length > 0) {
        // Convert files to base64 for storage
        const filesData = await Promise.all(
          files.map(async (f) => {
            return new Promise<any>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve({
                  name: f.name,
                  size: f.size,
                  type: f.file.type,
                  data: reader.result as string,
                });
              };
              reader.onerror = () => resolve(null);
              reader.readAsDataURL(f.file);
            });
          })
        );

        const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
          companyName: "",
          website: "",
          industry: "",
          duration: "< 6 months",
          teamSize: "0-10",
          summary: "",
          technicalSkills: [],
          transferableSkills: [],
          insights: [],
        });

        lsSet(ROOM_KEYS.insights, {
          ...saved,
          currentFormFiles: filesData.filter(f => f !== null),
        });
      } else {
        // Clear currentFormFiles if no files
        const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
          companyName: "",
          website: "",
          industry: "",
          duration: "< 6 months",
          teamSize: "0-10",
          summary: "",
          technicalSkills: [],
          transferableSkills: [],
          insights: [],
        });
        if (saved.currentFormFiles) {
          lsSet(ROOM_KEYS.insights, {
            ...saved,
            currentFormFiles: undefined,
          });
        }
      }
    };

    saveCurrentFiles();
  }, [files]);

  // insights creation UI is preserved as design (external route)
  const appendCurrentInsight = async () => {
    const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
      companyName,
      website,
      industry,
      duration,
      teamSize,
      summary,
      technicalSkills: skills,
      transferableSkills: skills2,
      insights: [],
    });
    
    // Convert files to base64 for storage
    const filesData = await Promise.all(
      files.map(async (f) => {
        return new Promise<any>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            resolve({
              name: f.name,
              size: f.size,
              type: f.file.type,
              data: reader.result as string, // base64 data URL
            });
          };
          reader.onerror = () => resolve(null);
          reader.readAsDataURL(f.file);
        });
      })
    );

    const newItem = {
      title: (companyName || '').trim() || 'Untitled',
      description: (summary || '').trim(),
      tag: (industry || '').trim(),
      files: filesData.filter(f => f !== null), // Store file data with the insight
    };
    const next = [...(saved.insights || []), newItem];
    lsSet(ROOM_KEYS.insights, { ...saved, insights: next });
    setInsights(next);
    // Clear files after adding to insight
    setFiles([]);
    // Clear form fields
    setCompanyName("");
    setWebsite("");
    setIndustry("");
    setSummary("");
  };

  const removeSavedInsight = (idx: number) => {
    const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
      companyName,
      website,
      industry,
      duration,
      teamSize,
      summary,
      technicalSkills: skills,
      transferableSkills: skills2,
      insights: [],
    });
    const next = (saved.insights || []).filter((_, i) => i !== idx);
    setInsights(next);
    lsSet(ROOM_KEYS.insights, { ...saved, insights: next });
  };

  // Drag and drop handlers for Technical Skills
  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const newSkills = [...skills];
    const draggedItem = newSkills[dragIndex];
    newSkills.splice(dragIndex, 1);
    newSkills.splice(dropIndex, 0, draggedItem);
    setSkills(newSkills);
  };

  // Drag and drop handlers for Transferable Skills
  const handleDragStart2 = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDrop2 = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const newSkills2 = [...skills2];
    const draggedItem = newSkills2[dragIndex];
    newSkills2.splice(dragIndex, 1);
    newSkills2.splice(dropIndex, 0, draggedItem);
    setSkills2(newSkills2);
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

            {/* Existing Insights (dynamic) */}
            {!!insights.length && (
              <div className="space-y-3">
                {insights.map((it, idx) => (
                  <div key={idx} className="bg-gray-20 bg-[#F9FAFB] border border-gray-100 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-gray-800 mb-1">{it.title}</h3>
                        <p className="text-sm text-gray-500 mb-2">{it.description}</p>
                        <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{it.tag}</span>
                      </div>
                      <div className="text-sm space-y-1">
                        <button className="flex items-center gap-1 text-gray-600 hover:text-black cursor-pointer"
                          onClick={() => routes.push("/insights-overview")}
                        >
                          Continue Editing
                        </button>
                        <div className="flex justify-end">
                          <button className="flex items-center gap-1 text-red-500 hover:text-red-700"
                            onClick={() => removeSavedInsight(idx)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Company Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none"
              />
            </div>

            {/* Website */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
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
                  <option value="">Select industry</option>
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
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
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
              <div className="space-y-3">
                {skills.map((skill, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart(e, i)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, i)}
                    className="group flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-move"
                  >
                    <span className="text-gray-800 text-sm font-medium flex gap-2 items-center cursor-pointer flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-1 truncate">{skill}</span>
                        {skill === "SQL" && (
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
                    </span>
                    
                    {/* Drag Handle */}
                    <div className="flex items-center ml-3 flex-shrink-0">
                      <div className="relative">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                          onMouseEnter={() => setHoveredSkill(skill)}
                          onMouseLeave={() => setHoveredSkill(null)}
                        >
                          <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                        </button>
                        {hoveredSkill === skill && (
                          <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 w-64 p-3 text-sm bg-gray-900 text-white shadow-xl rounded-lg z-50">
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-900 transform rotate-45 -translate-y-1/2"></div>
                            <p className="font-medium mb-1">Drag to reorder</p>
                            <p className="text-gray-300 text-xs leading-relaxed">Move the skills in the order you want and feel free to adjust the skill</p>
                          </div>
                        )}
                      </div>
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
              <div className="space-y-3">
                {skills2.map((skill, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={(e) => handleDragStart2(e, i)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop2(e, i)}
                    className="group flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-move"
                  >
                    <span className="text-gray-800 text-sm font-medium flex gap-2 items-center cursor-pointer flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-1 truncate">{skill}</span>
                        {skill === "Project Management" && (
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
                    </span>
                    
                    {/* Drag Handle */}
                    <div className="flex items-center ml-3 flex-shrink-0">
                      <div className="relative">
                        <button 
                          className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                          onMouseEnter={() => setHoveredSkill2(skill)}
                          onMouseLeave={() => setHoveredSkill2(null)}
                        >
                          <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                        </button>
                        {hoveredSkill2 === skill && (
                          <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 w-64 p-3 text-sm bg-gray-900 text-white shadow-xl rounded-lg z-50">
                            <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-900 transform rotate-45 -translate-y-1/2"></div>
                            <p className="font-medium mb-1">Drag to reorder</p>
                            <p className="text-gray-300 text-xs leading-relaxed">Move the skills in the order you want and feel free to adjust the skill</p>
                          </div>
                        )}
                      </div>
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
                      {file.type === 'image' ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={file.url} alt="preview" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                      ) : file.type === 'video' ? (
                        <video src={file.url} className="w-10 h-10 rounded flex-shrink-0" />
                      ) : (
                        <Image src={Doc} alt="doc" className="w-6 h-5 sm:w-8 sm:h-6 mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                        <p className="text-xs text-gray-500">{file.size}</p>
                        {file.type === 'file' && (
                          <div className="w-full bg-gray-200 h-1.5 rounded mt-2">
                            <div
                              className="bg-blue-500 h-1.5 rounded transition-all duration-300"
                              style={{ width: `${file.progress}%` }}
                            ></div>
                          </div>
                        )}
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

            {/* Add New Insight Button (design preserved) */}
            <Link href="/insights">
              <button
                type="button"
                onClick={appendCurrentInsight}
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
                onClick={() => { appendCurrentInsight(); routes.push("/insight-preview"); }}
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
