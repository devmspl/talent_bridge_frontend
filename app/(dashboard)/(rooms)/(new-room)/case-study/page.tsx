"use client";
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { FiClock, FiUsers, FiTarget, FiZap, FiEdit2, FiTrash2, FiLink, FiFile } from 'react-icons/fi';
import Share from "@/public/assets/icons/copy-link.svg"
import clock from "@/public/assets/icons/clock.svg"
import target from "@/public/assets/icons/target.svg"
import users from "@/public/assets/icons/users.svg" 
import startup from "@/public/assets/icons/startup.svg"
import edit from "@/public/assets/icons/edit.svg"
import deleted from "@/public/assets/icons/trash-3.svg"

import Image from 'next/image';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import PublishModal from '@/app/component/modals/showcase-modal/showcase-model';

export default function CaseStudyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // Get data from URL parameters
  const companyName = searchParams.get('title') || 'Pet World Co';
  const projectDescription = searchParams.get('description') || 'Data Analysis & Financial Reporting Project';
  const industryTag = searchParams.get('tag') || 'Finance';
  const [editingAchievement, setEditingAchievement] = useState<number | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [editingDescription, setEditingDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [achievements, setAchievements] = useState([
    {
      id: 1,
      title: "Optimized Credit Risk Modeling",
      description: "Enhanced the bank's risk assessment framework, reducing loan default rates by 18% through improved data-driven insights."
    },
    {
      id: 2,
      title: "Automated Customer Churn Prediction",
      description: "Developed a predictive model that increased retention strategies' effectiveness by 25%, minimizing customer attrition."
    },
    {
      id: 3,
      title: "Enhanced Fraud Detection System",
      description: "Implemented anomaly detection techniques, leading to a 40% reduction in fraudulent transactions and improved security measures."
    }
  ]);

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: "Project Breakdown.mp4",
      size: "300 KB"
    },
    {
      id: 2,
      name: "Redacted Solution Architecture.pdf",
      size: "300 KB"
    },
    {
        id: 3,
        name: "Replica Dashboard for Credit Reporting.pbix",
        size: "300 KB"
      },
      {
        id: 4,
        name: "Project Challanges and Devised Solution.docx",
        size: "300 KB"
      },
      {
        id: 5,
        name: "Project Challanges.mp4",
        size: "300 KB"
      }
  ]);

  const handleDeleteAchievement = (id: number) => {
    setAchievements(achievements.filter(achievement => achievement.id !== id));
  };

  const handleEditAchievement = (achievement: any) => {
    setEditingAchievement(achievement.id);
    setEditingTitle(achievement.title);
    setEditingDescription(achievement.description);
  };

  const handleSaveEdit = () => {
    if (editingTitle.trim() && editingDescription.trim()) {
      setAchievements(achievements.map(achievement => 
        achievement.id === editingAchievement 
          ? { ...achievement, title: editingTitle.trim(), description: editingDescription.trim() }
          : achievement
      ));
    }
    setEditingAchievement(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const handleCancelEdit = () => {
    setEditingAchievement(null);
    setEditingTitle("");
    setEditingDescription("");
  };

  const handleDeleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Date.now() + Math.random(), // Generate unique ID
        name: file.name,
        size: formatFileSize(file.size),
      }));
      setDocuments([...documents, ...newFiles]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };
  return (
    <>
      <div className="mb-4 text-[14px] text-[#6B7280] flex justify-between items-center">
        <div>
          <Link href="/showcase-rooms">Showcase rooms</Link> 
          <span className="text-gray-400"> / </span>
          <Link href="/new-room">Data Analytics Portfolio</Link>
          <span className="text-gray-400"> / </span>
          <span className="text-[#111827] font-medium text-[14px] font-weight-[500]">Bridge Point Case Study</span>
        </div>
        <div className="flex gap-2">
          <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer">
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-white mt-6" >
        <div className="w-full mx-auto  space-y-4">
          
          {/* Project Overview Section */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-6">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-[24px] font-inter font-semibold text-[#111827]">{companyName}</h1>
                  <span className="text-[12px] bg-gray-100 px-2 py-0.5 rounded-[20px] text-[#374151] border border-[#E5E7EB]">
                    {industryTag}
                  </span>
                </div>
                <h2 className="text-[18px] font-regular font-inter text-[#4B5563]">
                  {projectDescription}
                </h2>
              </div>
              <div className="text-gray-400">
                <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-7 h-7  " src={Share} alt=""  />
              </div>
            </div>
          </div>

          {/* Key Metrics Section */}
          <div className="bg-white rounded-lg ">
            <div className="grid grid-cols-4 gap-4">
           
            <div className="border rounded border-[#E5E7EB] p-[24px]">
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#4B5563]">Duration</span>
      <Image src={clock} alt="" />
    </div>
    <div className="text-[30px] font-semibold text-[#111827]">6 months</div>
  </div>
</div>
              
              
<div className="border rounded border-[#E5E7EB] p-[24px]">
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#4B5563]">Team size</span>
      <Image src={users} alt="" />
    </div>
    <div className="text-[30px] font-semibold text-[#111827]">12</div>
  </div>
</div>
              
         
<div className="border rounded border-[#E5E7EB] p-[24px]">
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#4B5563]">Impact Score</span>
      <Image src={target} alt="" />
    </div>
    <div className="text-[30px] font-semibold text-[#111827]">98%</div>
  </div>
</div>
            

<div className="border rounded border-[#E5E7EB] p-[24px]">
  <div className="flex flex-col gap-1">
    <div className="flex items-center justify-between">
      <span className="text-[14px] text-[#4B5563]">Case study strength</span>
      <Image src={startup} alt="" />
    </div>
    <div className="flex items-center gap-2 text-[30px] font-semibold text-[#111827]">
  <span>91%</span>
  <span className="text-[12px] bg-[#F0FDF4] text-[#15803D] px-1 py-0.5 rounded-[20px] border border-[#BBF7D0]">
    Excellent
  </span>
</div>
    
  </div>
</div>
            </div>
          </div>

          {/* Key Achievements Section */}
          <div className="bg-white rounded-lg border border-[#E5E7EB] p-4">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-[18px] font-semibold text-[#111827]">Key Achievements</h3>
              <span className="text-[12px] bg-[#F9FAFB] border border-[#E5E7EB] px-2 py-0.5 rounded-[20px] text-[#374151]">
                AI Generated
              </span>
            </div>
            
            <div className="space-y-2">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-[#F9FAFB] rounded-[10px] p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingAchievement === achievement.id ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full text-[16px] font-inter font-medium text-[#111827] bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500"
                            placeholder="Achievement title"
                          />
                          <textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            className="w-full text-[14px] font-regular text-[#4B5563] bg-white border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
                            rows={3}
                            placeholder="Achievement description"
                          />
                          <div className="flex gap-2">
                            <button
                              onClick={handleSaveEdit}
                              className="text-xs review text-white px-3 py-1 rounded hover:bg-teal-700"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-xs bg-gray-300 text-gray-700 px-3 py-1 rounded hover:bg-gray-400"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-[16px] font-inter font-medium text-[#111827] mb-1">{achievement.title}</h4>
                          <p className="text-[14px] font-regular text-[#4B5563]">{achievement.description}</p>
                        </>
                      )}
                    </div>
                    {editingAchievement !== achievement.id && (
                      <div className="flex items-center gap-[8px]">
                        <button 
                          className="text-gray-400 hover:text-gray-600"
                          onClick={() => handleEditAchievement(achievement)}
                        >
                          <Image className='w-[20px] h-[20px]' src={edit} alt="" />
                        </button>
                        <button 
                          className="text-gray-400 hover:text-red-600"
                          onClick={() => handleDeleteAchievement(achievement.id)}
                        >
                          <Image className='w-[20px] h-[20px]' src={deleted} alt="" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Documents Section */}
          <div className="bg-white rounded-[16px] border border-[#E5E7EB] p-4">
            <h3 className="text-[18px] font-semibold text-[#111827]   p-5">Supporting Documents</h3>
            
            <div className="space-y-2 p-5 border-t border-[#E5E7EB]">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-[#F9FAFB] rounded-[10px] p-4 ">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="text-[#374151]">
                        <FiFile className="w-[24px] h-[24px]" />
                      </div>
                      <div>
                        <div className="text-[14px] font-medium text-[#111827]">{doc.name}</div>
                        <div className="text-[12px] text-[#4B5563]">{doc.size}</div>
                      </div>
                    </div>
                    <button 
                      className="text-gray-400 "
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      {/* <FiTrash2 className="w-3 h-3" /> */}
                      <Image  src={deleted} alt="" style={{width: '20px', height: '20px'}}/>
                    </button>
                  </div>
                </div>

                
              ))}
               <div className="mb-5">
                    <div className="border border-dashed bg-[#FFFFFF] border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600 h-[150px]">
                      <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="flex">
  Drag & drop file here or {" "}
  <label className="text-blue-600 font-medium cursor-pointer">
    choose file 
    
    <input
      type="file"
      className="hidden"
      multiple
      onChange={handleFileChange}
    />
  </label>
</p>
<p className="text-[#4B5563]">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</p>
                    </div>
                  </div>
            </div>
          </div>


         

          {/* Navigation Buttons */}
          <div className="flex justify-end gap-3">
            <button 
              className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button 
              className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
              onClick={() => setIsModalOpen(true)}
            >
              Publish
            </button>
          </div>
        </div>
      </div>
      <PublishModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
