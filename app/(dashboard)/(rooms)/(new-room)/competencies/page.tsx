"use client"
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Tool from "@/public/assets/icons/Tooltip.svg"
import TextIcon from "@/public/assets/icons/Tect.svg"
import Image from "next/image";
import check from "@/public/assets/icons/Vector (1).svg"
import Link from "next/link";

export default function page() {
  const [competencies, setCompetencies] = useState([
    "Statistical & Predictive Analysis",
    "ETL & Data Processing",
    "Data Visualization (Power BI, Tableau)",
    "Stakeholder Communication & Reporting",
    "DAX",
    "PYTHON",
  ]);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const routes = useRouter();

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData("text/plain"));
    const newCompetencies = [...competencies];
    const draggedItem = newCompetencies[dragIndex];
    newCompetencies.splice(dragIndex, 1);
    newCompetencies.splice(dropIndex, 0, draggedItem);
    setCompetencies(newCompetencies);
  };

  const handleDoubleClick = (skill: string) => {
    setEditingSkill(skill);
    setEditingValue(skill);
  };

  const handleSaveEdit = () => {
    if (editingValue.trim()) {
      const newCompetencies = competencies.map(skill => 
        skill === editingSkill ? editingValue.trim() : skill
      );
      setCompetencies(newCompetencies);
    }
    setEditingSkill(null);
    setEditingValue("");
  };

  const handleCancelEdit = () => {
    setEditingSkill(null);
    setEditingValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  return (
    <>
      {/* Breadcrumb and Save Draft - Responsive */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link href="/showcase-rooms" className="hover:text-gray-800 transition">
              Showcase rooms
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">New</span>
          </div>
          <button 
            className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm font-medium"
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen flex items-start justify-center px-4 sm:px-6 md:px-8 pb-8">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl border border-gray-100">
          
          {/* Stepper - Responsive */}
          <div className="flex items-center text-sm font-medium gap-3 sm:gap-4 justify-center px-6 py-6 sm:py-8 border-b border-gray-200 bg-gray-50/50">
            
            {/* Step 1: Introduction - Completed */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
                <Image src={check} alt="" className="w-3 h-3" />
              </div>
              <span className="hidden sm:inline text-gray-600 font-medium">Introduction</span>
            </div>
            <span className="text-gray-300">›</span>
            
            {/* Step 2: Competencies - Current */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-md flex-shrink-0 font-semibold">
                2
              </div>
              <span className="hidden sm:inline text-gray-900 font-semibold">Competencies</span>
            </div>
            <span className="text-gray-300">›</span>
            
            {/* Step 3: Insights - Upcoming */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 text-gray-400 text-xs flex items-center justify-center rounded-full border-2 border-gray-300 bg-white flex-shrink-0 font-medium">
                3
              </div>
              <span className="hidden sm:inline text-gray-500 font-medium">Insights</span>
            </div>
          </div>

          {/* Content - Responsive Padding */}
          <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8">
            
            {/* Header */}
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center gap-2 flex-wrap">
                Core competencies
                <span className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full font-medium border border-blue-100">
                  AI Generated
                </span>
              </h2>
            </div>

            {/* Competencies List */}
            <div className="space-y-3">
              {competencies.map((skill, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  className="group flex justify-between items-center bg-white px-4 py-3 rounded-lg border border-gray-200 hover:border-teal-300 hover:shadow-md transition-all cursor-move"
                >
                  <span 
                    className="text-gray-800 text-sm font-medium flex gap-2 items-center cursor-pointer flex-1 min-w-0"
                    onDoubleClick={() => handleDoubleClick(skill)}
                  >
                    {editingSkill === skill ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleKeyPress}
                        className="bg-white border-2 border-teal-500 rounded-md px-3 py-1.5 text-sm focus:outline-none w-full max-w-md"
                        autoFocus
                      />
                    ) : (
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="flex-1 truncate">{skill}</span>
                        {skill === "Statistical & Predictive Analysis" && (
                          <button
                            className="flex-shrink-0 p-1 hover:bg-gray-100 rounded transition"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDoubleClick(skill);
                            }}
                          >
                            <Image 
                              src={TextIcon} 
                              alt="Edit" 
                              width={16} 
                              height={16} 
                              className="opacity-60 hover:opacity-100 transition"
                            />
                          </button>
                        )}
                      </div>
                    )}
                  </span>
                  
                  {/* Drag Handle */}
                  <div className="flex items-center ml-3 flex-shrink-0">
                    <div className="relative">
                      <button 
                        className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition"
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <Image src={Tool} alt="Drag handle" className="w-4 h-4" />
                      </button>
                      {hoveredSkill === skill && (
                        <div className="absolute top-1/2 left-full ml-3 -translate-y-1/2 w-64 p-3 text-sm bg-gray-900 text-white shadow-xl rounded-lg z-50">
                          <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-gray-900 transform rotate-45 -translate-y-1/2"></div>
                          <p className="font-medium mb-1">Drag to reorder</p>
                          <p className="text-gray-300 text-xs leading-relaxed">Move the skills in the order you want and feel free to adjust the skill</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons - Responsive */}
            <div className="mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3">
              <button 
                className="w-full sm:w-auto text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition shadow-sm text-sm font-medium"
                onClick={() => routes.push("/new-room")}
              >
                Back
              </button>
              <button 
                className="w-full sm:w-auto review text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 cursor-pointer transition shadow-md text-sm font-semibold"
                onClick={() => routes.push("/insights")}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
