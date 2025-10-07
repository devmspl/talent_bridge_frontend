import React, { useState, useRef, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { FiChevronDown } from 'react-icons/fi';

type VisibilityOption = 'Public' | 'Connected Only' | 'Only you';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: VisibilityOption) => void;
}

const options: { label: VisibilityOption; subtext: string }[] = [
  { label: 'Public', subtext: 'everyone' },
  { label: 'Connected Only', subtext: 'direct connections' },
  { label: 'Only you', subtext: 'not visible' },
];

const ChangeVisibilityModal: React.FC<Props> = ({ isOpen, onClose, onSave }) => {
  const [selected, setSelected] = useState<VisibilityOption>('Public');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-sm sm:max-w-md lg:max-w-lg p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition p-1"
        >
          <IoClose className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="pr-8 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Change Visibility
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Manage how you want your showcase room to be seen
          </p>
        </div>

        {/* Visibility Options */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-800 block mb-3">
            Set room visibility
          </label>
          
          {/* Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="w-full flex justify-between items-center px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 text-gray-900 text-sm sm:text-base rounded-lg bg-white hover:border-teal-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
            >
              <span className="truncate">{selected}</span>
              <FiChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {dropdownOpen && (
              <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {options.map((opt) => (
                  <div
                    key={opt.label}
                    onClick={() => {
                      setSelected(opt.label);
                      setDropdownOpen(false);
                    }}
                    className={`px-3 sm:px-4 py-3 cursor-pointer hover:bg-gray-50 transition ${
                      selected === opt.label ? 'bg-teal-50 border-l-4 border-teal-500' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm sm:text-base text-gray-900 font-medium block">
                          {opt.label}
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500">
                          {opt.subtext}
                        </span>
                      </div>
                      {selected === opt.label && (
                        <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer transition"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selected)}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white review hover:bg-teal-600 rounded-lg cursor-pointer transition shadow-md"
          >
            Set Visibility
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeVisibilityModal;
