"use client";
import Image from "next/image";
import Avatar from "@/app/component/Avatar";
import React, { useEffect, useState, useRef } from "react";
import logo from "@/public/assets/profile/Avatarlogo.png";
import tick from "@/public/assets/tick.svg";
import { FiChevronDown, FiUpload } from "react-icons/fi";
import {
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useUploadProfileMutation,
} from "@/app/store/api/userApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Personal_info = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRefs = {
    country: useRef<HTMLDivElement>(null),
    industry: useRef<HTMLDivElement>(null),
    employmentType: useRef<HTMLDivElement>(null),
  };

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    country: "",
    city: "",
    industry: "",
    employmentType: "",
    dob: "",
    openForWork: false,
  });
  

  // Normalize various date representations to YYYY-MM-DD (ISO date without time)
  const toYYYYMMDD = (raw: string): string => {
    if (!raw) return "";
    // If already in YYYY-MM-DD, keep as is
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const parsed = new Date(raw);
    if (isNaN(parsed.getTime())) return "";
    const year = parsed.getUTCFullYear();
    const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
    const day = String(parsed.getUTCDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Dropdown options
  const dropdownOptions = {
    country: [
      { value: "", label: "Select Country" },
      { value: "USA", label: "USA" },
      { value: "India", label: "India" },
      { value: "UK", label: "UK" },
    ],
    industry: [
      { value: "", label: "Select industry" },
      { value: "IT", label: "IT" },
      { value: "Finance", label: "Finance" },
      { value: "Healthcare", label: "Healthcare" },
    ],
    employmentType: [
      { value: "", label: "Select employment type" },
      { value: "Permanent", label: "Permanent" },
      { value: "Contract", label: "Contract" },
      { value: "N/A", label: "N/A" },
    ],
  };

  const [uploadProfile] = useUploadProfileMutation();
  const [updateUser] = useUpdateProfileMutation();
  const userId = Cookies.get("tb_userId");

  const { data: storedUser } = useGetUserByIdQuery(userId!, {
    skip: !userId,
    pollingInterval: 10000,
  });

  useEffect(() => {
    if (storedUser) {
      setFormData({
        fullName: storedUser?.fullName || "",
        phone: storedUser?.contact_number || "",
        email: storedUser?.email || "",
        country: storedUser?.country || "",
        city: storedUser?.city || "",
        industry: storedUser?.industryType?.[0] || "",
        employmentType: storedUser?.employmentType?.[0] || "",
        dob: toYYYYMMDD(storedUser?.dob || ""),
        openForWork: storedUser?.openForWork ?? false,
      });
    }
  }, [storedUser]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      Object.values(dropdownRefs).forEach((ref) => {
        if (ref.current && !ref.current.contains(event.target as Node)) {
          setOpenDropdown(null);
        }
      });
    };

    if (openDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [openDropdown]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target;

    if (target instanceof HTMLInputElement && target.type === "checkbox") {
      // Agar input checkbox hai
      const { name, checked } = target;
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
    } else if (target instanceof HTMLSelectElement && target.multiple) {
      const { name, options } = target;
      const values = Array.from(options)
        .filter((option) => option.selected)
        .map((option) => option.value);

      setFormData((prev) => ({
        ...prev,
        [name]: values,
      }));
    } else {
      const { name } = target;
      let { value } = target as HTMLInputElement | HTMLSelectElement;
      if (name === "dob") {
        value = toYYYYMMDD(value);
      }
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    // Show preview if image is being dragged
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      const item = e.dataTransfer.items[0];
      if (item.kind === 'file' && item.type.startsWith('image/')) {
        const file = item.getAsFile();
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => {
            setDragPreview(event.target?.result as string);
          };
          reader.readAsDataURL(file);
        }
      }
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragPreview(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        // Create and show preview
        const reader = new FileReader();
        reader.onload = (event) => {
          setDragPreview(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Please upload an image file');
      }
    }
    setDragPreview(null);
  };

  const handleDropdownToggle = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
  };

  const handleDropdownSelect = (dropdownName: string, value: string) => {
   
    setFormData((prev) => ({
      ...prev,
      [dropdownName]: value,
    }));
    setOpenDropdown(null);
  };

  const getSelectedLabel = (dropdownName: string) => {
    const options = dropdownOptions[dropdownName as keyof typeof dropdownOptions];
    const selectedOption = options.find(option => option.value === formData[dropdownName as keyof typeof formData]);
    return selectedOption?.label || options[0]?.label || "";
  };

  const handleSave = async () => {
    if (!storedUser?._id) {
      alert("User not found");
      return;
    }

    try {
      if (selectedFile && storedUser?._id) {
        await uploadProfile({
          userKey: storedUser._id,
          file: selectedFile,
          filename: selectedFile.name,
        }).unwrap();

        toast.success("Profile image uploaded successfully!");
      }
      await updateUser({
        userKey: storedUser._id,
        fullname: formData.fullName,
        email: formData.email,
        contact_number: formData.phone,
        dob: formData.dob ? toYYYYMMDD(formData.dob) : undefined,
        industryType: formData.industry ? [formData.industry] : [],
        employmentType: formData.employmentType
          ? [formData.employmentType]
          : [],
        openForWork: formData.openForWork,
        country: formData.country,
        city: formData.city,
      }).unwrap();

      toast("Profile updated successfully");
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="flex-1">
      {/* Profile Section - Responsive Layout */}
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-6">
        <div 
          className={`relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0 group ${isDragging ? 'ring-4 ring-teal-500' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className={`absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center text-white text-xs text-center p-2 opacity-0 group-hover:opacity-100 transition-opacity ${isDragging ? 'opacity-100' : ''}`}>
            {isDragging && dragPreview ? (
              <img 
                src={dragPreview} 
                alt="Preview" 
                className="w-16 h-16 object-cover rounded-full mb-2"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <FiUpload className="w-6 h-6 mb-1" />
                {isDragging && <span className="text-xs mt-1">Drop image here</span>}
              </div>
            )}
          </div>
          {selectedFile && !isDragging ? (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Profile Preview"
              className="object-cover w-full h-full"
            />
          ) : (
            <Avatar
              avatar={storedUser?.avatar}
              avatarSvg={storedUser?.avatarSvg}
              alt="Profile"
              width={96}
              height={96}
              className={`object-cover w-full h-full ${isDragging ? 'opacity-60' : 'group-hover:opacity-80'} transition-opacity`}
              fallbackImage={logo}
            />
          )}
        </div>

        <div className="flex-1 w-full sm:w-auto text-center sm:text-left">
          <div className="mb-3">
            <h2 className="text-lg sm:text-xl font-semibold">
              {formData.fullName || "John Doe"}
            </h2>
            <p className="text-sm sm:text-base text-gray-500">
              {formData.industry || "Data Analyst"}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 justify-center sm:justify-start">
            <label className="px-3 sm:px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer text-sm sm:text-base transition-colors">
              Change Photo
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </label>
            <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer text-sm sm:text-base transition-colors">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 py-4 sm:py-5 px-4 sm:px-5">
          <h1 className="text-lg sm:text-xl md:text-2xl text-black font-semibold">Profile</h1>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 shadow p-4 sm:p-6">
          {/* Full name */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium mb-1">Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="First name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm sm:text-base"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              type="text"
              name="phone"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm sm:text-base"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="yourname@company.com"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm sm:text-base"
            />
          </div>

          {/* Country */}
          <div className="relative">
            <label htmlFor="country" className="block text-sm font-medium mb-1">Country</label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-200 rounded text-sm sm:text-base bg-white text-left hover:border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors cursor-pointer appearance-none"
            >
              {dropdownOptions.country.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="text-gray-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-medium mb-1">City</label>
            <input
              type="text"
              name="city"
              placeholder="Your city"
              value={formData.city}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm sm:text-base"
            />
          </div>

          {/* Industry */}
          <div className="relative">
            <label htmlFor="industry" className="block text-sm font-medium mb-1">Industry</label>
            <select
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-200 rounded text-sm sm:text-base bg-white text-left hover:border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors cursor-pointer appearance-none"
            >
              {dropdownOptions.industry.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="text-gray-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          {/* Employment Type */}
          <div className="relative">
            <label htmlFor="employmentType" className="block text-sm font-medium mb-1">Preferred Employment Type</label>
            <select
              id="employmentType"
              name="employmentType"
              value={formData.employmentType}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-3 sm:py-2 border border-gray-200 rounded text-sm sm:text-base bg-white text-left hover:border-gray-300 focus:border-teal-500 focus:ring-1 focus:ring-teal-500 focus:outline-none transition-colors cursor-pointer appearance-none"
            >
              {dropdownOptions.employmentType.map((option) => (
                <option 
                  key={option.value} 
                  value={option.value}
                  className="text-gray-900"
                >
                  {option.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 mt-6">
              <FiChevronDown className="text-gray-400" />
            </div>
          </div>

          {/* DOB */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Date of Birth
            </label>
            <input
              type="date"
              name="dob"
              value={formData.dob || ""}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 py-2 border border-gray-200 rounded text-sm sm:text-base"
            />
          </div>

          {/* Open for work */}
          <div className="col-span-1 md:col-span-2 flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer relative">
              <input
                type="checkbox"
                name="openForWork"
                checked={formData.openForWork}
                onChange={handleInputChange}
                className="peer h-4 w-4 rounded-[4px] border-2 border-gray-300 checked:border-[#02ABAC] checked:bg-[#E6F7F7] appearance-none"
              />
              <Image
                src={tick}
                alt="tick"
                className="absolute left-1 top-1.5 hidden peer-checked:block h-2 w-2"
              />
              <span>Open for Work</span>
            </label>
          </div>
        </form>

        {/* Save + Cancel - Responsive Button Layout */}
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-3 mb-4 sm:mb-6 p-4 sm:p-6">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 sm:px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer text-sm sm:text-base order-2 sm:order-1 transition-colors"
          >
            Save changes
          </button>
          <button className="px-4 sm:px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer text-sm sm:text-base order-1 sm:order-2 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personal_info;
