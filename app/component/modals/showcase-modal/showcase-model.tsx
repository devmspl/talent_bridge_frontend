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
            disabled={!checked}
            onClick={() => {
              onClose();
              router.push("/room-details");
            }}
            className={`w-full sm:w-auto rounded-lg px-4 sm:px-6 py-2.5 sm:py-3 font-medium text-white transition text-sm sm:text-base ${
              checked
                ? "review hover:bg-teal-600 shadow-md"
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
