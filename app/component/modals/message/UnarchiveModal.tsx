import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function UnarchiveModal({onClose } : any) {


  return (
    <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <IoClose size={24} />
            </button>

            <h2 className="text-lg font-semibold text-gray-900 mb-2">Archive Chat</h2>

            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to archive this chat
            </p>

            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
              >
                Back
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 cursor-pointer"
              >
                Yes, archive
              </button>
            </div>
          </div>
        </div>
    </>
  );
}
