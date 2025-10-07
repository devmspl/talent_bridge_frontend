"use client"
import { useRouter } from "next/navigation";
import { AiOutlineCheck } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import Tool from "@/public/assets/icons/Tooltip.svg"
import TextIcon from "@/public/assets/icons/Tect.svg"
import Image from "next/image";
import check from "@/public/assets/icons/Vector (1).svg"
import Link from "next/link";
import { useState } from "react";

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
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
       <Link href="/showcase-rooms">  Showcase rooms</Link> <span className="text-sm text-gray-500">/ ... </span> <span className="text-gray-800 font-semibold"> / Edit Room</span>
        </div>
        <div className="flex gap-2">
          <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Save as draft
          </button>
        </div>
      </div>
      <div className="min-h-screen  p-8 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg w-full max-w-2xl ">
          <div className="flex text-gray-500 items-center w-full text-sm font-medium mb-4 gap-4 justify-center border-b border-gray-200 p-6 ">
            <div className="flex items-center gap-1 text-gray-500 ">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                 <Image src={check} alt="" />
              </div>
              Introduction
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 flex gap-2">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                2
              </div>
              <span className="text-[#0A0D14] font-inter font-medium text-[14px] leading-[20px] tracking-[-0.006em]">Competencies</span>
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5   text-gray text-xs flex items-center justify-center rounded-full border">
                3
              </div> Insights</div>
          </div>
          <div className="p-4">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-md font-medium text-[#374151]">
                Core competencies
                <span className="ml-2 text-xs bg-gray-200 px-2 py-0.5 rounded-full text-[#374151]">
                  AI Generated
                </span>
              </h2>
            </div>
            <div className="space-y-3">
              {competencies.map((skill, i) => (
                <div
                  key={i}
                  draggable
                  onDragStart={(e) => handleDragStart(e, i)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, i)}
                  className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-100 transition"
                >
                  <span 
                    className="text-gray-800 text-sm flex gap-3 items-center cursor-pointer"
                    onDoubleClick={() => handleDoubleClick(skill)}
                  >
                    {editingSkill === skill ? (
                      <input
                        type="text"
                        value={editingValue}
                        onChange={(e) => setEditingValue(e.target.value)}
                        onBlur={handleSaveEdit}
                        onKeyDown={handleKeyPress}
                        className="bg-white border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 w-80"
                        autoFocus
                      />
                    ) : (
                      <>
                        {skill}
                        {skill === "Statistical & Predictive Analysis" && (
                          <Image 
                            src={TextIcon} 
                            alt="Edit" 
                            width={16} 
                            height={16} 
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDoubleClick(skill);
                            }}
                          />
                        )}
                      </>
                    )}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <span 
                        className="text-gray-400 cursor-pointer"
                        onMouseEnter={() => setHoveredSkill(skill)}
                        onMouseLeave={() => setHoveredSkill(null)}
                      >
                        <Image src={Tool} alt="Drag handle" />
                      </span>
                      {hoveredSkill === skill && (
                        <div className="absolute top-1/2 left-full ml-2 -translate-y-1/2 w-64 p-3 text-sm bg-white border border-gray-300 shadow-lg rounded-md z-10">
                          <div className="absolute top-1/2 -left-1 w-2 h-2 bg-white border-r border-b border-gray-300 transform rotate-45 -translate-y-1/2"></div>
                          <strong className="block text-gray-800 mb-1">Tooltip</strong>
                          <p className="text-gray-600">Move the skills in the order you want and feel free to adjust the skill</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => routes.push("/edit-room")}
              >
                Back
              </button>
              <button className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/edit-insights")}
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
