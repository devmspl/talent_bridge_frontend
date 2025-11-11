"use client";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import { useArchiveRoomMutation } from "@/app/store/api/chatApi";
import { toast } from "react-toastify";

interface ArchiveModalProps {
  onClose: () => void;
  roomId: string;
}

export default function ArchiveModal({ onClose,
  //  roomId
   }: ArchiveModalProps) {

  const [archiveRoom, { isLoading }] = useArchiveRoomMutation();
  const [error, setError] = useState<string | null>(null);

  // const handleArchive = async () => {
  //   if (!roomId) {
  //     setError("No chat room selected");
  //     return;
  //   }

  //   try {
  //     const result = await archiveRoom(roomId).unwrap();
  //     if (result.success) {
  //       onClose();
  //       toast.success("Chat archived successfully");
  //     }
  //   } catch (err: any) {
  //     console.error('Failed to archive chat:', err);
  //     setError(err?.data?.message || 'Failed to archive chat');
  //   }
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer disabled:opacity-50"
        >
          <IoClose size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-900 mb-2">Archive Chat</h2>

        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to archive this chat?
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 text-sm rounded">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            // onClick={handleArchive}
            disabled={isLoading}
            className={`px-4 py-2 rounded-md ${
              isLoading ? 'bg-teal-400' : 'bg-teal-600 hover:bg-teal-700'
            } text-white cursor-pointer flex items-center gap-2`}
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Archiving...
              </>
            ) : (
              'Yes, archive'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}