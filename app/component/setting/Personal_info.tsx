"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import logo from "@/public/assets/profile/Avatarlogo.png";
import tick from "@/public/assets/tick.svg";
import {
  useGetUserByIdQuery,
  useUpdateProfileMutation,
  useUploadProfileMutation,
} from "@/app/store/api/userApi";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Personal_info = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        fullName: storedUser?.fullname || "",
        phone: storedUser?.contact_number || "",
        email: storedUser?.email || "",
        country: storedUser?.country || "",
        city: storedUser?.city || "",
        industry: storedUser?.industryType?.[0] || "",
        employmentType: storedUser?.employmentType?.[0] || "",
        dob: storedUser?.dob || "",
        openForWork: storedUser?.openForWork ?? false,
      });
    }
  }, [storedUser]);

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
      const { name, value } = target;
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
        dob: formData.dob,
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
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src={
              storedUser?.avatar
                ? `https://backend.webridgetalent.com/assets/images/${storedUser.avatar}`
                : logo
            }
            alt="Profile"
            width={96}
            height={96}
            className="object-cover w-full h-full"
          />
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
            <label className="px-3 sm:px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer text-sm sm:text-base">
              Change Photo
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <button className="px-3 sm:px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer text-sm sm:text-base">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200 py-4 sm:py-5 px-4 sm:px-5">
          <h1 className="text-xl sm:text-2xl text-black font-semibold">Profile</h1>
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
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 pr-8 py-2 border border-gray-200 rounded text-sm sm:text-base appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Select Country</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
            </select>
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
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <select
              name="industry"
              value={formData.industry || ""}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 pr-8 py-2 border border-gray-200 rounded text-sm sm:text-base appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Select industry</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="md:mb-3">
            <label className="block text-sm font-medium mb-1">
              Preferred Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType || ""}
              onChange={handleInputChange}
              className="w-full px-3 sm:px-4 pr-8 py-2 border border-gray-200 rounded text-sm sm:text-base appearance-none bg-white"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundRepeat: 'no-repeat',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              <option value="">Select employment type</option>
              <option value="Permanent">Permanent</option>
              <option value="Contract">Contract</option>
              <option value="N/A">N/A</option>
            </select>
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
            className="px-4 sm:px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer text-sm sm:text-base order-2 sm:order-1"
          >
            Save changes
          </button>
          <button className="px-4 sm:px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer text-sm sm:text-base order-1 sm:order-2">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personal_info;
