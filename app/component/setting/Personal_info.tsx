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
    <div className="flex-1 ">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden">
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

        <div>
          <div className="mb-3">
            <h2 className="text-xl font-semibold">
              {formData.fullName || "John Doe"}
            </h2>
            <p className="text-gray-500">
              {formData.industry || "Data Analyst"}
            </p>
          </div>
          <div className="ml-auto space-x-2">
            <label className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer">
              Change Photo
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <button className="px-4 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg">
        <div className=" border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold">
          <h1>Profile</h1>
        </div>

        <form className="grid grid-cols-2 gap-4 shadow p-6">
          {/* Full name */}
          <div className="col-span-2">
            <label className="block text-sm font-medium mb-1 ">Full name</label>
            <input
              type="text"
              name="fullName"
              placeholder="First name"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded"
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
              className="w-full px-4 py-2 border border-gray-200 rounded"
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
              className="w-full px-4 py-2 border border-gray-200 rounded"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium mb-1">Country</label>
            <select
              name="country"
              value={formData.country || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded"
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
              className="w-full px-4 py-2 border border-gray-200 rounded"
            />
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium mb-1">Industry</label>
            <select
              name="industry"
              value={formData.industry || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded"
            >
              <option value="">Select industry</option>
              <option value="IT">IT</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>
          </div>

          {/* Employment Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">
              Preferred Employment Type
            </label>
            <select
              name="employmentType"
              value={formData.employmentType || ""}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded"
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
              className="w-full px-4 py-2 border border-gray-200 rounded"
            />
          </div>

          {/* Open for work */}
          <div className="col-span-2 flex items-center gap-2">
            {/* <input
              type="checkbox"
              name="openForWork"
              checked={formData.openForWork}
              onChange={handleInputChange}
              className="w-4 h-4"
            />
            <label className="text-sm font-medium">Open for Work</label> */}
            <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer relative">
              <input
                type="checkbox"
                className="peer h-4 w-4 rounded-[4px] border-2 border-gray-300 checked:border-[#02ABAC] checked:bg-[#E6F7F7] appearance-none"
              />
              <Image
                src={tick}
                alt="tick"
                className="absolute left-1 top-1.5 hidden peer-checked:block h-2 w-2"
              />
              <span> Open for Work </span>
            </label>
          </div>
        </form>

        {/* Save + Cancel */}
        <div className="mt-6 flex justify-end gap-3 mb-6 p-6">
          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2 review text-white rounded hover:bg-teal-600 cursor-pointer"
          >
            Save changes
          </button>
          <button className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Personal_info;
