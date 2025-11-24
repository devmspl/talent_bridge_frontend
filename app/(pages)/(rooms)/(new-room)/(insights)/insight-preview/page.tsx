"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { lsGet, ROOM_KEYS, InsightsData, NewRoomIntro } from "@/app/utils/roomStorage";
import { useCreateDefaultShowcaseRoomMutation } from "@/app/store/api/showcaseApi";

const PortfolioPage = () => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createDefaultRoom, { isLoading: isSavingDraft }] = useCreateDefaultShowcaseRoomMutation();
  const [coreSkills, setCoreSkills] = useState<string[]>([]);
  const [transferableSkills, setTransferableSkills] = useState<string[]>([]);
  const [caseStudies, setCaseStudies] = useState<{ title: string; description: string; tag: string }[]>([]);
  const [roomTitle, setRoomTitle] = useState<string>("Data Analytics Portfolio");
  const [roomSummary, setRoomSummary] = useState<string>("");
  const [companyName, setCompanyName] = useState<string>("");
  const [industry, setIndustry] = useState<string>("");
  const [coverDataUrl, setCoverDataUrl] = useState<string | null>(null);
  const [videoDataUrl, setVideoDataUrl] = useState<string | null>(null);
  const [insightFiles, setInsightFiles] = useState<File[]>([]);


  useEffect(() => {
    const intro = lsGet<any>(ROOM_KEYS.intro, { roomName: "Data Analytics Portfolio", roomSummary: "", role: "" });
    setRoomTitle(intro.roomName || "Data Analytics Portfolio");
    setRoomSummary(intro.roomSummary || "");
    if (intro.coverImageDataUrl) setCoverDataUrl(intro.coverImageDataUrl as string);
    if (intro.videoDataUrl) setVideoDataUrl(intro.videoDataUrl as string);

    const insights = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
    setCoreSkills(insights.technicalSkills || []);
    setTransferableSkills(insights.transferableSkills || []);

    let perKey: { title: string; description: string; tag: string }[] = [];
    try {
      const keys = Object.keys(window.localStorage || {}).filter(k => /^insight_\d+$/.test(k));
      const sorted = keys.sort((a,b)=> parseInt(a.split('_')[1]||'0',10) - parseInt(b.split('_')[1]||'0',10));
      perKey = sorted.map(k => {
        try { const v = JSON.parse(window.localStorage.getItem(k) || 'null'); return { title: v?.title || '', description: v?.description || '', tag: v?.tag || '' }; } catch { return { title: '', description: '', tag: '' }; }
      }).filter(x => x.title || x.description || x.tag);
    } catch {}
    const list = perKey.length ? perKey : (insights.insights || []).map(i => ({ title: i.title, description: i.description, tag: i.tag }));
    setCaseStudies(list);
    setCompanyName(insights.companyName || "");
    setIndustry(insights.industry || "");
  }, []);

  const handleDeleteInsight = (index: number) => {
    const next = caseStudies.filter((_, i) => i !== index);
    setCaseStudies(next);
    // persist to localStorage
    const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
      companyName: companyName,
      website: "",
      industry: industry,
      duration: "< 6 months",
      teamSize: "0-10",
      summary: roomSummary,
      technicalSkills: coreSkills,
      transferableSkills: transferableSkills,
      insights: [],
    });
    const persisted = { ...saved, insights: next };
    localStorage.setItem(ROOM_KEYS.insights, JSON.stringify(persisted));
  };

  const handleSaveDraft = async () => {
    try {
      const intro = lsGet<any>(ROOM_KEYS.intro, {
        roomName: "",
        roomSummary: "",
        role: "",
        qualification: undefined,
        coverImageDataUrl: undefined,
        videoDataUrl: undefined,
      });
      const insights = lsGet<InsightsData>(ROOM_KEYS.insights, {
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
      const coreCompetencies = lsGet<string[]>(ROOM_KEYS.competencies, []);

      const body = {
        showcaseRoomName: intro.roomName || "Untitled",
        showcaseRoomSummary: intro.roomSummary || "",
        coverImage: intro.coverImageDataUrl || undefined,
        videoIntro: intro.videoDataUrl || undefined,
        role: intro.role || "",
        qualification: intro.qualification || undefined,
        coreCompetencies: Array.isArray(coreCompetencies) ? coreCompetencies : [],
        insightsId: [
          {
            companyName: insights.companyName || "",
            website: insights.website || "",
            industry: insights.industry || "",
            duration: insights.duration || "",
            teamSize: insights.teamSize || "",
            valueAddedSummary: insights.summary || "",
            technicalSkills: insights.technicalSkills || [],
            transferableSkills: insights.transferableSkills || [],
            insightsFile: [],
          },
        ],
      } as any;

      await createDefaultRoom(body).unwrap();
      alert("Draft saved successfully.");
    } catch (e: any) {
      alert(e?.data?.message || "Failed to save draft.");
    }
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
            className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm font-medium disabled:opacity-60"
            onClick={handleSaveDraft}
            disabled={isSavingDraft}
          >
            {isSavingDraft ? "Saving..." : "Save as draft"}
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        
        {/* Profile Header - Responsive */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{roomTitle || "Portfolio"}</h2>
              {companyName && (
                <p className="text-gray-700 text-sm mt-1">{companyName}{industry ? ` • ${industry}` : ''}</p>
              )}
              
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
              {coverDataUrl ? (
                // show uploaded cover image
                // eslint-disable-next-line @next/next/no-img-element
                <img src={coverDataUrl} alt="Cover Image" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No Cover Image</p>
                </div>
              )}
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
              {videoDataUrl ? (
                <video src={videoDataUrl} controls className="w-full h-full rounded-lg" />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>No Cover Video</p>
                </div>
              )}
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
              {coreSkills.length > 0 ? coreSkills.map((skill, index) => (
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
              )) :
              <div>
                <p>No Technical Skills</p>
              </div>
              }
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
            {/* <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            </div> */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  {transferableSkills.length > 0 ? transferableSkills.map((skill, index) => (
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
  )) : (
    <div>
      <p>No Technical Skills</p>
    </div>
  )}
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
              <div key={index} className={`${["bg-[#FFF7ED]","bg-[#F9FAFB]","bg-[#F0F8FF]","bg-[#EEF2FF]","bg-[#F0FDFA]","bg-[#FDF2F8]"][index % 6]} border border-gray-100 rounded-lg p-4 sm:p-6`}>
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
                      onClick={() => handleDeleteInsight(index)}
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
      
      <PublishModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} insightFiles={insightFiles} />
    </>
  );
};

export default PortfolioPage;
