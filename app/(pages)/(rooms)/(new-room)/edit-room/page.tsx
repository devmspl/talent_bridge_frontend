"use client";
import { updateUserData } from '@/app/store/slices/userSlice';
import { RootState } from '@/app/store/store';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { lsGet, lsSet, ROOM_KEYS, NewRoomIntro } from '@/app/utils/roomStorage';
import { useGetShowcaseRoomByIdQuery, useUpdateShowcaseRoomMutation, useUploadShowcaseCoverMutation, useUploadShowcaseVideoMutation } from '@/app/store/api/showcaseApi';

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedQualifications, setSelectedQualifications] = useState<string[]>([]);
  
  const [errors, setErrors] = useState<{ qualification?: string }>({});

  const handleQualificationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(updateUserData({ qualification: value }));

    if (errors.qualification) {
      setErrors((prev) => ({ ...prev, qualification: "" }));
    }

    if (value) {
      setSelectedQualifications([value]);
    } else {
      setSelectedQualifications([]);
    }
  };

  const handleRemoveQualification = (qual: string) => {
    setSelectedQualifications(selectedQualifications.filter((q) => q !== qual));
    if (user?.qualification === qual) {
      dispatch(updateUserData({ qualification: "" }));
    }
  };

  const router = useRouter();
  const params = useSearchParams();
  const roomId = params.get('id') || '';
  const { data: roomData } = useGetShowcaseRoomByIdQuery(roomId, { skip: !roomId });
  const [updateRoom, { isLoading: isUpdating }] = useUpdateShowcaseRoomMutation();
  const [uploadCover] = useUploadShowcaseCoverMutation();
  const [uploadVideo] = useUploadShowcaseVideoMutation();

  const [roomName, setRoomName] = useState("");
  const [roomSummary, setRoomSummary] = useState("");
  const [role, setRole] = useState("");

  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleCoverClick = () => coverInputRef.current?.click();
  const handleVideoClick = () => videoInputRef.current?.click();
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => setCoverPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };
  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setVideoFile(file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  // keep local chip state in sync with the selected qualification in store
  useEffect(() => {
    if (user?.qualification) {
      setSelectedQualifications([user.qualification]);
    } else {
      setSelectedQualifications([]);
    }
  }, [user?.qualification]);

  // hydrate from localStorage first
  useEffect(() => {
    const intro = lsGet<NewRoomIntro & { coverImageDataUrl?: string | null; videoDataUrl?: string | null }>(ROOM_KEYS.intro, {
      roomName: '',
      roomSummary: '',
      role: '',
      qualification: undefined,
      coverImageDataUrl: null,
      videoDataUrl: null,
    });
    if (intro.roomName) setRoomName(intro.roomName);
    if (intro.roomSummary) setRoomSummary(intro.roomSummary);
    if (intro.role) setRole(intro.role);
    if (intro.coverImageDataUrl) setCoverPreview(intro.coverImageDataUrl);
    if (intro.videoDataUrl) setVideoPreview(intro.videoDataUrl);
  }, []);

  // then hydrate from API for edit
  useEffect(() => {
    if (roomData && roomId) {
      setRoomName(roomData.showcaseRoomName || '');
      setRoomSummary(roomData.showcaseRoomSummary || '');
      setRole(roomData.role || '');
      if (roomData.coverImage) setCoverPreview(roomData.coverImage);
      if (roomData.videoIntro) setVideoPreview(roomData.videoIntro);
      const intro: NewRoomIntro & { coverImageDataUrl?: string | null; videoDataUrl?: string | null } = {
        roomName: roomData.showcaseRoomName || '',
        roomSummary: roomData.showcaseRoomSummary || '',
        role: roomData.role || '',
        qualification: user?.qualification,
        coverImageDataUrl: roomData.coverImage || null,
        videoDataUrl: roomData.videoIntro || null,
      };
      lsSet(ROOM_KEYS.intro, intro);
      if (Array.isArray(roomData.coreCompetencies)) {
        lsSet(ROOM_KEYS.competencies, roomData.coreCompetencies);
      }
      if (Array.isArray(roomData.insightsId)) {
        const list = (roomData.insightsId || []);
        const first = list[0] || {};
        const existing = lsGet<any>(ROOM_KEYS.insights, {});
        lsSet(ROOM_KEYS.insights, {
          // top-level fields come from the first insight for editing
          companyName: first.companyName || existing.companyName || '',
          website: first.website || existing.website || '',
          industry: first.industry || existing.industry || '',
          duration: first.duration || existing.duration || '< 6 months',
          teamSize: first.teamSize || existing.teamSize || '0-10',
          summary: first.valueAddedSummary || existing.summary || '',
          // skills
          technicalSkills: Array.isArray(first.technicalSkills) ? first.technicalSkills : (roomData.coreCompetencies || []),
          transferableSkills: Array.isArray(first.transferableSkills) ? first.transferableSkills : (roomData.coreCompetencies || []),
          // cards list for preview
          insights: list.map((it: any) => ({
            title: it.companyName || '',
            description: it.valueAddedSummary || '',
            tag: it.industry || '',
          })),
        });
      }
    }
  }, [roomData, roomId]);

  // keep intro edits in localStorage
  useEffect(() => {
    const existing = lsGet<any>(ROOM_KEYS.intro, {});
    lsSet(ROOM_KEYS.intro, { ...existing, roomName, roomSummary, role, qualification: user?.qualification });
  }, [roomName, roomSummary, role, user?.qualification]);

  // Do NOT persist media previews (cover/video) in localStorage during edit
  // This avoids storing large data URLs and keeps update payloads small

  // Persist media previews so they appear on the preview screen
  useEffect(() => {
    if (!coverPreview) return;
    const existing = lsGet<any>(ROOM_KEYS.intro, {});
    lsSet(ROOM_KEYS.intro, { ...existing, coverImageDataUrl: coverPreview });
  }, [coverPreview]);

  useEffect(() => {
    if (!videoPreview) return;
    const existing = lsGet<any>(ROOM_KEYS.intro, {});
    lsSet(ROOM_KEYS.intro, { ...existing, videoDataUrl: videoPreview });
  }, [videoPreview]);


  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
        <Link href="/showcase-rooms">  Showcase rooms </Link> <span className='text-sm text-gray-500'>/ &#123; Room Name &#125; </span> <span className="text-gray-800 font-semibold"> / Edit Room</span>
        </div>
        <div className="flex gap-2">
          <button
            className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer disabled:opacity-60"
            disabled={!roomId || isUpdating}
            onClick={async () => {
              try {
                const intro = lsGet<any>(ROOM_KEYS.intro, {
                  roomName: '', roomSummary: '', role: '', qualification: undefined, coverImageDataUrl: undefined, videoDataUrl: undefined,
                });
                const insights = lsGet<any>(ROOM_KEYS.insights, {
                  companyName: '', website: '', industry: '', duration: '< 6 months', teamSize: '0-10', summary: '', technicalSkills: [], transferableSkills: [], insights: [],
                });
                const coreCompetencies = lsGet<string[]>(ROOM_KEYS.competencies, []);
                // upload files if newly selected
                if (coverImage) await uploadCover({ id: roomId, file: coverImage }).unwrap();
                if (videoFile) await uploadVideo({ id: roomId, file: videoFile }).unwrap();
                const body: any = {
                  showcaseRoomName: intro.roomName || 'Untitled',
                  showcaseRoomSummary: intro.roomSummary || '',
                  coverImage: intro.coverImageDataUrl || roomData?.coverImage || undefined,
                  videoIntro: intro.videoDataUrl || roomData?.videoIntro || undefined,
                  role: intro.role || '',
                  qualification: intro.qualification || undefined,
                  coreCompetencies: Array.isArray(coreCompetencies) ? coreCompetencies : [],
                  insightsId: [
                    {
                      companyName: insights.companyName || '',
                      website: insights.website || '',
                      industry: insights.industry || '',
                      duration: insights.duration || '',
                      teamSize: insights.teamSize || '',
                      valueAddedSummary: insights.summary || '',
                      technicalSkills: insights.technicalSkills || [],
                      transferableSkills: insights.transferableSkills || [],
                      insightsFile: [],
                    },
                  ],
                };
                await updateRoom({ id: roomId, body }).unwrap();
                alert('Room updated successfully.');
              } catch (e: any) {
                alert(e?.data?.message || 'Failed to update room.');
              }
            }}
          >
            {isUpdating ? 'Saving...' : 'Save as draft'}
          </button>
        </div>
      </div>

      <div className="min-h-screen flex justify-center items-start pt-12">
        <div className="relative bg-white rounded-xl w-full max-w-xl shadow-md">
          <div className="flex items-center text-sm font-medium mb-6 gap-4 justify-center px-6 py-8 border-b border-gray-200">
            <div className="flex items-center gap-1 text-teal-600">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">1</div>
              <span className="text-[#0A0D14] font-inter font-medium text-[14px] leading-[20px] tracking-[-0.006em]">Introduction</span>
            </div>
            <span className="text-gray-400">›</span>
            {/* <div className="text-gray-500">2 Competencies</div> */}
             <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                2
              </div> Competencies</div>
            <span className="text-gray-400">›</span>
            {/* <div className="text-gray-500">3 Insights</div> */}
             <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5  text-gray text-xs flex items-center justify-center rounded-full border">
                3
              </div> Insights</div>
          </div>
          <div className="px-6 py-8">
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm  focus:outline-none"
              />
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Room Summary</label>
              <textarea
                rows={3}
                placeholder="Type your message here"
                value={roomSummary}
                onChange={(e) => setRoomSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none  focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">max 120 characters</p>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Cover Image</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  {/* <span className="text-blue-600 font-medium cursor-pointer">choose file</span> */}
                  <span
  onClick={handleCoverClick}  
  className="text-blue-600 font-medium cursor-pointer"
>
  choose file
</span>

<input
  type="file"
  accept="image/*"
  ref={coverInputRef}          
  onChange={handleCoverChange} 
  className="hidden"
/>
                </p>
                {coverPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={coverPreview} alt="Cover preview" className="mt-3 w-full max-h-48 object-cover rounded" />
                )}
              </div>
            </div>
            <div className="mb-5">
              <label className="text-sm font-medium text-gray-800 block mb-1">Video Intro (30s max)</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex">
                  Drag & drop file here or{" "}
                  {/* <span className="text-blue-600 font-medium cursor-pointer">choose file</span> */}

                   <span
  onClick={handleVideoClick}  
  className="text-blue-600 font-medium cursor-pointer"
>
  choose file
</span>

<input
  type="file"
  accept="video/*"
  ref={videoInputRef}          
  onChange={handleVideoChange} 
  className="hidden"
/>
                </p>
                {videoPreview && (
                  <video src={videoPreview} controls className="mt-3 w-full max-h-48 rounded" />
                )}
              </div>
            </div>
            <div className="mb-2">
              <label className="text-sm font-medium text-gray-800 block mb-1">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm  focus:outline-none"
              />
            </div>


            <div>
      <label className="text-sm font-medium text-gray-700">Qualification</label>

      <select
        className={`w-full mt-1 rounded-md border text-sm p-2 focus:ring-teal-500 focus:border-teal-500 ${
          errors.qualification ? "border-red-500" : "border-gray-300"
        }`}
        value={user?.qualification || ""}
        onChange={handleQualificationChange}
      >
        <option value="">Select your qualification</option>
        <option value="Power BI Data Analyst">Power BI Data Analyst</option>
        <option value="Azure Data Engineer">Azure Data Engineer</option>
        <option value="Data modeling & ETL processes">Data modeling & ETL processes</option>
        
      </select>

      {errors.qualification && (
        <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>
      )}

      <div className="flex flex-wrap gap-2 mt-2">
        {selectedQualifications.map((qual) => (
          <span
            key={qual}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-2"
          >
            {qual}
            <button
              onClick={() => handleRemoveQualification(qual)}
              className="text-gray-400 hover:text-gray-600"
              type="button"
            >
              ✕
            </button>
          </span>
        ))}
      </div>
    </div>



            
            <div className='flex justify-end mt-4'>
              <button className="review text-white px-4 py-2 h-[40px] rounded-md flex items-center gap-2 hover:bg-teal-600 cursor-pointer"
                onClick={() => router.push(roomId ? `/edit-room1?id=${roomId}` : "/edit-room1") }>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Page;
