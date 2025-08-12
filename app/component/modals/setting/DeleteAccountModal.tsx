"use client";
import { useState } from "react";
import { FiX } from "react-icons/fi";

export default function DeleteAccountModal({ onClose }: { onClose: () => void }) {
  const [confirmed, setConfirmed] = useState(false);

  const handleDelete = () => {
    if (confirmed) {
      alert("Account deleted!");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40`     bg-opacity-40">
      <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-xl relative">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <FiX size={20} />
        </button>

        {/* Title */}
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Delete your account</h2>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4">
          Are you sure you want to delete your account? This action is irreversible. Proceed or click
          cancel to keep your account.
        </p>

        {/* Checkbox */}.
        <label className="flex items-center text-sm text-gray-700 gap-2 mb-6 cursor-pointer">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          I confirm I want to delete my account
        </label>

        {/* Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-800 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed}
            className={`px-4 py-2 rounded-lg text-white ${
              confirmed ? "bg-red-600 hover:bg-red-700" : "bg-red-600 cursor-not-allowed"
            }`}
          >
            Yes, delete my account
          </button>
        </div>
      </div>
    </div>
  );
}
