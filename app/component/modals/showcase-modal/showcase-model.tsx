"use client";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import tick from "@/public/assets/tick.svg";
import Image from "next/image";
import { useCreateShowcaseRoomWithInsightsMutation, useUploadShowcaseCoverMutation, useUploadShowcaseVideoMutation, useUpdateShowcaseRoomMutation, useGetShowcaseRoomByIdQuery, useUploadInsightFilesMutation } from "@/app/store/api/showcaseApi";
import { lsGet, ROOM_KEYS, InsightsData, NewRoomIntro, clearRoomData } from "@/app/utils/roomStorage";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

export default function PublishModal({
  isOpen,
  onClose,
   insightFiles,
}: {
  isOpen: boolean;
  onClose: () => void;
  insightFiles: File[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const roomId = params.get("id") || "";
  const [checked, setChecked] = useState(false);
  const [visibility, setVisibility] = useState("All Recruiters");
  const [isPublishing, setIsPublishing] = useState(false);
  const userId = Cookies.get("tb_userId");

  const [createShowcaseRoom, { isLoading }] = useCreateShowcaseRoomWithInsightsMutation();
  const [uploadCover] = useUploadShowcaseCoverMutation();
  const [uploadVideo] = useUploadShowcaseVideoMutation();
  const [updateRoom] = useUpdateShowcaseRoomMutation();
  const [uploadInsightFiles] = useUploadInsightFilesMutation();
  
  const { data: existingRoom } = useGetShowcaseRoomByIdQuery(roomId, { skip: !roomId });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handlePublish = async () => {
    if (!checked || !userId) {
      toast.error("Please confirm that you have reviewed the showcase", { autoClose: 4000 });
      return;
    }
    
    // Get data from localStorage first to validate
    const intro = lsGet<NewRoomIntro & { coverImageDataUrl?: string; videoDataUrl?: string }>(
      ROOM_KEYS.intro,
      {
        roomName: "",
        roomSummary: "",
        role: "",
        qualification: undefined,
      }
    );
    
    // Validate room name
    if (!intro.roomName || intro.roomName.trim() === '') {
      toast.error("ShowcaseRoom name is required", { autoClose: 4000 });
      return;
    }

    setIsPublishing(true);
    const toastId = toast.loading("Publishing your showcase...", { 
      position: "top-center",
      autoClose: false,
      closeButton: false,
      closeOnClick: false,
      draggable: false,
      pauseOnHover: false
    });
    
    try {

      const competencies = lsGet<string[]>(ROOM_KEYS.competencies, []);

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

      // Gather per-insight items saved under insight_1, insight_2, ... (with their own files)
      let perKeyItems: Array<{ title: string; description: string; tag: string; files?: Array<{ name: string; size: number | string; type: string; data: string; }> }> = [];
      try {
        const keys = Object.keys(window.localStorage || {}).filter((k) => /^insight_\d+$/.test(k));
        const sorted = keys.sort((a, b) => (parseInt(a.split('_')[1] || '0', 10) - parseInt(b.split('_')[1] || '0', 10)));
        perKeyItems = sorted.map((k) => {
          try { return JSON.parse(window.localStorage.getItem(k) || 'null') || null; } catch { return null as any; }
        }).filter(Boolean);
      } catch {}

      // Helper: convert CurrentFormFile[] -> File[]
      const toFiles = async (arr: Array<{ name: string; size: number | string; type: string; data: string; }> = []): Promise<File[]> => {
        const out: File[] = [];
        for (const ef of arr) {
          try {
            const resp = await fetch(ef.data);
            const blob = await resp.blob();
            out.push(new File([blob], ef.name || 'supporting-file', { type: (ef as any)?.type || blob.type || 'application/octet-stream' }));
          } catch {}
        }
        return out;
      };

      // Build per-insight files array if perKeyItems available, else fallback to single list from current form
      let perInsightFiles: File[][] = [];
      if (perKeyItems.length) {
        for (const item of perKeyItems) {
          const files = await toFiles(item?.files as any);
          perInsightFiles.push(files);
        }
      }

      // Fallback single bucket from temporary currentFormFiles (legacy flow)
      const encodedFiles = Array.isArray((insights as any).currentFormFiles)
        ? ((insights as any).currentFormFiles as Array<{ name: string; size: number; type: string; data: string }>)
        : [];
      const localFiles: File[] = await toFiles(encodedFiles as any);
      const filesToUpload: File[] = (insightFiles && insightFiles.length ? insightFiles : []).concat(localFiles);

    
      // Build insights payload: prefer perKeyItems if present; else fallback to saved array or current form
      const insightsArray = perKeyItems.length
        ? perKeyItems.map((it: any) => ({
            companyName: it?.title || insights.companyName || "",
            website: insights.website || "",
            industry: it?.tag || insights.industry || "",
            duration: insights.duration || "< 6 months",
            teamSize: insights.teamSize || "0-10",
            valueAddedSummary: it?.description || insights.summary || "",
            technicalSkills: insights.technicalSkills || [],
            transferableSkills: insights.transferableSkills || [],
            insightsFile: [],
          }))
        : (insights.insights && insights.insights.length > 0
            ? insights.insights.map((insight: any) => ({
                companyName: insight.title || insights.companyName || "",
                website: insights.website || "",
                industry: insight.tag || insights.industry || "",
                duration: insights.duration || "< 6 months",
                teamSize: insights.teamSize || "0-10",
                valueAddedSummary: insight.description || insights.summary || "",
                technicalSkills: insights.technicalSkills || [],
                transferableSkills: insights.transferableSkills || [],
                insightsFile: [],
              }))
            : [
                {
                  companyName: insights.companyName || "",
                  website: insights.website || "",
                  industry: insights.industry || "",
                  duration: insights.duration || "< 6 months",
                  teamSize: insights.teamSize || "0-10",
                  valueAddedSummary: insights.summary || "",
                  technicalSkills: insights.technicalSkills || [],
                  transferableSkills: insights.transferableSkills || [],
                },
              ]
          );

    
      if (roomId) {

        if ((intro as any)?.coverImageDataUrl) {
          try {
            const src: string = (intro as any).coverImageDataUrl as string;
            const res = await fetch(src);
            const blob = await res.blob();
            const file = new File([blob], "cover-image" + (blob.type.startsWith("image/") ? `.${blob.type.split("/")[1]}` : ".png"), { type: blob.type || "image/png" });
            await uploadCover({ id: String(roomId), file }).unwrap();
          } catch {}
        }
        if ((intro as any)?.videoDataUrl) {
          try {
            const vsrc: string = (intro as any).videoDataUrl as string;
            const vres = await fetch(vsrc);
            const vblob = await vres.blob();
            const vfile = new File([vblob], "intro-video" + (vblob.type.startsWith("video/") ? `.${vblob.type.split("/")[1]}` : ".mp4"), { type: vblob.type || "video/mp4" });
            await uploadVideo({ id: String(roomId), file: vfile }).unwrap();
          } catch {}
        }
        // Prepare update body (no userId required by update)
        const updateBody: any = {
          showcaseRoomName: intro.roomName || "",
          showcaseRoomSummary: intro.roomSummary || "",
          role: intro.role || "", 
          qualification: intro.qualification || "",
          coreCompetencies: competencies || [],
          insightsId: insightsArray,
        };
        await updateRoom({ id: String(roomId), body: updateBody }).unwrap();

        // After update, upload supporting files per insight if available
        try {
          // If editing a single insight (from case-study), prioritize direct upload using editingInsightId
          try {
            const eid = typeof window !== 'undefined' ? (window.localStorage.getItem('editingInsightId') || '') : '';
            if (eid && Array.isArray(insightFiles) && insightFiles.length) {
              await uploadInsightFiles({ id: String(eid), files: insightFiles }).unwrap();
            }
          } catch {}
          const existingInsightsArr = (existingRoom as any)?.insightsId || [];
          if (Array.isArray(existingInsightsArr) && existingInsightsArr.length && perInsightFiles.length) {
            const count = Math.min(existingInsightsArr.length, perInsightFiles.length);
            for (let i = 0; i < count; i++) {
              const iid = (existingInsightsArr[i] as any)?._id || (existingInsightsArr[i] as any)?.id || existingInsightsArr[i];
              const files = perInsightFiles[i] || [];
              if (iid && files.length) {
                await uploadInsightFiles({ id: String(iid), files }).unwrap();
              }
            }
          } else {
            // Fallback to single bucket upload to the first insight
            const existingInsightId = (existingRoom as any)?.insightsId?.[0]?._id || (existingRoom as any)?.insightsId?.[0];
            if (existingInsightId && filesToUpload.length > 0) {
              await uploadInsightFiles({ id: String(existingInsightId), files: filesToUpload }).unwrap();
            }
          }
        } catch {}
        onClose();
        router.push(`/room-details?id=${roomId}`);
        return;
      }

      // Else: CREATE new room
      const payload = {
        userId: userId,
        showcaseRoomName: intro.roomName || "",
        showcaseRoomSummary: intro.roomSummary || "",
        role: intro.role || "",
        qualification: intro.qualification || "",
        coreCompetencies: competencies || [],
        insightsId: insightsArray,
      };

    const response = await createShowcaseRoom(payload).unwrap();
    const createdId = response?._id || response?.id || response?.data?._id || response?.data?.id;
    const createdInsights = response?.insightsId || response?.data?.insightsId || [];

    try {
      const createdInsightsArr = createdInsights || [];
      if (Array.isArray(createdInsightsArr) && createdInsightsArr.length && perInsightFiles.length) {
        const count = Math.min(createdInsightsArr.length, perInsightFiles.length);
        for (let i = 0; i < count; i++) {
          const iid = (createdInsightsArr[i] as any)?._id || (createdInsightsArr[i] as any)?.id || createdInsightsArr[i];
          const files = perInsightFiles[i] || [];
          if (iid && files.length) {
            await uploadInsightFiles({ id: String(iid), files }).unwrap();
          }
        }
      } else {
        const createdInsightId = (Array.isArray(createdInsightsArr) && createdInsightsArr.length)
          ? (createdInsightsArr[0] as any)?._id || (createdInsightsArr[0] as any)?.id || createdInsightsArr[0]
          : undefined;
        if (createdInsightId && filesToUpload.length > 0) {
          await uploadInsightFiles({ id: String(createdInsightId), files: filesToUpload }).unwrap();
        }
      }
    } catch {}

    if (createdId && (intro as any)?.coverImageDataUrl) {
      try {
        const src: string = (intro as any).coverImageDataUrl as string;
        let blob: Blob;
        if (src.startsWith("data:")) {
          const res = await fetch(src);
          blob = await res.blob();
        } else if (src.startsWith("blob:")) {
          blob = await (await fetch(src)).blob();
        } else {
          const res = await fetch(src);
          blob = await res.blob();
        }
        const file = new File([blob], "cover-image" + (blob.type.startsWith("image/") ? `.${blob.type.split("/")[1]}` : ".png"), { type: blob.type || "image/png" });
        await uploadCover({ id: String(createdId), file }).unwrap();
      } catch {}
    }
    if (createdId && (intro as any)?.videoDataUrl) {
      try {
        const vsrc: string = (intro as any).videoDataUrl as string;
        const vres = await fetch(vsrc);
        const vblob = await vres.blob();
        const vfile = new File([vblob], "intro-video" + (vblob.type.startsWith("video/") ? `.${vblob.type.split("/")[1]}` : ".mp4"), { type: vblob.type || "video/mp4" });
        await uploadVideo({ id: String(createdId), file: vfile }).unwrap();
      } catch {}
    }
    // If editing a single insight (from case-study), also upload those selected files to that insight id
    try {
      const eid = typeof window !== 'undefined' ? (window.localStorage.getItem('editingInsightId') || '') : '';
      if (eid && Array.isArray(insightFiles) && insightFiles.length) {
        await uploadInsightFiles({ id: String(eid), files: insightFiles }).unwrap();
      }
    } catch {}
    try { clearRoomData(); } catch {}
    
    // Show success message
    toast.success("Showcase published successfully!", { autoClose: 4000 });
    onClose();
    router.push(`/room-details?id=${createdId ?? ""}`);
  } catch (error: any) {
    console.error("Failed to publish showcase room:", error);
    let errorMessage = "Failed to publish showcase room. Please try again.";
    if (error?.data?.message) {
      if (Array.isArray(error.data.message)) {
        errorMessage = error.data.message.join(", ");
      } else {
        errorMessage = error.data.message;
      }
    } else if (error?.message) {
      errorMessage = error.message;
    }
    toast.error(errorMessage, { autoClose: 4000 });
  } finally {
    setIsPublishing(false);
    // Dismiss the loading toast if it's still active
    toast.dismiss(toastId);
  }

  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/30 backdrop-blur-sm z-50 p-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 sm:top-6 right-4 text-gray-400 hover:text-gray-700 cursor-pointer transition p-1"
        >
          <IoMdClose size={20} />
        </button>

        {/* Title */}
        <div className="pr-8 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Publish Showcase Room
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Are you sure you want to publish this showcase room? You can always
            come back to edit/update your information.
          </p>
        </div>

        {/* Dropdown */}
        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Set room visibility
          </label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          >
            <option>All Recruiters</option>
            <option>Connected Only</option>
            <option>Private</option>
          </select>
        </div> */}

        <div className="mb-4 relative">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Set room visibility
  </label>

  <div className="relative">
    <select
      value={visibility}
      onChange={(e) => setVisibility(e.target.value)}
      className="
        w-full border border-gray-300 rounded-lg 
        px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base 
        text-gray-700 focus:outline-none focus:ring-2 
        focus:ring-teal-500 focus:border-teal-500
    
        appearance-none /* 👉 Removes default dropdown arrow */
      "
    >
      <option>All Recruiters</option>
      <option>Connected Only</option>
      <option>Private</option>
    </select>

    {/* 👉 Custom SVG Dropdown Icon */}
    <svg
      className="w-5 h-5 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
    </svg>
  </div>
</div>


        {/* Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer relative">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                type="checkbox"
                checked={checked}
                onChange={() => setChecked(!checked)}
                className="peer h-4 w-4 sm:h-5 sm:w-5 rounded border-2 border-gray-300 checked:border-teal-500 checked:bg-teal-50 appearance-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-0"
              />
              <Image
                src={tick}
                alt="tick"
                className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 hidden peer-checked:block h-2 w-2 sm:h-3 sm:w-3"
              />
            </div>
            <span className="leading-relaxed">
              I confirm I have gone through this showcase and it's good to go
            </span>
          </label>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto border border-gray-300 rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer transition text-sm sm:text-base"
          >
            Cancel
          </button>
          <button
            disabled={!checked || isPublishing || isLoading}
            onClick={handlePublish}
            className={`w-full sm:w-auto rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-white transition text-sm sm:text-base flex items-center justify-center gap-2 ${
              checked && !isPublishing && !isLoading
                ? "review hover:bg-teal-600 shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {(isPublishing || isLoading) ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Publishing...
              </>
            ) : "Yes, publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
