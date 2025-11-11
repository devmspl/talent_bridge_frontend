import React, { useState } from 'react';
import tick from "@/public/assets/tick.svg";
import Image from 'next/image';
interface DeleteShowcaseRoomProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
}

const DeleteShowcaseRoom: React.FC<DeleteShowcaseRoomProps> = ({
  isOpen,
  onClose,
  onDelete,
}) => {
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm sm:max-w-md lg:max-w-lg w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 sm:top-6 right-4 text-gray-400 hover:text-gray-600 cursor-pointer transition p-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="pr-8 mb-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
            Delete Showcase Room
          </h2>
        </div>

        {/* Warning Icon */}
    
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
        </div>

        {/* Message */}
        <div className="text-center mb-6">
          <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
            Are you sure you want to delete this room?
          </p>
          <p className="text-xs sm:text-sm text-red-600 font-medium">
            This action is irreversible and cannot be undone.
          </p>
        </div>

        {/* Checkbox */}
        <div className="mb-6">
          <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
            <div className="relative flex-shrink-0 mt-0.5">
              <input
                id="confirmDelete"
                type="checkbox"
                className="peer h-4 w-4 sm:h-5 sm:w-5 rounded border-2 border-gray-300 checked:border-red-500 checked:bg-red-50 appearance-none focus:ring-2 focus:ring-red-500 focus:ring-offset-0"
                checked={isConfirmed}
                onChange={() => setIsConfirmed(!isConfirmed)}
              />
              <svg className="absolute left-0.5 top-0.5 sm:left-1 sm:top-1 hidden peer-checked:block h-2 w-2 sm:h-3 sm:w-3 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="leading-relaxed">
              I confirm I want to delete this showcase room
            </span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={
              onDelete}
            disabled={!isConfirmed}
            className={`w-full sm:w-auto px-4 sm:px-6 py-2.5 sm:py-3 text-sm font-medium text-white rounded-lg transition ${
              isConfirmed 
                ? 'bg-red-600 hover:bg-red-700 shadow-md' 
                : 'bg-red-300 cursor-not-allowed'
            }`}
          >
            Yes, delete room
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteShowcaseRoom;
