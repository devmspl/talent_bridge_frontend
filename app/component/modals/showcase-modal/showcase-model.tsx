"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import tick from "@/public/assets/tick.svg";
import Image from "next/image";

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

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/30 backdrop-blur-sm z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-4 text-[#D1D5DB] hover:text-gray-700 cursor-pointer"
        >
          <IoMdClose size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">
          Publish Showcase Room
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to publish this showcase room? You can always
          come back to edit/update your information.
        </p>

        {/* Dropdown */}
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Set room visibility
        </label>
        <select
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4"
        >
          <option>All Recruiters</option>
          <option>Connected Only</option>
          <option>Private</option>
        </select>

        {/* Checkbox */}
    <div className="flex items-center gap-2 mb-6 mt-2">
  <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer relative">
    <input
      type="checkbox"
      checked={checked}
      onChange={() => setChecked(!checked)}
      className="peer h-4 w-4 rounded-[4px] border-2 border-gray-300 checked:border-[#02ABAC] checked:bg-[#E6F7F7] appearance-none"
    />
    <Image
      src={tick}
      alt="tick"
      className="absolute left-1 hidden peer-checked:block h-2 w-2"
    />
    <span>I confirm i have gone through this showcase and its good to go</span>
  </label>
</div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-lg px-6 py-2 w-[240px] text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            disabled={!checked}
            onClick={() => {
              onClose();
              router.push("/room-details");
            }}
            className={` w-[240px] rounded-lg px-6 py-2 font-medium text-white ${
              checked
                ? "review hover:bg-teal-600"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            Yes, publish
          </button>
        </div>
      </div>
    </div>
  );
}
