"use client";
import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaUpload } from "react-icons/fa";
import Avtar from "@/public/assets/profile/Avatar.png"
import Image from "next/image";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import logo from "@/public/assets/Icon1.svg";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { updateUserData, setCurrentStep } from "@/app/store/slices/userSlice";
import { profileValidationSchema } from "@/app/utils/validation";
import check from "@/public/assets/icons/Vector (1).svg"
import Link from "next/link";
import upload from "@/public/assets/icons/upload.svg"
import tick from "@/public/assets/tick.svg";

export default function ProfileSetup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [selectedTypes, setSelectedTypes] = useState(["Permanent", "Contract", "N/A"]);
  const [selfEmployed, setSelfEmployed] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.profileImage) {
      setImage(user.profileImage);
    }
  }, [user?.profileImage]);

  const handleRemoveType = (type: string) => {
    setSelectedTypes(selectedTypes.filter((t) => t !== type));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImage(result);
        dispatch(updateUserData({ profileImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleIndustryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(updateUserData({ industry: value }));
    if (errors.industry) {
      setErrors(prev => ({ ...prev, industry: '' }));
    }
  };

  const handleEmploymentTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    dispatch(updateUserData({ employmentType: value }));
    if (errors.employmentType) {
      setErrors(prev => ({ ...prev, employmentType: '' }));
    }
  };

  // Normalize date to YYYY-MM-DD (ISO date without time)
  const toYYYYMMDD = (raw: string): string => {
    if (!raw) return '';
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return '';
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, '0');
    const day = String(parsed.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = toYYYYMMDD(e.target.value);
    dispatch(updateUserData({ dob: value }));
  };

  const handleSelfEmployedChange = (checked: boolean) => {
    setSelfEmployed(checked);
    dispatch(updateUserData({ selfEmployed: checked }));
  };

  const validateForm = () => {
    try {
      profileValidationSchema.validateSync(user ?? {}, { abortEarly: false });
      return true;
    } catch (validationErrors: any) {
      const newErrors: Record<string, string> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleContinue = () => {
    if (validateForm()) {
      dispatch(setCurrentStep(3));
      router.push("/step-3");
    }
  };

  return (
    <>
      <style jsx>{`
        select {
          max-width: 100%;
          box-sizing: border-box;
        }
        select option {
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        @media (max-width: 640px) {
          select {
            font-size: 16px;
          }
        }
      `}</style>
      <div className="w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full icon flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            <Image src={logo} alt="" />
          </div>
          <Link href="/auth"> <span className="text-sm sm:text-base font-semibold text-gray-900">TalentBridge</span> </Link>
        </div>

        {/* Center: Stepper - Responsive */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            {/* Step 1: Completed */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center"><Image src={check} alt="" /> </div>
              <span className="hidden md:inline">Account</span>
              <span className="text-gray-300 hidden sm:inline">›</span>
            </div>

            {/* Step 2: Current */}
            <div className="flex items-center gap-1 text-gray-900 font-medium">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">2</div>
              <span className="hidden md:inline">Profile</span>
              <span className="text-gray-300 hidden sm:inline">›</span>
            </div>

            {/* Step 3: Upcoming */}
            <div className="flex items-center gap-1 text-gray-400">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">3</div>
              <span className="hidden md:inline">Showcase</span>
            </div>
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">2</div>
            <span className="text-gray-500">of 3</span>
          </div>
        </div>

        {/* Right: Close Button */}
        <div className="text-gray-400 text-sm sm:text-base cursor-pointer hover:text-gray-600">
          ×
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="bg-white w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg rounded-xl shadow-md p-4 sm:p-6 md:p-8">
          {/* Title */}
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-gray-900">Setup Your Profile</h2>
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">
            Let's get you started with TalentBridge
          </p>

          {/* Upload Photo */}
          <div className="flex flex-col items-center mt-4 sm:mt-6">
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28">
              <label className="cursor-pointer block w-full h-full rounded-full border border-gray-300 overflow-hidden">
                {image ? (
                  <img
                    src={image}
                    alt="Uploaded"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <Image
                    src={Avtar}
                    alt="Default Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>
            <button className="text-[#02ABAC] text-xs sm:text-sm mt-2 flex items-center gap-1 hover:underline cursor-pointer"
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
            >
              <Image className="h-[12px] sm:h-[15px]" src={upload} alt=""></Image>  Upload Photo
            </button>
          </div>

          {/* Form */}
          <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
            {/* Industry */}
            <div>
              <label className="text-sm sm:text-base font-medium text-gray-700">Industry</label>
              <select 
                className={`w-full mt-1 sm:mt-2 rounded-md border text-sm sm:text-base p-2 sm:p-3 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                value={user?.industry || ''}
                onChange={handleIndustryChange}
              >
                <option value="">Select your industry</option>
                <option value="IT">IT</option>
                <option value="Finance">Finance</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Marketing">Marketing</option>
              </select>
              {errors.industry && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.industry}</p>}
            </div>

            <div>
              <label className="text-sm sm:text-base font-medium text-gray-700">Preferred Employment Type</label>
              
              <select
                className={`w-full mt-1 sm:mt-2 rounded-md border text-sm sm:text-base p-2 sm:p-3 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.employmentType ? 'border-red-500' : 'border-gray-300'
                }`}
                style={{
                  maxWidth: '100%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
                value={user?.employmentType || ''}
                onChange={(e) => {
                  handleEmploymentTypeChange(e);
                  if (!selectedTypes.includes(e.target.value) && e.target.value) {
                    setSelectedTypes([...selectedTypes, e.target.value]); 
                  }
                }}
              >
                <option value="">Select preferred job type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </select>

              {errors.employmentType && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.employmentType}</p>}

              {/* <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
                {selectedTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-gray-100 text-gray-700 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-full flex items-center gap-1 sm:gap-2"
                  >
                    {type}
                    <button
                      onClick={() => handleRemoveType(type)}
                      className="text-gray-400 hover:text-gray-600 text-xs sm:text-sm"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div> */}
            </div>


            {/* Date of Birth */}
            <div>
              <label className="text-sm sm:text-base font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                className={`w-full mt-1 sm:mt-2 rounded-md border text-sm sm:text-base p-2 sm:p-3 focus:ring-teal-500 focus:border-teal-500 ${errors.dob ? 'border-red-500' : 'border-gray-300'}`}
                value={user?.dob || ''}
                onChange={handleDobChange}
              />
              {errors.dob && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.dob}</p>}
            </div>


            <div className="flex items-center space-x-2">
              <label className="flex items-center gap-2 text-xs sm:text-sm text-gray-700 cursor-pointer relative">
                <input
                  type="checkbox"
                  id="selfEmployed"
                  className="peer h-4 w-4 sm:h-5 sm:w-5 rounded-[4px] border-2 border-gray-300 checked:border-[#02ABAC] checked:bg-[#E6F7F7] appearance-none"
                  onChange={(e) => handleSelfEmployedChange(e.target.checked)}
                />
                {/* <Image
                  src={tick}
                  alt="tick"
                  className="absolute left-1 top-1.5 sm:left-1.5 sm:top-2 hidden peer-checked:block h-2 w-2 sm:h-2.5 sm:w-2.5"
                /> */}
                <Image
    src={tick}
    alt="tick"
    className="absolute left-1.5 top-1.5 hidden peer-checked:block h-2 w-2"
  />
                <span className="leading-tight">I am open to self employed opportunities</span>
              </label>
            </div>

            {/* Button */}
            <button 
              className="w-full mt-3 sm:mt-4 review hover:bg-teal-600 text-white font-semibold py-2.5 sm:py-3 rounded-md transition hover:cursor-pointer text-sm sm:text-base"
              onClick={handleContinue}
            >
              Let's Continue
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
