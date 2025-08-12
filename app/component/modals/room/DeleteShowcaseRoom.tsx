import React, { useState } from 'react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Delete Showcase Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-700 mb-4">
          Are you sure you want to delete this room? This action is irreversible. Proceed or click cancel to keep this room.
        </p>

        {/* Checkbox */}
        <div className="flex items-center mb-6">
          <input
            id="confirmDelete"
            type="checkbox"
            className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            checked={isConfirmed}
            onChange={() => setIsConfirmed(!isConfirmed)}
          />
          <label htmlFor="confirmDelete" className="ml-2 block text-sm text-gray-700">
            I confirm I want to delete this showcase room
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            disabled={!isConfirmed}
            className={`px-4 py-2 text-sm font-medium text-white rounded-lg ${
              isConfirmed ? 'bg-red-600 hover:bg-red-700' : 'bg-red-300 cursor-not-allowed'
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
