"use client";
import { useEffect, useRef, useState } from "react";
import { FaCloudUploadAlt, FaUpload } from "react-icons/fa";
import Avtar from "@/public/assets/profile/Avatar.png"
import Image from "next/image";
import { BiCloset } from "react-icons/bi";
import { CgClose } from "react-icons/cg";
import logo from "@/public/assets/Icon.png";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { updateUserData, setCurrentStep } from "@/app/store/slices/userSlice";
import { profileValidationSchema } from "@/app/utils/validation";

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
      <div className="w-full flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
            <Image src={logo} alt="" />
          </div>
          <span className="font-semibold text-gray-900">TalentBridge</span>
        </div>

        {/* Center: Stepper */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 text-sm">
            {/* Step 1: Completed */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">✓</div>
              <span>Account</span>
              <span className="text-gray-300">›</span>
            </div>

            {/* Step 2: Current */}
            <div className="flex items-center gap-1 text-gray-900 font-medium">
              <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">2</div>
              <span>Profile</span>
              <span className="text-gray-300">›</span>
            </div>

            {/* Step 3: Upcoming */}
            <div className="flex items-center gap-1 text-gray-400">
              <div className="w-6 h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">3</div>
              <span>Showcase</span>
            </div>
          </div>
        </div>

        {/* Right: Close Button */}
        <div className="text-gray-400 text-sm cursor-pointer hover:text-gray-600">
          ×
        </div>
      </div>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="bg-white w-full max-w-md rounded-xl shadow-md p-8">
          {/* Title */}
          <h2 className="text-2xl font-bold text-center text-gray-900">Setup Your Profile</h2>
          <p className="text-center text-gray-500 text-sm mt-1">
            Let's get you started with TalentBridge
          </p>

          {/* Upload Photo */}
          <div className="flex flex-col items-center mt-6">
            <div className="relative w-24 h-24">
              <label className="cursor-pointer block w-24 h-24 rounded-full border border-gray-300 overflow-hidden">
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
            <button className="text-teal-500 text-sm mt-2 flex items-center gap-1 hover:underline cursor-pointer"
              onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
            >
              <FaUpload />Upload Photo
            </button>
          </div>

          {/* Form */}
          <div className="mt-8 space-y-4">
            {/* Industry */}
            <div>
              <label className="text-sm font-medium text-gray-700">Industry</label>
              <select 
                className={`w-full mt-1 rounded-md border text-sm p-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.industry ? 'border-red-500' : 'border-gray-300'
                }`}
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
              {errors.industry && <p className="text-red-500 text-xs mt-1">{errors.industry}</p>}
            </div>

            {/* Employment Type */}
            <div>
              <label className="text-sm font-medium text-gray-700">Preferred Employment Type</label>
              <select 
                className={`w-full mt-1 rounded-md border text-sm p-2 focus:ring-teal-500 focus:border-teal-500 ${
                  errors.employmentType ? 'border-red-500' : 'border-gray-300'
                }`}
                value={user?.employmentType || ''}
                onChange={handleEmploymentTypeChange}
              >
                <option value="">Select preferred job type</option>
                <option value="Permanent">Permanent</option>
                <option value="Contract">Contract</option>
                <option value="Part-time">Part-time</option>
                <option value="Freelance">Freelance</option>
              </select>
              {errors.employmentType && <p className="text-red-500 text-xs mt-1">{errors.employmentType}</p>}

              {/* Chips */}
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedTypes.map((type) => (
                  <span
                    key={type}
                    className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    {type}
                    <button onClick={() => handleRemoveType(type)} className="text-gray-400 hover:text-gray-600">
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="selfEmployed"
                className="rounded border-gray-300 focus:ring-teal-500"
                checked={selfEmployed}
                onChange={(e) => handleSelfEmployedChange(e.target.checked)}
              />
              <label htmlFor="selfEmployed" className="text-sm text-gray-700">
                I am open to self employed opportunities
              </label>
            </div>

            {/* Button */}
            <button 
              className="w-full mt-2 bg-teal-500 hover:bg-teal-600 text-white font-semibold py-2 rounded-md transition hover:cursor-pointer"
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
