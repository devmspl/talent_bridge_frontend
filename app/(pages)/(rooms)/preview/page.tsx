"use client";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import call from "@/public/assets/icons/call.svg";
import msg from "@/public/assets/icons/msgg.svg";
import share from "@/public/assets/icons/share.svg";
import up from "@/public/assets/icons/up-arrow.svg";
import logo from "@/public/assets/icons/logo.svg";
import Link from "next/link";
import { useGetShowcaseRoomByIdQuery } from "@/app/store/api/showcaseApi";
import { BaseUrl } from "@/app/store/BaseUrl";

export default function PreviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id") || "";
  
  const { data } = useGetShowcaseRoomByIdQuery(id, { skip: !id });

  


  const title = data?.showcaseRoomName || "";
  const summary = data?.showcaseRoomSummary || "";
  const qualifications = useMemo(() => {
    const q = (typeof data?.qualification === 'string' ? data.qualification : '').trim();
    if (!q) return [] as string[];
    return q.split(',').map((s: string) => s.trim()).filter(Boolean);
  }, [data]);

  const resolveMediaSrc = (src?: string, kind?: "image" | "video") => {
    if (!src) return "";
    if (src.startsWith("data:") || src.startsWith("blob:")) return src;
    if (/^https?:\/\//.test(src)) return src;
    const clean = src.replace(/^\/+/, "");
    const alreadyPrefixed = clean.startsWith("assets/images/") || clean.startsWith("assets/videos/");
    const trimmedBase = BaseUrl.replace(/\/$/, "");
    if (alreadyPrefixed) return `${trimmedBase}/${clean}`;
    const ext = (clean.split(".").pop() || "").toLowerCase();
    const guessImage = ["jpg","jpeg","png","gif","webp","svg"].includes(ext);
    const guessVideo = ["mp4","webm","mov","avi","mkv"].includes(ext);
    const isVideo = kind === "video" || (kind !== "image" && guessVideo);
    const isImage = kind === "image" || (!isVideo && guessImage);
    const base = isImage ? "assets/images/" : isVideo ? "assets/videos/" : "";
    return `${trimmedBase}/${base}${clean}`;
  };
  const technicalSkills: string[] = useMemo(() => {
    const ins = Array.isArray(data?.insightsId) && data.insightsId.length ? data.insightsId[0] : null;
    if (ins?.technicalSkills && ins.technicalSkills.length) return ins.technicalSkills;
    return [] as string[];
  }, [data]);
  const transferableSkills: string[] = useMemo(() => {
    const ins = Array.isArray(data?.insightsId) && data.insightsId.length ? data.insightsId[0] : null;
    if (ins?.transferableSkills && ins.transferableSkills.length) return ins.transferableSkills;
    return [] as string[];
  }, [data]);
  const insights = useMemo(() => {
    const list = Array.isArray(data?.insightsId) ? data.insightsId : [];
    if (!list.length) return [] as any[];
    return list.map((it: any, i: number) => ({
      id: i + 1,
      title: it.companyName,
      description: it.valueAddedSummary,
      tag: it.industry,
      bgColor: i % 2 === 0 ? "bg-[#FFF7ED]" : "bg-[#F9FAFB]",
      tagColor: i % 2 === 0 ? "bg-[#FFFBEB]" : "bg-[#F9FAFB]",
      tagTextColor: i % 2 === 0 ? "text-[#B45309]" : "text-[#374151]",
      tagBorderColor: i % 2 === 0 ? "border-[#FDE68A]" : "border-[#E5E7EB]",
    }));
  }, [data]);

  return (
    <>
      <div className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          
          {/* Profile Header Section */}
          <div className="bg-white rounded-[10px] border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1">
                {title && (
                  <h1 className="text-xl sm:text-2xl lg:text-[24px] font-bold text-[#111827] mb-2">{title}</h1>
                )}
                {summary && (
                  <p className="text-sm sm:text-base text-[#4B5563] mb-2">{summary}</p>
                )}
                {qualifications.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <span className="text-sm sm:text-base lg:text-[16px] text-[#4B5563]">Qualifications:</span>
                    {qualifications.map((q: string, i: number) => (
                      <span key={i} className="bg-gray-100 px-2 sm:px-3 py-1 rounded-[20px] text-xs sm:text-[12px] text-[#374151]">{q}</span>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex gap-2 sm:gap-3">
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={call} alt="" />
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={msg} alt="" />
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={share} alt="" />
              </div>
            </div>
          </div>

          {/* Intro Video / Cover Section */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="relative w-full h-auto rounded-lg overflow-hidden">
              {data?.videoIntro ? (
                <video
                  src={resolveMediaSrc(data.videoIntro, "video")}
                  controls
                  className="w-full max-h-[480px] rounded-lg"
                />
              ) : (
                data?.coverImage ? (
                  <div className="relative w-full h-48 sm:h-64 md:h-80 lg:h-96">
                    {(() => {
                      const src: string = resolveMediaSrc(data.coverImage, "image");
                      if (src.startsWith("data:") || src.startsWith("blob:")) {
                        return <img src={src} alt="Cover" className="w-full h-full object-cover" />;
                      }
                      return <Image src={src} alt="Cover" className="w-full h-full object-cover" fill unoptimized />;
                    })()}
                  </div>
                ) : null
              )}
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
                {technicalSkills.length > 0 && technicalSkills.map((skill, index) => (
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
                {transferableSkills.length > 0 && transferableSkills.map((skill, index) => (
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
              {insights.length > 0 && insights.map((insight: any, idx: number) => (
                <div key={insight.id} className={`${insight.bgColor} rounded-[10px] p-4`}>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#111827] mb-1 text-sm sm:text-base">{insight.title}</h4>
                      <p className="text-xs sm:text-sm text-[#4B5563] mb-2">{insight.description}</p>
                      <span className={`text-xs ${insight.tagColor} ${insight.tagTextColor} ${insight.tagBorderColor} px-2 py-1 rounded-full border`}>
                        {insight.tag}
                      </span>
                    </div>
                    <Link href={`/preview/view?id=${id}&ins=${idx}`}>
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

