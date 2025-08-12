import { useState } from "react";
import { IoMdClose } from "react-icons/io";

export default function FilterModal({ onClose }: { onClose: () => void }) {
  const [location, setLocation] = useState("");
  const [industry, setIndustry] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [experience, setExperience] = useState("");

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-40 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
        {/* Close Button */}
        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 cursor-pointer" onClick={onClose}>
          <IoMdClose size={20} />
        </button>

        {/* Modal Title */}
        <h2 className="text-lg font-semibold mb-4">Filter</h2>

        {/* Location Dropdown */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select location</option>
            <option value="USA">USA</option>
            <option value="India">India</option>
            <option value="UK">UK</option>
          </select>
        </div>

        {/* Industry Dropdown */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Industry</label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select your industry</option>
            <option value="Tech">Tech</option>
            <option value="Finance">Finance</option>
            <option value="Healthcare">Healthcare</option>
          </select>
        </div>

        {/* Company Name Input */}
        <div className="mb-4">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Company name</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Company Name"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Experience Level Dropdown */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-700 mb-1 block">Experience Level</label>
          <select
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            className="w-full border border-teal-200 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="">Select experience level</option>
            <option value="Mid-Level">Mid-Level</option>
            <option value="Senior">Senior</option>
            <option value="Executive">Executive</option>
          </select>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-lg px-6 py-2 text-gray-700 font-medium hover:bg-gray-50 w-50 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={() => alert("Filters Applied")}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-lg px-6 py-2 font-medium w-50 cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
