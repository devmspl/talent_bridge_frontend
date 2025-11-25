

import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

export default function FilterModal({
  filters,
  setFilters,
  onClose,
}: {
  filters: any;
  setFilters: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
}) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-200/40 backdrop-blur-sm z-50 px-3 sm:px-4">
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl w-[95%] sm:w-[90%] max-w-sm sm:max-w-md p-4 sm:p-6 relative border border-gray-100 max-h-[85vh] overflow-y-auto">
        <button
          className="absolute top-3 right-3 sm:top-4 sm:right-4 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          <IoMdClose size={20} />
        </button>

        <h2 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Filter</h2>

        <div className="mb-3 sm:mb-4 relative">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Location
          </label>

          <div className="relative">
            <select
              value={filters.location}
              onChange={(e) =>
                setFilters({ ...filters, location: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 sm:px-4 text-gray-700 text-sm
                 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                 bg-white shadow-sm appearance-none"
            >
              <option value="">Select location</option>
              <option value="USA">USA</option>
              <option value="India">India</option>
              <option value="UK">UK</option>
            </select>

            {/* Your SVG Icon */}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>



        <div className="mb-3 sm:mb-4 relative">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Industry
          </label>

          <div className="relative">
            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters({ ...filters, industry: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 sm:px-4 text-gray-700 text-sm
                 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                 bg-white shadow-sm appearance-none"
            >
              <option value="">Select your industry</option>
              <option value="Tech">Tech</option>
              <option value="Finance">Finance</option>
              <option value="Healthcare">Healthcare</option>
            </select>

            {/* Custom SVG Dropdown Icon */}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>


        <div className="mb-3 sm:mb-4">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Company name
          </label>
          <input
            type="text"
            value={filters.companyName}
            onChange={(e) =>
              setFilters({ ...filters, companyName: e.target.value })
            }
            placeholder="Company Name"
            className="w-full border border-gray-300 rounded-md px-3 py-2 sm:px-4 text-gray-700 text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500 bg-white shadow-sm"
          />
        </div>

        <div className="mb-4 sm:mb-6 relative">
          <label className="text-xs sm:text-sm font-medium text-gray-700 mb-1 block">
            Experience Level
          </label>

          <div className="relative">
            <select
              value={filters.experience}
              onChange={(e) =>
                setFilters({ ...filters, experience: e.target.value })
              }
              className="w-full border border-gray-300 rounded-md px-3 py-2 sm:px-4 text-gray-700 text-sm
                 focus:outline-none focus:ring-1 focus:ring-teal-500 focus:border-teal-500
                 bg-white shadow-sm appearance-none"
            >
              <option value="">Select experience level</option>
              <option value="Mid-Level">Mid-Level</option>
              <option value="Senior">Senior</option>
              <option value="Executive">Executive</option>
            </select>

            {/* Custom SVG Dropdown Icon */}
            <svg
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none text-gray-500"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>


        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={onClose}
            className="border border-gray-300 rounded-md px-5 py-2 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
          >
            Back
          </button>
          <button
            onClick={onClose}
            className="review hover:bg-teal-600 text-white rounded-md px-5 py-2 font-medium cursor-pointer"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}
