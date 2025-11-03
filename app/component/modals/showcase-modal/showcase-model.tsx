"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import tick from "@/public/assets/tick.svg";
import Image from "next/image";
import { useCreateShowcaseRoomWithInsightsMutation, useUploadShowcaseCoverMutation, useUploadShowcaseVideoMutation, useUploadInsightFileMutation } from "@/app/store/api/showcaseApi";
import { lsGet, ROOM_KEYS, InsightsData, NewRoomIntro } from "@/app/utils/roomStorage";
import Cookies from "js-cookie";

export default function PublishModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [visibility, setVisibility] = useState("All Recruiters");
  const [isPublishing, setIsPublishing] = useState(false);
  const userId = Cookies.get("tb_userId");

  const [createShowcaseRoom, { isLoading }] = useCreateShowcaseRoomWithInsightsMutation();
  const [uploadCover] = useUploadShowcaseCoverMutation();
  const [uploadVideo] = useUploadShowcaseVideoMutation();
  const [uploadInsightFile] = useUploadInsightFileMutation();

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handlePublish = async () => {
    if (!checked || !userId) return;

    setIsPublishing(true);
    try {
      // Get data from localStorage
      const intro = lsGet<NewRoomIntro & { coverImageDataUrl?: string; videoDataUrl?: string }>(
        ROOM_KEYS.intro,
        {
          roomName: "",
          roomSummary: "",
          role: "",
          qualification: undefined,
        }
      );

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

      // Map localStorage data to API payload format
      // Create insights array from saved insights
      const insightsArray = insights.insights && insights.insights.length > 0
        ? insights.insights.map((insight: any) => ({
            companyName: insight.title || insights.companyName || "",
            website: insights.website || "",
            industry: insight.tag || insights.industry || "",
            duration: insights.duration || "< 6 months",
            teamSize: insights.teamSize || "0-10",
            valueAddedSummary: insight.description || insights.summary || "",
            technicalSkills: insights.technicalSkills || [],
            transferableSkills: insights.transferableSkills || [],
            insightsFile: [], // Files will be uploaded separately
            // Store files reference for upload after creation
            _files: insight.files || [],
          }))
        : // If no saved insights, use current form data
        [
          {
            companyName: insights.companyName || "",
            website: insights.website || "",
            industry: insights.industry || "",
            duration: insights.duration || "< 6 months",
            teamSize: insights.teamSize || "0-10",
            valueAddedSummary: insights.summary || "",
            technicalSkills: insights.technicalSkills || [],
            transferableSkills: insights.transferableSkills || [],
            insightsFile: [],
            // Check if there are files in the current form (not yet added to an insight)
            // We'll need to check localStorage for current files or handle them separately
            _files: [], // Will be populated from current form if needed
          },
        ];

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

      if (createdId && (intro as any)?.coverImageDataUrl) {
        try {
          const src: string = (intro as any).coverImageDataUrl as string;
          let blob: Blob;
          if (src.startsWith("data:")) {
            const res = await fetch(src);
            blob = await res.blob();
          } else if (src.startsWith("blob:")) {
            const res = await fetch(src);
            blob = await res.blob();
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

      // Upload files for each insight
      if (createdInsights.length > 0) {
        // Check if we have saved insights with files
        const insightsWithFiles = insights.insights && insights.insights.length > 0 
          ? insights.insights 
          : [];

        for (let i = 0; i < createdInsights.length; i++) {
          const insightId = createdInsights[i]?._id || createdInsights[i]?.id;
          let insightFilesData: any[] = [];

          // Get files from saved insight if available
          if (insightsWithFiles[i]?.files) {
            insightFilesData = insightsWithFiles[i].files || [];
          } else if (insightsArray[i]?._files) {
            // Fallback: get files from the payload we just created
            insightFilesData = insightsArray[i]._files || [];
          }

          // Also check if this is the first/only insight and we have files in current form
          // (when user publishes without clicking "Add a new insight")
          if (insightFilesData.length === 0 && i === 0 && insights.currentFormFiles && insights.currentFormFiles.length > 0) {
            // Use files from current form if available
            insightFilesData = insights.currentFormFiles;
          }

          if (insightId && insightFilesData && insightFilesData.length > 0) {
            try {
              // Convert base64 data URLs back to File objects
              const filesToUpload = await Promise.all(
                insightFilesData
                  .filter((f: any) => f?.data && typeof f.data === 'string')
                  .map(async (f: any) => {
                    try {
                      const response = await fetch(f.data);
                      const blob = await response.blob();
                      return new File([blob], f.name, { type: f.type });
                    } catch {
                      return null;
                    }
                  })
              );
              
              const validFiles = filesToUpload.filter((f): f is File => f !== null);
              // Upload files one at a time, same as image/video upload flow
              for (const file of validFiles) {
                try {
                  await uploadInsightFile({ 
                    insightId: String(insightId), 
                    file: file 
                  }).unwrap();
                  console.log(`File "${file.name}" uploaded successfully for insight ${i}`);
                } catch (fileError) {
                  console.error(`Failed to upload file "${file.name}" for insight ${i}:`, fileError);
                }
              }
            } catch (error) {
              console.error(`Failed to process files for insight ${i}:`, error);
            }
          } else if (insightId && insightFilesData.length === 0) {
            console.log(`No files found for insight ${i} (ID: ${insightId})`);
          }
        }
      }

      onClose();
      router.push(`/room-details?id=${createdId ?? ""}`);
    } catch (error: any) {
      console.error("Failed to publish showcase room:", error);
      console.error("Error details:", error?.data || error?.message || error);
      // You can add toast notification here if needed
    } finally {
      setIsPublishing(false);
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
        <div className="mb-4">
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
            className={`w-full sm:w-auto rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-white transition text-sm sm:text-base ${
              checked && !isPublishing && !isLoading
                ? "review hover:bg-teal-600 shadow-md"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {isPublishing || isLoading ? "Publishing..." : "Yes, publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
