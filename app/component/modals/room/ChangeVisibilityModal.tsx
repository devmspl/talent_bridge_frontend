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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[16px] font-semibold text-gray-900">Change Visibility</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 hover:cursor-pointer">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          Manage how you want your showcase room to be seen
        </p>

        {/* Label */}
        <label className="text-sm font-medium text-gray-800 block mb-1">Set room visibility</label>

        {/* Dropdown */}
        <div className="relative mb-6" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="w-full flex justify-between items-center px-4 py-2 border border-teal-200 text-gray-900 text-sm rounded-lg bg-white focus:outline-none"
          >
            {selected}
            <FiChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {dropdownOpen && (
            <div className="absolute  mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg">
              {options.map((opt) => (
                <div
                  key={opt.label}
                  onClick={() => {
                    setSelected(opt.label);
                    setDropdownOpen(false);
                  }}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <span className="text-sm text-gray-900 block">{opt.label}</span>
                  <span className="text-xs text-gray-500">{opt.subtext}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 w-100 hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(selected)}
            className="px-4 py-2 text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 rounded-lg w-100 hover:cursor-pointer"
          >
            Set Visibility
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangeVisibilityModal;
