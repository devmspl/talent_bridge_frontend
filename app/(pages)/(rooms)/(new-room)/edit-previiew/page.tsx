"use client";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import Tool from "@/public/assets/icons/Tooltip.svg";
import delete_i from "@/public/assets/icons/delete.svg";
import edit from "@/public/assets/icons/text.svg";
import Link from "next/link";
import PublishModal from "@/app/component/modals/showcase-modal/showcase-model";
import cover from "@/public/assets/image cover.svg";
import { lsGet, ROOM_KEYS, InsightsData, NewRoomIntro } from "@/app/utils/roomStorage";
import { BaseUrl } from "@/app/store/BaseUrl";
import { useUpdateShowcaseRoomMutation, useUploadShowcaseCoverMutation, useUploadShowcaseVideoMutation, useGetShowcaseRoomByIdQuery } from "@/app/store/api/showcaseApi";

const PortfolioPage = () => {
  const router = useRouter();
  const params = useSearchParams();
  const roomId = params.get("id") || "";
  const { data: existingRoom } = useGetShowcaseRoomByIdQuery(roomId, { skip: !roomId });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updateRoom, { isLoading: isUpdating }] = useUpdateShowcaseRoomMutation();
  const [uploadCover] = useUploadShowcaseCoverMutation();
  const [uploadVideo] = useUploadShowcaseVideoMutation();

  // read edited values from localStorage
  const intro = lsGet<NewRoomIntro & { coverImageDataUrl?: string | null; videoDataUrl?: string | null }>(ROOM_KEYS.intro, {
    roomName: "",
    roomSummary: "",
    role: "",
    qualification: undefined,
    coverImageDataUrl: null,
    videoDataUrl: null,
  });
  const competencies = lsGet<string[]>(ROOM_KEYS.competencies, []);
  const insightsData = lsGet<InsightsData>(ROOM_KEYS.insights,
  {
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

  const resolveImageSrc = (src?: string | null) => {
    if (!src) return "";
    const trimmedBase = BaseUrl.replace(/\/$/, "");
    if (src.startsWith("data:") || src.startsWith("blob:")) return src;
    if (/^https?:\/\//.test(src)) return src;
    if (src.startsWith("/")) return `${trimmedBase}${src}`;
    return `${trimmedBase}/${src}`;
  };

  const buildBody = () => {
    const body: any = {
      showcaseRoomName: intro.roomName || "Untitled",
      showcaseRoomSummary: intro.roomSummary || "",
      role: intro.role || "",
      qualification: intro.qualification || undefined,
      coreCompetencies: Array.isArray(competencies) ? competencies : [],
      insightsId: [
        {
          companyName: insightsData.companyName || "",
          website: insightsData.website || "",
          industry: insightsData.industry || "",
          duration: insightsData.duration || "",
          teamSize: insightsData.teamSize || "",
          valueAddedSummary: insightsData.summary || "",
          technicalSkills: insightsData.technicalSkills || [],
          transferableSkills: insightsData.transferableSkills || [],
        },
      ],
    };
    return body;
  };

  const dataUrlToFile = async (src: string, fallbackName: string): Promise<File> => {
    if (src.startsWith("data:")) {
      const arr = src.split(",");
      const mimeMatch = arr[0].match(/:(.*?);/);
      const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) u8arr[n] = bstr.charCodeAt(n);
      const ext = mime.split("/")[1] || "bin";
      return new File([u8arr], `${fallbackName}.${ext}`, { type: mime });
    }
    // blob URL
    const res = await fetch(src);
    const blob = await res.blob();
    const mime = blob.type || "application/octet-stream";
    const ext = (mime.split("/")[1] || "bin").split(";")[0];
    return new File([blob], `${fallbackName}.${ext}`, { type: mime });
  };

  const uploadMediaIfNeeded = async () => {
    // Upload cover if it's a local data/blob
    if (intro.coverImageDataUrl && (intro.coverImageDataUrl.startsWith("data:") || intro.coverImageDataUrl.startsWith("blob:"))) {
      try {
        const file = await dataUrlToFile(intro.coverImageDataUrl, "cover");
        await uploadCover({ id: roomId, file }).unwrap();
      } catch {}
    }
    // Upload video if it's a local data/blob
    if (intro.videoDataUrl && (intro.videoDataUrl.startsWith("data:") || intro.videoDataUrl.startsWith("blob:"))) {
      try {
        const file = await dataUrlToFile(intro.videoDataUrl, "intro");
        await uploadVideo({ id: roomId, file }).unwrap();
      } catch {}
    }
  };

  const saveDraft = async () => {
    if (!roomId) return alert("Missing room id");
    try {
      await uploadMediaIfNeeded();
      await updateRoom({ id: roomId, body: buildBody() }).unwrap();
      alert("Draft saved");
    } catch (e: any) {
      alert(e?.data?.message || "Failed to save draft");
    }
  };

  const publish = async () => {
    if (!roomId) return alert("Missing room id");
    try {
      await uploadMediaIfNeeded();
      await updateRoom({ id: roomId, body: buildBody() }).unwrap();
      setIsModalOpen(true);
    } catch (e: any) {
      alert(e?.data?.message || "Failed to publish");
    }
  };

  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
          <Link href="/showcase-rooms">Showcase rooms </Link> <span className='text-sm text-gray-500'>/ ...  </span>  <span className="text-gray-800 font-semibold"> / Edit Room</span>
        </div>
        <div className="flex gap-2">
          <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer disabled:opacity-60"
            disabled={!roomId || isUpdating}
            onClick={saveDraft}
          >
            {isUpdating ? 'Saving...' : 'Save as draft'}
          </button>
        </div>
      </div>
      <div className="min-h-screen bg-white px-6 py-6">

        <div className="bg-white rounded-xl border border-[#E5E7EB] p-6 mb-6 flex justify-between items-start">
          <div>
            <h2 className="text-xl font-semibold">{intro.roomName || "Untitled"}</h2>
            {!!intro.roomSummary && (
              <p className="text-gray-700 text-sm mt-1">{intro.roomSummary}</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
              {(competencies || []).slice(0,5).map((skill, i) => (
                <span key={i} className="bg-gray-100 px-2 py-1 rounded text-xs">{skill}</span>
              ))}
            </div>
          </div>

          <div className="flex gap-[8px] mt-3 ">
            <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-7 h-7  " src={call} alt=""  />
            <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-7 h-7  " src={msg} alt="" />
            <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-7 h-7  " src={share} alt=""  />
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E5E7EB]  mb-6">
          <div className="mb-2 p-[20px]">
            <div className="flex justify-between items-center ">
              <h3 className="font-inter font-semibold text-[#111827]">Cover Image</h3>
              <span>
                <Image src={delw} alt="" />
              </span>
            </div>
          </div>
          <div className="border-b border-gray-300 mt-1 "></div>
          <div className="relative w-full rounded-lg overflow-hidden mt-4 p-6">
            {intro.coverImageDataUrl ? (
              intro.coverImageDataUrl.startsWith("data:") || intro.coverImageDataUrl.startsWith("blob:") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={intro.coverImageDataUrl} alt="Cover" className="w-full max-h-[457px] object-cover rounded-lg" />
              ) : (
                <Image
                  src={resolveImageSrc(intro.coverImageDataUrl)}
                  alt="Cover"
                  className="w-full h-auto max-h-[457px] object-cover rounded-lg"
                  width={1600}
                  height={900}
                  unoptimized
                />
              )
            ) : (
              <Image src={cover} alt="Cover placeholder" className="w-full h-full object-cover rounded-lg" />
            )}
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
          <div className="relative w-full rounded-lg overflow-hidden mt-4 p-6">
            {intro.videoDataUrl ? (
              // Use native video for both blob and http sources
              <video src={intro.videoDataUrl} controls className="w-full max-h-[457px] rounded-lg" />
            ) : (
              <Image src={introvid} alt="Intro Video" className="w-full h-full object-cover rounded-lg" />
            )}
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
              {(insightsData.technicalSkills?.length ? insightsData.technicalSkills : competencies).map((skill, index) => (
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
              {(insightsData.transferableSkills?.length ? insightsData.transferableSkills : competencies).map((skill, index) => (
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
            {(insightsData.insights || []).map((item, index) => (
              <div key={index} className={`bg-[#F9FAFB] border border-gray-100 rounded-lg p-6`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-800 mb-1">{item.title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{item.description}</p>
                    {item.tag && (
                      <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{item.tag}</span>
                    )}
                  </div>
                  <div className="text-sm text-red-500 space-y-1">
                    <div>
                      <Link href={`case-study?title=${encodeURIComponent(item.title)}&description=${encodeURIComponent(item.description)}&tag=${encodeURIComponent(item.tag || "")}${roomId ? `&id=${encodeURIComponent(roomId)}` : ""}${existingRoom?.insightsId?.[index] ? `&insightId=${encodeURIComponent((existingRoom.insightsId[index]?._id || existingRoom.insightsId[index]?.id || existingRoom.insightsId[index]) as string)}` : ""}`}>
                        <button className="flex items-center gap-1 text-gray-600 hover:text-black cursor-pointer">
                          <Image src={edit} alt="" width={16} />
                          Continue Editing
                        </button>
                      </Link>
                    </div>
                    <div className="flex justify-end">
                      <button
                        className="flex items-center gap-1 hover:text-red-700 hover:cursor-pointer"
                        onClick={() => { /* no-op in preview */ }}
                      >
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
            onClick={() => router.push(roomId ? `/edit-insights?id=${roomId}` : "/edit-insights")}
          >
            Back
          </button>
          <button onClick={publish} className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer disabled:opacity-60" disabled={!roomId || isUpdating}>
            {isUpdating ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>
      <PublishModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} insightFiles={[]} />
    </>
  );
};

export default PortfolioPage;
