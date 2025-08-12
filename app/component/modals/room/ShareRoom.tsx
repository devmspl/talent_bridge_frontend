import React from 'react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaRedditAlien,
} from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { FiCopy } from 'react-icons/fi';

interface ShareRoomProps {
  isOpen: boolean;
  onClose: () => void;
  link: string;
}

const ShareRoom: React.FC<ShareRoomProps> = ({
  isOpen,
  onClose,
  link,
}) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    alert('Link copied to clipboard!');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600 ">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Share Showcase Room</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 Showcase rooms hover:cursor-pointer">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-700 mb-4">
          Copy and share your showcase room with the world
        </p>

        <label className="text-sm font-medium text-gray-800 block mb-1">Showcase Link</label>
        <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2 mb-4">
          <input
            type="text"
            value={link}
            readOnly
            className="bg-transparent w-full text-sm text-gray-800 outline-none"
          />
          <button onClick={handleCopy} className="text-gray-500 hover:text-gray-700 hover:cursor-pointer">
            <FiCopy />
          </button>
        </div>

        <div className="flex">
        <p className="text-sm text-gray-600 mb-2 ">Share link on:</p>
        <div className="flex space-x-3 mb-6">
          <a href="#" className="text-blue-600 hover:text-blue-700"><FaFacebookF /></a>
          <a href="#" className="text-blue-800 hover:text-blue-900"><FaLinkedinIn /></a>
          <a href="#" className="text-black hover:text-gray-800"><FaXTwitter /></a>
          <a href="#" className="text-orange-500 hover:text-orange-600"><FaRedditAlien /></a>
        </div>
        </div>

        <button
          onClick={onClose}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium py-2 rounded-lg hover:cursor-pointer"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareRoom;
