"use client"
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import { BsGripVertical } from "react-icons/bs";
import Tool from "@/public/assets/icons/Tooltip.svg"
import check from "@/public/assets/icons/Vector (1).svg"
import Doc from "@/public/assets/icons/doc.svg"
import cut from "@/public/assets/icons/cutt.svg"
import Link from "next/link";
import { lsGet, lsSet, ROOM_KEYS, InsightsData } from "@/app/utils/roomStorage";
import { useGetInsightByIdQuery } from "@/app/store/api/showcaseApi";

const InsightsPage = () => {
  const [skills] = useState(["SQL", "Tableau", "Python", "Power Automate", "DAX", "Power BI"]);
  const [skills2] = useState(["Project Management", "Agile", "Scrum", "Process Improvement", "Communication", "Patience"]);
  const routes = useRouter()
  const params = useSearchParams();
  const roomId = params.get("id") || "";
  const insightId = params.get("insightId") || "";
  const { data: insightData } = useGetInsightByIdQuery(insightId, { skip: !insightId });
  const [files, setFiles] = useState<any[]>([]);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedTransferable, setSelectedTransferable] = useState<string[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [website, setWebsite] = useState("");
  const [industry, setIndustry] = useState("Finance");
  const [duration, setDuration] = useState("< 6 months");
  const [teamSize, setTeamSize] = useState("0-10");
  const [summary, setSummary] = useState("");

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const fileList = Array.from(e.target.files);
    // show immediately
    const uiFiles = fileList.map((file) => ({
      name: file.name,
      size: (file.size / 1024).toFixed(1) + " KB",
      progress: 100,
    }));
    setFiles((prev) => [...prev, ...uiFiles]);

    // persist to localStorage as base64 under currentFormFiles
    const toDataUrl = (file: File) =>
      new Promise<{ name: string; size: number; type: string; data: string }>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () =>
          resolve({ name: file.name, size: file.size, type: file.type, data: reader.result as string });
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

    try {
      const encoded = await Promise.all(fileList.map((f) => toDataUrl(f)));
      const prev = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
      const merged = {
        ...prev,
        currentFormFiles: [...(prev.currentFormFiles || []), ...encoded],
      } as InsightsData;
      lsSet(ROOM_KEYS.insights, merged);
    } catch {}
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
    // also update localStorage currentFormFiles if present
    const prev = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
    if (Array.isArray(prev.currentFormFiles)) {
      const nextFiles = prev.currentFormFiles.filter((_, i) => i !== index);
      lsSet(ROOM_KEYS.insights, { ...prev, currentFormFiles: nextFiles });
    }
  };

  // persist which insight is being edited so publish/upload targets the right id
  useEffect(() => {
    if (insightId) {
      try { window.localStorage.setItem("editingInsightId", insightId); } catch {}
    }
  }, [insightId]);

  // hydrate from backend when insightData loads (original data, not static)
  useEffect(() => {
    if (!insightData) return;
    try {
      const company = insightData.companyName || "";
      const site = insightData.website || "";
      const ind = insightData.industry || "Finance";
      const dur = insightData.duration || "< 6 months";
      const team = insightData.teamSize || "0-10";
      const valSummary = insightData.valueAddedSummary || insightData.summary || "";
      const tech = Array.isArray(insightData.technicalSkills) ? insightData.technicalSkills : [];
      const transf = Array.isArray(insightData.transferableSkills) ? insightData.transferableSkills : [];

      setCompanyName(company);
      setWebsite(site);
      setIndustry(ind);
      setDuration(dur);
      setTeamSize(team);
      setSummary(valSummary);
      setSelectedTech(tech);
      setSelectedTransferable(transf);

      const prev = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
        ...prev,
        companyName: company,
        website: site,
        industry: ind,
        duration: dur,
        teamSize: team,
        summary: valSummary,
        technicalSkills: tech,
        transferableSkills: transf,
      });
    } catch {}
  }, [insightData]);

  // hydrate selected skills
  useEffect(() => {
    const stored = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
    setSelectedTech(Array.isArray(stored.technicalSkills) ? stored.technicalSkills : []);
    setSelectedTransferable(Array.isArray(stored.transferableSkills) ? stored.transferableSkills : []);
    // hydrate form fields
    setCompanyName(stored.companyName || "");
    setWebsite(stored.website || "");
    setIndustry(stored.industry || "Finance");
    setDuration(stored.duration || "< 6 months");
    setTeamSize(stored.teamSize || "0-10");
    setSummary(stored.summary || "");
    // hydrate uploaded files for display only
    if (Array.isArray(stored.currentFormFiles) && stored.currentFormFiles.length) {
      setFiles(
        stored.currentFormFiles.map((f) => ({
          name: f.name,
          size: typeof f.size === "number" ? (f.size / 1024).toFixed(1) + " KB" : f.size,
          progress: 100,
        }))
      );
    }
  }, []);

  // persist on change while preserving other fields
  useEffect(() => {
    const prev = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
      ...prev,
      technicalSkills: selectedTech,
      transferableSkills: selectedTransferable,
    });
  }, [selectedTech, selectedTransferable]);

  // persist form fields
  useEffect(() => {
    const prev = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
      ...prev,
      companyName,
      website,
      industry,
      duration,
      teamSize,
      summary,
    });
  }, [companyName, website, industry, duration, teamSize, summary]);

  const toggleTech = (s: string) => {
    setSelectedTech((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const toggleTransferable = (s: string) => {
    setSelectedTransferable((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };
  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
        <Link href="/showcase-rooms">Showcase rooms </Link>  <span className='text-sm text-gray-500'>/ ...  </span>  <span className="text-gray-800 font-semibold"> / Edit Room</span>
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
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                {/* <AiOutlineCheck className="text-white text-xs" /> */}
                <Image src={check} alt="" />
              </div>
              Introductions
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 flex gap-2">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                 <Image src={check} alt="" />
              </div>
              Competencies
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5 review  text-white text-xs flex items-center justify-center rounded-full border">
                3
              </div> <span className=" text-[#0A0D14] font-inter font-medium text-[14px] leading-[20px] tracking-[-0.006em]">Insights</span></div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none "
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                >
                  <option>Finance</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none "
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                >
                  <option>&lt; 6 months</option>
                  <option>6-12 months</option>
                  <option>1+ year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none "
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
              >
                <option>0-10</option>
                <option>10-25</option>
                <option>25+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summarise the value you added in 3 paragraphs</label>
              <textarea
                rows={4}
                placeholder="Type your message here"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
              <p className="text-xs text-gray-500 mt-1">max 1200 characters (AI will tweak it in the preview)</p>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Technical skills</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills.map((skill) => {
                  const selected = selectedTech.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTech(skill)}
                      className={`w-full text-left flex items-center justify-between text-sm px-4 py-2 rounded-md border ${
                        selected ? "bg-teal-50 border-teal-300" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-gray-800 flex items-center">
                        <span>{skill}</span>
                        {selected}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className=" text-dark-400"><Image src={Tool} alt="" /> </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

             <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Transferable skills</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills2.map((skill) => {
                  const selected = selectedTransferable.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleTransferable(skill)}
                      className={`w-full text-left flex items-center justify-between text-sm px-4 py-2 rounded-md border ${
                        selected ? "bg-teal-50 border-teal-300" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                      }`}
                    >
                      <div className="text-gray-800 flex items-center">
                        <span>{skill}</span>
                        {selected }
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className=" text-dark-400"><Image src={Tool} alt="" /> </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>



                    
     <div className="bg-[#F9FAFB] rounded-md mt-2 p-2">
       <div className="mb-5">
                    <label className="text-sm font-medium text-gray-800 block mb-1">Upload supporting materials (optional)</label>
                    <div className="border border-dashed bg-[#FFFFFF] border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600 h-[150px]">
                      <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="flex">
  Drag & drop file here or{" "}
  <label className="text-blue-600 font-medium cursor-pointer">
    choose file 
    
    <input
      type="file"
      className="hidden"
      multiple
      onChange={handleFileChange}
    />
  </label>
</p>
<p className="text-[#4B5563]">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</p>
                    </div>
                  </div>

     
     <div className="mt-4 space-y-3">
  {files.map((file, index) => (
    <div
      key={index}
      className="flex items-center justify-between   p-3 "
    >
      <div className="flex items-start flex-1 mr-3 gap-3">
        <Image src={Doc} alt="doc" className="w-8 h-6 mt-2" />

        <div className="flex-1">
          <p className="text-sm font-medium text-[#111827]  font-inter leading-5 tracking-normal">{file.name}</p>
          <p className="text-xs text-[#4B5563]">{file.size}</p>

          <div className="w-full bg-gray-200 h-1 rounded mt-2">
            <div
              className="bg-blue-500 h-1 rounded transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={() => removeFile(index)}
        className="ml-2 hover:opacity-80"
      >
        <Image src={cut} alt="remove" className="w-5 h-5" />
      </button>
    </div>
  ))}
 
</div>


   </div>
   <Link href={roomId ? `/edit-overview?id=${roomId}` : "/edit-overview"}> <button
    type="button"
    className="w-full flex  gap-2  border-gray-300 rounded-lg py-3 text-sm font-medium text-[#02ABAC] hover:bg-gray-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-[#02ABAC]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Add a new insight
  </button>
  </Link>



            <div className="mt-6 flex justify-end gap-3">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push(roomId ? `/edit-room1?id=${roomId}` : "/edit-room1")}
              >
                Back
              </button>
              <button className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push(roomId ? `/edit-previiew?id=${roomId}` : "/edit-previiew")}
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
