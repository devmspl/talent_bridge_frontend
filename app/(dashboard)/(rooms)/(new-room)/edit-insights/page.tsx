"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
import { BsGripVertical } from "react-icons/bs";
import Tool from "@/public/assets/icons/Tooltip.svg"
import check from "@/public/assets/icons/Vector (1).svg"
import Doc from "@/public/assets/icons/doc.svg"
import cut from "@/public/assets/icons/cutt.svg"
import Link from "next/link";

const InsightsPage = () => {
  const [skills] = useState(["SQL", "Tableau", "Python", "Power Automate" , "DAX",
    "Power BI "
  ]);
   const [skills2] = useState(["Project Management", "Agile", "Scrum", "Process Improvement" , "Cpmmunication",
    "Patience "
  ]);
  const routes = useRouter()
  const [files, setFiles] = useState<any[]>([]);
   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        name: file.name,
        size: (file.size / 1024).toFixed(1) + " KB",
        progress: 50, // 
      }));
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };
  return (
    <>
      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
        <div>
        <Link href="/showcase-rooms">Showcase rooms </Link>  <span className='text-sm text-gray-500'>/ ...  </span>  <span className="text-gray-800 font-semibold"> / Edit Room</span>
        </div>

        <div className="flex gap-2">
          <button className="absolute top-4 right-4 text-sm border border-gray-300 px-4 py-1.5 rounded-md hover:bg-gray-50 cursor-pointer"
          >
            Save as draft
          </button>
        </div>
      </div>
      <div className="min-h-screen  px-6 py-8">
     
        <div className="relative bg-white rounded-xl max-w-xl mx-auto border border-gray-200 shadow-sm">
          <div className="flex text-gray-500 items-center w-full text-sm font-medium mb-6 gap-4 justify-center border-b border-gray-200 p-6 ">
            <div className="flex items-center gap-1 text-gray-500 ">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                {/* <AiOutlineCheck className="text-white text-xs" /> */}
                <Image src={check} alt="" />
              </div>
              Introductions
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 flex gap-2">
              <div className="w-5 h-5 review text-white text-xs flex items-center justify-center rounded-full">
                 <Image src={check} alt="" />
              </div>
              Competencies
            </div>
            <span className="text-gray-400">›</span>
            <div className="text-gray-500 rounded-full flex gap-2">
              <div className="w-5 h-5 review  text-white text-xs flex items-center justify-center rounded-full border">
                3
              </div> <span className=" text-[#0A0D14] font-inter font-medium text-[14px] leading-[20px] tracking-[-0.006em]">Insights</span></div>
          </div>
          <div className="px-6 py-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company name</label>
              <input
                type="text"
                defaultValue="GSTC Bank"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="text"
                defaultValue="http://www.designsystem.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
            </div>
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none ">
                  <option>Finance</option>
                  <option>Retail</option>
                  <option>Healthcare</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none ">
                  <option>&lt; 6 months</option>
                  <option>6-12 months</option>
                  <option>1+ year</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Team Size</label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-700 focus:outline-none ">
                <option>0-10</option>
                <option>10-25</option>
                <option>25+</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Summarise the value you added in 3 paragraphs</label>
              <textarea
                rows={4}
                placeholder="Type your message here"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none "
              />
              <p className="text-xs text-gray-500 mt-1">max 1200 characters (AI will tweak it in the preview)</p>
            </div>
            <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Technical skills</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    <div className="text-gray-800 flex items-center">
                      <span>{skill}</span>
                      {index === 0 && (
                        <Image
  src="/assets/icons/Tect.svg"
  alt="Text Icon"
  width={14}
  height={14}
  className="ml-2 cursor-pointer"
/>

                      )}
                    </div>
                    {/* <BsGripVertical size={18} className="text-gray-400 cursor-move" /> */}
                    <div className="flex items-center space-x-2">
                      <span className=" text-dark-400"><Image src={Tool} alt="" /> </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

             <div className="pt-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-600">Transferable skills</span>
                <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">
                  AI Generated
                </span>
              </div>
              <div className="space-y-2">
                {skills2.map((skill, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between bg-gray-50 text-sm px-4 py-2 rounded-md border border-gray-200 hover:bg-gray-100"
                  >
                    <div className="text-gray-800 flex items-center">
                      <span>{skill}</span>
                      {index === 0 && (
                        <Image
  src="/assets/icons/Tect.svg"
  alt="Text Icon"
  width={14}
  height={14}
  className="ml-2 cursor-pointer"
/>

                      )}
                    </div>
                    {/* <BsGripVertical size={18} className="text-gray-400 cursor-move" /> */}
                    <div className="flex items-center space-x-2">
                      <span className=" text-dark-400"><Image src={Tool} alt="" /> </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>



                   
     <div className="bg-[#F9FAFB] rounded-md mt-2 p-2">
       <div className="mb-5">
                    <label className="text-sm font-medium text-gray-800 block mb-1">Upload supporting materials (optional)</label>
                    <div className="border border-dashed bg-[#FFFFFF] border-gray-300 rounded-md flex items-center justify-center flex-col py-6 text-sm text-gray-600 h-[150px]">
                      <AiOutlineCloudUpload className="w-6 h-6 mb-2 text-gray-400" />
                      <p className="flex">
  Drag & drop file here or{" "}
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

     
     <div className="mt-4 space-y-3">
  {files.map((file, index) => (
    <div
      key={index}
      className="flex items-center justify-between   p-3 "
    >
      <div className="flex items-start flex-1 mr-3 gap-3">
        <Image src={Doc} alt="doc" className="w-8 h-6 mt-2" />

        <div className="flex-1">
          <p className="text-sm font-medium text-[#111827]  font-inter leading-5 tracking-normal">{file.name}</p>
          <p className="text-xs text-[#4B5563]">{file.size}</p>

          <div className="w-full bg-gray-200 h-1 rounded mt-2">
            <div
              className="bg-blue-500 h-1 rounded transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      <button
        onClick={() => removeFile(index)}
        className="ml-2 hover:opacity-80"
      >
        <Image src={cut} alt="remove" className="w-5 h-5" />
      </button>
    </div>
  ))}
 
</div>


   </div>
   <Link href="/edit-overview"> <button
    type="button"
    className="w-full flex  gap-2  border-gray-300 rounded-lg py-3 text-sm font-medium text-[#02ABAC] hover:bg-gray-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 text-[#02ABAC]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
    Add a new insight
  </button>
  </Link>



            <div className="mt-6 flex justify-end gap-3">
              <button className="text-gray-600 bg-gray-100 px-4 py-2 rounded-md hover:bg-gray-200 cursor-pointer"
                onClick={() => routes.push("/edit-room1")}
              >
                Back
              </button>
              <button className="review text-white px-6 py-2 rounded-md hover:bg-teal-600 cursor-pointer"
                onClick={() => routes.push("/edit-previiew")}
              >
                Preview
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default InsightsPage;
