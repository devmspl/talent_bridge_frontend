import React, { useMemo } from 'react';
import {
  FaFacebookF,
  FaLinkedinIn,
  FaXTwitter,
  FaRedditAlien,
} from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { FiCopy } from 'react-icons/fi';
import { toast } from 'react-toastify';

interface ShareRoomProps {
  isOpen: boolean;
  onClose: () => void;
  link?: string;
  roomId?: string;
  roomName?: string;
}

const ShareRoom: React.FC<ShareRoomProps> = ({
  isOpen,
  onClose,
  link,
  roomId,
  roomName = 'Showcase Room',
}) => {
  // Generate the shareable link
  const shareableLink = useMemo(() => {
    if (link) return link;
    if (typeof window !== 'undefined' && roomId) {
      // Use environment variable for production, fallback to window.location.origin for local
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
      return `${baseUrl}/preview?id=${roomId}`;
    }
    return '';
  }, [link, roomId]);

  const handleCopy = () => {
    if (shareableLink) {
      navigator.clipboard.writeText(shareableLink);
      toast.success('Link copied to clipboard!');
    }
  };

  // Generate social share URLs
  const encodedUrl = encodeURIComponent(shareableLink);
  const encodedTitle = encodeURIComponent(roomName);
  const encodedText = encodeURIComponent(`Check out my showcase room: ${roomName}`);

  const socialShareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
  };

  const handleSocialShare = (platform: keyof typeof socialShareUrls, e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    if (shareableLink) {
      const url = socialShareUrls[platform];
      window.open(url, '_blank', 'width=600,height=400');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-600/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-sm sm:max-w-md lg:max-w-lg w-full p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
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
            Share Showcase Room
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Copy and share your showcase room with the world
          </p>
        </div>

        {/* Link Section */}
        <div className="mb-6">
          <label className="text-sm font-medium text-gray-800 block mb-2">
            Showcase Link
          </label>
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3">
            <input
              type="text"
              value={shareableLink}
              readOnly
              className="bg-transparent w-full text-sm text-gray-800 outline-none flex-1 min-w-0"
            />
            <button 
              onClick={handleCopy} 
              className="text-gray-500 hover:text-gray-700 cursor-pointer transition p-1 hover:bg-gray-200 rounded"
              title="Copy link"
            >
              <FiCopy className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Social Share Section */}
        <div className="mb-6">
          <p className="text-sm font-medium text-gray-800 mb-3">
            Share link on:
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-4 sm:gap-6">
            <a 
              href={socialShareUrls.facebook}
              onClick={(e) => handleSocialShare('facebook', e)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition text-sm sm:text-base"
              aria-label="Share on Facebook"
            >
              <FaFacebookF />
            </a>
            <a 
              href={socialShareUrls.linkedin}
              onClick={(e) => handleSocialShare('linkedin', e)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-blue-800 text-white rounded-full hover:bg-blue-900 transition text-sm sm:text-base"
              aria-label="Share on LinkedIn"
            >
              <FaLinkedinIn />
            </a>
            <a 
              href={socialShareUrls.twitter}
              onClick={(e) => handleSocialShare('twitter', e)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full hover:bg-gray-800 transition text-sm sm:text-base"
              aria-label="Share on X (Twitter)"
            >
              <FaXTwitter />
            </a>
            <a 
              href={socialShareUrls.reddit}
              onClick={(e) => handleSocialShare('reddit', e)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-orange-500 text-white rounded-full hover:bg-orange-600 transition text-sm sm:text-base"
              aria-label="Share on Reddit"
            >
              <FaRedditAlien />
            </a>
          </div>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full review hover:bg-teal-600 text-white text-sm font-medium py-2.5 sm:py-3 rounded-lg cursor-pointer transition shadow-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ShareRoom;
