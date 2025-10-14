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
      {/* Breadcrumb and Save Draft - Responsive */}
      <div className="mb-4 sm:mb-6 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center text-sm text-gray-600 flex-wrap">
            <Link href="/showcase-rooms" className="hover:text-gray-800 transition">
              Showcase rooms
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <Link href="/new-room" className="hover:text-gray-800 transition">
              Data Analytics Portfolio
            </Link>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-800 font-semibold">Bridge Point Case Study</span>
          </div>
          <button 
            className="w-full sm:w-auto text-sm text-gray-700 bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 cursor-pointer transition shadow-sm font-medium"
          >
            Save as draft
          </button>
        </div>
      </div>

      <div className="min-h-screen bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        <div className="w-full max-w-6xl mx-auto space-y-4 sm:space-y-6">
          
          {/* Project Overview Section - Responsive */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 truncate">{companyName}</h1>
                  <span className="text-xs bg-gray-100 px-2 py-1 rounded-full text-gray-700 border border-gray-200 w-fit">
                    {industryTag}
                  </span>
                </div>
                <h2 className="text-sm sm:text-base md:text-lg text-gray-600 leading-relaxed">
                  {projectDescription}
                </h2>
              </div>
              <div className="flex-shrink-0">
                <button className="border border-gray-300 rounded-md p-2 hover:bg-gray-50 transition">
                  <Image className="w-5 h-5 sm:w-6 sm:h-6" src={Share} alt="Share" />
                </button>
              </div>
            </div>
          </div>

          {/* Key Metrics Section - Responsive Grid */}
          <div className="bg-white rounded-lg   sm:p-6"style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Duration */}
              <div className="border rounded-lg border-gray-200 p-4 sm:p-5 lg:p-6 bg-gray-50/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Duration</span>
                    <Image src={clock} alt="Duration" className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">6 months</div>
                </div>
              </div>
              
              {/* Team Size */}
              <div className="border rounded-lg border-gray-200 p-4 sm:p-5 lg:p-6 bg-gray-50/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Team size</span>
                    <Image src={users} alt="Team" className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">12</div>
                </div>
              </div>
              
              {/* Impact Score */}
              <div className="border rounded-lg border-gray-200 p-4 sm:p-5 lg:p-6 bg-gray-50/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Impact Score</span>
                    <Image src={target} alt="Impact" className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">98%</div>
                </div>
              </div>
              
              {/* Case Study Strength */}
              <div className="border rounded-lg border-gray-200 p-4 sm:p-5 lg:p-6 bg-gray-50/50">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">Case study strength</span>
                    <Image src={startup} alt="Strength" className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">91%</span>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full border border-green-200 w-fit font-medium">
                      Excellent
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Achievements Section - Responsive */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Key Achievements</h3>
              <span className="text-xs bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full font-medium border border-blue-100 w-fit">
                AI Generated
              </span>
            </div>
            
            <div className="space-y-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-white border border-gray-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow">
                  <div className="flex flex-col gap-4">
                    <div className="flex-1 min-w-0">
                      {editingAchievement === achievement.id ? (
                        <div className="space-y-4">
                          <input
                            type="text"
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            className="w-full text-base font-semibold text-gray-900 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                            placeholder="Achievement title"
                          />
                          <textarea
                            value={editingDescription}
                            onChange={(e) => setEditingDescription(e.target.value)}
                            className="w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none"
                            rows={4}
                            placeholder="Achievement description"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={handleSaveEdit}
                              className="text-sm review text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition font-medium"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-sm bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 leading-tight">{achievement.title}</h4>
                          <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-4">{achievement.description}</p>
                        </>
                      )}
                    </div>
                    {editingAchievement !== achievement.id && (
                      <div className="flex items-center justify-end gap-3 pt-2 border-t border-gray-100">
                        <button 
                          className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition text-sm font-medium"
                          onClick={() => handleEditAchievement(achievement)}
                        >
                          <Image className='w-4 h-4' src={edit} alt="Edit" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button 
                          className="flex items-center gap-2 px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition text-sm font-medium"
                          onClick={() => handleDeleteAchievement(achievement.id)}
                        >
                          <Image className='w-4 h-4' src={deleted} alt="Delete" />
                          <span className="hidden sm:inline">Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supporting Documents Section - Responsive */}
          <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h3>
            
            <div className="space-y-3 border-t border-gray-200 pt-4">
              {documents.map((doc) => (
                <div key={doc.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="text-gray-500 flex-shrink-0">
                        <FiFile className="w-5 h-5 sm:w-6 sm:h-6" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-sm font-medium text-gray-900 truncate">{doc.name}</div>
                        <div className="text-xs text-gray-500">{doc.size}</div>
                      </div>
                    </div>
                    <button 
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition flex-shrink-0"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <Image src={deleted} alt="Delete" className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              ))}
              
              {/* File Upload Area - Responsive */}
              <div className="border border-dashed bg-white border-gray-300 rounded-md flex items-center justify-center flex-col py-6 sm:py-8 text-sm text-gray-600 min-h-[120px] sm:min-h-[150px]">
                <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                <p className="flex flex-col sm:flex-row items-center gap-1 text-center px-2">
                  <span className="hidden sm:inline">Drag & drop file here or</span>
                  <span className="sm:hidden">Upload files or</span>
                  <label className="text-blue-600 font-medium cursor-pointer hover:underline">
                    choose file
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </p>
                <p className="text-gray-500 text-xs mt-1">JPEG, PNG, PDF, and MP4 formats, up to 50 MB.</p>
              </div>
            </div>
          </div>

          {/* Navigation Buttons - Responsive */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-3">
            <button 
              className="w-full sm:w-auto text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition shadow-sm text-sm font-medium"
              onClick={() => router.back()}
            >
              Back
            </button>
            <button 
              className="w-full sm:w-auto review text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 cursor-pointer transition shadow-md text-sm font-semibold"
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
