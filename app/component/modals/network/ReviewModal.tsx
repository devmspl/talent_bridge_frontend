"use client"
import React, { useState } from "react";
import { AiFillStar, AiOutlineStar, AiFillCloseCircle } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";

export default function ReviewModal({ onClose }: any) {
  const [rating, setRating] = useState(4.7);
  const [hover, setHover] = useState(0);
  const [message, setMessage] = useState("");

  const handleRating = (value : any) => {
    setRating(value);
  };

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.25 && rating % 1 <= 0.75;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <AiFillStar
            key={i}
            className="text-yellow-400 w-6 h-6 cursor-pointer"
            onClick={() => handleRating(i)}
          />
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <div key={i} className="relative w-6 h-6 cursor-pointer" onClick={() => handleRating(i)}>
            <AiFillStar className="text-yellow-400 absolute w-3 h-6 overflow-hidden" style={{ clipPath: 'inset(0 50% 0 0)' }} />
            <AiOutlineStar className="text-yellow-400 absolute w-6 h-6" />
          </div>
        );
      } else {
        stars.push(
          <AiOutlineStar
            key={i}
            className="text-yellow-400 w-6 h-6 cursor-pointer"
            onClick={() => handleRating(i)}
          />
        );
      }
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg h-auto max-h-fit p-6 relative overflow-hidden">

        <button className="absolute top-4 right-4 text-gray-500 hover:text-gray-500 cursor-pointer" 
        onClick={onClose}>
          <IoMdClose size={24} />
        </button>
        <h2 className="text-xl font-semibold mb-4">Share Your Experience</h2>
        <p className="text-gray-600 mb-4">
          Your feedback matters! Leave an honest review based on your interaction with this recruiter. Whether it was a great experience or room for improvement, your insights help others make informed decisions.
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here"
          className="w-full border border-gray-300 rounded-md p-3 resize-none h-28 mb-4"
          maxLength={1200}
        />
        <span className="text-gray ">max 1200 characters </span>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1 gap-2">{renderStars()} <span className="text-gray-700 ">| {rating.toFixed(2)} </span></div>
          
        </div>
        <div className="mt-6 flex justify-end space-x-3">
          <button className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100 cursor-pointer"
           onClick={onClose}>
            Cancel
          </button>
          <button className="px-4 py-2 rounded-md bg-teal-600 text-white hover:bg-teal-700 cursor-pointer">
            Add review
          </button>
        </div>
      </div>
    </div>
  );
}