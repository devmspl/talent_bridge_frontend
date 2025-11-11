"use client";
import { updateUserData } from '@/app/store/slices/userSlice';
import { RootState } from '@/app/store/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { lsGet, lsSet, ROOM_KEYS, NewRoomIntro } from '@/app/utils/roomStorage';
import { useCreateDefaultShowcaseRoomMutation } from '@/app/store/api/showcaseApi';

const Page: React.FC = () => {
  const dispatch = useDispatch();
  const { user, userId } = useSelector((state: RootState) => state.user);
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
    // Also clear the selected qualification in the store so the select resets
    if (user?.qualification === qual) {
      dispatch(updateUserData({ qualification: "" }));
    }
  };

  const router = useRouter();
  const [createDefaultRoom, { isLoading: isSavingDraft }] = useCreateDefaultShowcaseRoomMutation();

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

  // hydrate from localStorage
  useEffect(() => {
    const intro = lsGet<NewRoomIntro>(ROOM_KEYS.intro, {
      roomName: "",
      roomSummary: "",
      role: "",
      qualification: undefined,
    });
    if (intro.roomName) setRoomName(intro.roomName);
    if (intro.roomSummary) setRoomSummary(intro.roomSummary);
    if (intro.role) setRole(intro.role);
  }, []);

  // persist on changes
  useEffect(() => {
    const intro: NewRoomIntro & { coverImageDataUrl?: string | null; videoDataUrl?: string | null } = { 
      roomName, 
      roomSummary, 
      role, 
      qualification: user?.qualification,
      coverImageDataUrl: coverPreview || null,
      videoDataUrl: videoPreview || null,
    };
    lsSet(ROOM_KEYS.intro, intro);
  }, [roomName, roomSummary, role, user?.qualification, coverPreview, videoPreview]);

  // keep local chip state in sync with the selected qualification in store
  useEffect(() => {
    if (user?.qualification) {
      setSelectedQualifications([user.qualification]);
    } else {
      setSelectedQualifications([]);
    }
  }, [user?.qualification]);


  return (
    <>
      {/* Breadcrumb and Save Draft - Responsive */}
      <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-gray-500 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-0 px-3 sm:px-0">
        <div className="flex items-center">
          <Link href="/showcase-rooms" className="hover:text-gray-700">Showcase rooms</Link>
          <span className="text-gray-800 font-semibold"> / New</span>
        </div>
        <div className="w-full sm:w-auto">
          <button
            className="w-full sm:w-auto text-xs sm:text-sm border border-gray-300 px-3 sm:px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer transition disabled:opacity-60"
            onClick={async () => {
              try {
                const intro = lsGet<any>(ROOM_KEYS.intro, {
                  roomName: '',
                  roomSummary: '',
                  role: '',
                  qualification: undefined,
                  coverImageDataUrl: undefined,
                  videoDataUrl: undefined,
                });
                const insights = lsGet<any>(ROOM_KEYS.insights, {
                  companyName: '',
                  website: '',
                  industry: '',
                  duration: '< 6 months',
                  teamSize: '0-10',
                  summary: '',
                  technicalSkills: [],
                  transferableSkills: [],
                  insights: [],
                });
                const coreCompetencies = lsGet<string[]>(ROOM_KEYS.competencies, []);

                const body: any = {
                  userId: userId || '',
                  showcaseRoomName: intro.roomName || 'Untitled',
                  showcaseRoomSummary: intro.roomSummary || '',
                  coverImage: intro.coverImageDataUrl || undefined,
                  videoIntro: intro.videoDataUrl || undefined,
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
                  
                    },
                  ],
                };

                if (!body.userId) {
                  alert('User ID is missing. Please sign in again.');
                  return;
                }
                await createDefaultRoom(body).unwrap();
                alert('Draft saved successfully.');
                router.push('/showcase-rooms');
              } catch (e: any) {
                alert(e?.data?.message || 'Failed to save draft.');
              }
            }}
            disabled={isSavingDraft || !userId}
          >
            {isSavingDraft ? 'Saving...' : !userId ? 'Sign in to save' : 'Save as draft'}
          </button>
        </div>
      </div>

      <div className="min-h-screen flex justify-center items-start sm:pt-6 md:pt-12 px-3 sm:px-4 md:px-6">
        <div className="relative bg-white rounded-lg sm:rounded-xl w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl shadow-sm sm:shadow-md">
          
          {/* Stepper - Responsive */}
          <div className="flex items-center text-xs sm:text-sm font-medium gap-2 sm:gap-3 md:gap-4 justify-center px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 border-b border-gray-200">
            
            {/* Step 1: Introduction */}
            <div className="flex items-center gap-1 text-teal-600">
              <div className="w-4 h-4 sm:w-5 sm:h-5 review text-white text-[10px] sm:text-xs flex items-center justify-center rounded-full flex-shrink-0">1</div>
              <span className="hidden sm:inline text-[#0A0D14] font-medium text-xs sm:text-sm">Introduction</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">›</span>
            
            {/* Step 2: Competencies */}
            <div className="text-gray-500 flex items-center gap-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray text-[10px] sm:text-xs flex items-center justify-center rounded-full border border-gray-300 flex-shrink-0">2</div>
              <span className="hidden sm:inline text-xs sm:text-sm">Competencies</span>
            </div>
            <span className="text-gray-400 text-xs sm:text-sm">›</span>
            
            {/* Step 3: Insights */}
            <div className="text-gray-500 flex items-center gap-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 text-gray text-[10px] sm:text-xs flex items-center justify-center rounded-full border border-gray-300 flex-shrink-0">3</div>
              <span className="hidden sm:inline text-xs sm:text-sm">Insights</span>
            </div>
          </div>

          {/* Form Content - Responsive Padding */}
          <div className="px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            
            {/* Room Name */}
            <div className="mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-1 sm:mb-2">Room name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Room Summary */}
            <div className="mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-1 sm:mb-2">Room Summary</label>
              <textarea
                rows={3}
                placeholder="Type your message here"
                value={roomSummary}
                onChange={(e) => setRoomSummary(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-xs sm:text-sm resize-none focus:outline-none"
              />
              <p className="text-[10px] sm:text-xs text-gray-500 mt-1">max 120 characters</p>
            </div>

            {/* Cover Image Upload */}
            <div className="mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-1 sm:mb-2">Cover Image</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-4 sm:py-6 text-xs sm:text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-gray-400" />
                <p className="flex flex-col sm:flex-row items-center gap-1 text-center px-2">
                  <span className="hidden sm:inline">Drag & drop file here or</span>
                  <span className="sm:hidden">Upload image or</span>
                  <span
                    onClick={handleCoverClick}  
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                  >
                    choose file
                  </span>
                </p>
                <input
                  type="file"
                  accept="image/*"
                  ref={coverInputRef}          
                  onChange={handleCoverChange} 
                  className="hidden"
                />
                {coverPreview && (
                  <img src={coverPreview} alt="Cover preview" className="mt-3 w-full max-h-48 object-cover rounded" />
                )}
              </div>
            </div>

            {/* Video Intro Upload */}
            <div className="mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-1 sm:mb-2">Video Intro (30s max)</label>
              <div className="border border-dashed border-gray-300 rounded-md flex items-center justify-center flex-col py-4 sm:py-6 text-xs sm:text-sm text-gray-600">
                <AiOutlineCloudUpload className="w-5 h-5 sm:w-6 sm:h-6 mb-2 text-gray-400" />
                <p className="flex flex-col sm:flex-row items-center gap-1 text-center px-2">
                  <span className="hidden sm:inline">Drag & drop file here or</span>
                  <span className="sm:hidden">Upload video or</span>
                  <span
                    onClick={handleVideoClick}  
                    className="text-blue-600 font-medium cursor-pointer hover:underline"
                  >
                    choose file
                  </span>
                </p>
                <input
                  type="file"
                  accept="video/*"
                  ref={videoInputRef}          
                  onChange={handleVideoChange} 
                  className="hidden"
                />
                {videoPreview && (
                  <video src={videoPreview} controls className="mt-3 w-full max-h-48 rounded" />
                )}
              </div>
            </div>

            {/* Role Input */}
            <div className="mb-4 sm:mb-5">
              <label className="text-xs sm:text-sm font-medium text-gray-800 block mb-1 sm:mb-2">Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-xs sm:text-sm focus:outline-none"
              />
            </div>

            {/* Qualification Select */}
            <div className="mb-4 sm:mb-5 relative">
              <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1 sm:mb-2">
                Qualification
              </label>

              <select
                className={`w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8 ${
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

              {/* Arrow icon */}
              <svg
                className="w-4 h-4 absolute right-3 top-[45px] -translate-y-1/2 text-gray-500 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>

              {errors.qualification && (
                <p className="text-red-500 text-[10px] sm:text-xs mt-1">{errors.qualification}</p>
              )}

              {/* Selected Qualifications Tags */}
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                {selectedQualifications.map((qual) => (
                  <span
                    key={qual}
                    className="bg-gray-100 text-gray-700 text-[10px] sm:text-xs px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-2"
                  >
                    {qual}
                    <button
                      onClick={() => handleRemoveQualification(qual)}
                      className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm"
                      type="button"
                      aria-label={`Remove ${qual}`}
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>
            

            {/* Next Button */}
            <div className='flex justify-end mt-4 sm:mt-6'>
              <button 
                className="w-full sm:w-auto review text-white px-4 sm:px-6 py-2 sm:py-2.5 h-auto sm:h-[40px] rounded-md flex items-center justify-center gap-2 hover:bg-teal-600 cursor-pointer transition text-xs sm:text-sm font-medium"
                onClick={() => router.push("/competencies")}
              >
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
