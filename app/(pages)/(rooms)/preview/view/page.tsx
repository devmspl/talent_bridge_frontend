"use client";
import Image from "next/image";
import { useState } from "react";
import call from "@/public/assets/icons/call.svg";
import msg from "@/public/assets/icons/msgg.svg";
import share from "@/public/assets/icons/share.svg";
import linkIcon from "@/public/assets/icons/copy-link.svg";
import fileIcon from "@/public/assets/icons/doc.svg";
import logo from "@/public/assets/icons/logo.svg";
import profile from "@/public/assets/profile/image.svg";
import cards from "@/public/assets/profile/Cards.svg"
import progress from "@/public/assets/profile/File progress.svg"
import { AiOutlinePlayCircle } from "react-icons/ai";
import up from "@/public/assets/icons/up-arrow.svg"
import ShareRoom from "@/app/component/modals/room/ShareRoom";
import Link from "next/link";

export default function CaseStudyView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState<any>(profile);
  const [open, setOpen] = useState(false);

  const openPreview = (docId: number) => {
    if (docId === 3) {
      setModalImage(cards);
    } else if (docId === 4) {
      setModalImage(progress);
    } else {
      setModalImage(profile);
    }
    setIsModalOpen(true);
  };
  const achievements = [
    {
      id: 1,
      title: "Optimized Credit Risk Modeling",
      description:
        "Enhanced the bank's risk assessment framework, reducing loan default rates by 18% through improved data-driven insights.",
    },
    {
      id: 2,
      title: "Automated Customer Churn Prediction",
      description:
        "Developed a predictive model that increased retention strategies' effectiveness by 25%, minimizing customer attrition.",
    },
    {
      id: 3,
      title: "Enhanced Fraud Detection System",
      description:
        "Implemented anomaly detection techniques, leading to a 40% reduction in fraudulent transactions and improved security measures.",
    },
  ];

  const documents = [
    { id: 1, name: "Project Breakdown.mp4", size: "300 KB" },
    { id: 2, name: "Redacted Solution Architecture.pdf", size: "300 KB" },
    { id: 3, name: "Replica Dashboard for Credit Reporting.pbix", size: "300 KB" },
    { id: 4, name: "Project Challanges and Devised Solutions.docx", size: "300 KB" },
    { id: 5, name: "Project Challenges.mp4", size: "300 KB" },
  ];

  return (
    <>
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Top bar */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0 mb-4">
          <div className="w-full text-[#6B7280] text-xs py-2 flex items-center gap-1">
            <Link href="/preview"> <span>Data/BI Analyst</span></Link>
            <span className="text-[#111827]">/</span>
            <span className="font-medium font-weight-500 text-[#111827]">GSTC Bank</span>
          </div>
          <div className="flex items-center gap-2">
            <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={call} alt="" />
            <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7" src={msg} alt="" />
            <Image onClick={() => setOpen(true)} className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" src={share} alt="" />
          </div>
        </div>

        {/* Header card */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-4 mb-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-lg sm:text-xl lg:text-[20px] font-semibold text-[#111827]">GSTC Bank</h1>
              <span className="text-[11px] bg-[#F9FAFB] text-[#374151] px-2 py-0.5 rounded-full border border-[#E5E7EB] w-fit">
                Finance
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Image className="border border-[#D1D5DB] rounded-md p-[6px] w-6 h-6 sm:w-7 sm:h-7 cursor-pointer" src={linkIcon} alt="" />
            </div>
          </div>
        </div>


        {/* Key Achievements */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] mb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h2 className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#111827]">Key Achievements</h2>
              <span className="text-[11px] bg-[#F9FAFB] text-[#374151] px-2 py-0.5 rounded-full border border-[#E5E7EB] w-fit">
                AI Generated
              </span>
            </div>
          </div>
          <div className="border-t border-[#E5E7EB]" />
          <div className="p-4 space-y-3">
            {achievements.map((a) => (
              <div
                key={a.id}
                className="bg-[#F9FAFB] rounded-[10px] p-3"
              >
                <div className="text-sm sm:text-base lg:text-[16px] font-medium font-inter text-[#111827] mb-1">
                  {a.title}
                </div>
                <div className="text-xs sm:text-sm lg:text-[14px] font-regular text-[#4B5563]">{a.description}</div>
              </div>
            ))}
          </div>
        </div>


        {/* Supporting Documents */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] mb-4">
          <div className="p-4">
            <h3 className="text-sm sm:text-base lg:text-[16px] font-semibold text-[#111827]">Supporting Documents</h3>
          </div>
          <div className="border-t border-[#E5E7EB]" />
          <div className="p-4 space-y-3">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="bg-[#F9FAFB] rounded-[10px] p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Image src={fileIcon} alt="" width={18} height={18} className="sm:w-5 sm:h-5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs sm:text-sm lg:text-[14px] font-medium text-[#111827] truncate">{doc.name}</div>
                    <div className="text-xs sm:text-[12px] text-[#4B5563]">{doc.size}</div>
                  </div>
                </div>
                <button className="text-xs sm:text-[12px] text-[#374151] flex items-center gap-2 sm:gap-3 hover:text-gray-800 transition-colors" onClick={() => openPreview(doc.id)}>
                  View
                  <Image src={up} alt="" width={8} height={8} className="sm:w-2.5 sm:h-2.5" />
                </button> 
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-4 sm:py-6">
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 review rounded-full flex items-center justify-center">
              <Image src={logo} alt="" width={20} height={20} className="sm:w-6 sm:h-6" />
            </div>
            <span className="text-xs sm:text-sm text-gray-600">
              Powered by <span className="text-gray-800 font-semibold">TalentBridge.</span>
            </span>
          </div>
        </div>
      </div>
      {/* Preview Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsModalOpen(false)}>
          <div className="w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
            <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] rounded-lg overflow-hidden bg-transparent">
              <Image src={modalImage} alt="Preview" fill className="object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
    <ShareRoom
        isOpen={open}
        onClose={() => setOpen(false)}
        link="https://tbridge.com/{name-of-showcase-room}"
      />

    </>

    
  );
}


