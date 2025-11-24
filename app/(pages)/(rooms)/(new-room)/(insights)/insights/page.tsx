  "use client"
  import Image from "next/image";
  import { useRouter } from "next/navigation";
  import { useEffect, useMemo, useState, useRef } from "react";
  import { AiOutlineAccountBook, AiOutlineCheck, AiOutlineCloudUpload, AiOutlineEdit } from "react-icons/ai";
  import Edit from "@/public/assets/icons/editskill.svg"
  import { BsGripVertical } from "react-icons/bs";
  import Tool from "@/public/assets/icons/Tooltip.svg"
  import check from "@/public/assets/icons/Vector (1).svg"
  import Doc from "@/public/assets/icons/doc.svg"
  import cut from "@/public/assets/icons/cutt.svg"
  import Link from "next/link";
  import { lsGet, lsSet, ROOM_KEYS, InsightsData } from "@/app/utils/roomStorage";

  const InsightsPage = () => {
    const [skills, setSkills] = useState<string[]>(["SQL", "Tableau", "Python", "Power Automate", "DAX", "Power BI"]);
    const [skills2, setSkills2] = useState<string[]>(["Project Management", "Agile", "Scrum", "Process Improvement", "Communication", "Patience"]);
    const routes = useRouter()
    const [duration, setDuration] = useState("< 6 months");
    const [teamSize, setTeamSize] = useState("0-10");
    const [industry, setIndustry] = useState("");
    const [companyName, setCompanyName] = useState("");
    const [website, setWebsite] = useState("");
    const [summary, setSummary] = useState("");
    const [insights, setInsights] = useState<{ title: string; description: string; tag: string; files?: any[] }[]>([]);
    const [files, setFiles] = useState<any[]>([]);
    const [selectedTech, setSelectedTech] = useState<string[]>([]);
    const [selectedTransferable, setSelectedTransferable] = useState<string[]>([]);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const newFiles = Array.from(e.target.files).map((file) => {
          const url = URL.createObjectURL(file);
          const isImage = file.type.startsWith('image/');
          const isVideo = file.type.startsWith('video/');
          return {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " KB",
            progress: 100,
            url,
            type: isImage ? 'image' : isVideo ? 'video' : 'file',
            file, 
          };
        });
        setFiles([...files, ...newFiles]);
        const savedData = lsGet<InsightsData>(ROOM_KEYS.insights, {
          companyName: "",
          website: "",
          industry: "",
          duration: "< 6 months",
          teamSize: "0-10",
          summary: "",
          technicalSkills: [],
          transferableSkills: [],
          insights: [],
        } as any);
        (savedData as any).currentFormFiles = newFiles.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
          data: f.url,
        }));
        lsSet(ROOM_KEYS.insights, savedData as any);
      }
    };

    const removeFile = (index: number) => {
      setFiles(files.filter((_, i) => i !== index));
    };

    // hydrate from localStorage
    useEffect(() => {
      const savedSelected = lsGet<string[]>(ROOM_KEYS.competencies, []);
      const savedInsights = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName: "",
        website: "",
        industry: "",
        duration: "< 6 months",
        teamSize: "0-10",
        summary: "",
        technicalSkills: [],
        transferableSkills: [],
        insights: [],
      });
      setCompanyName(savedInsights.companyName || "");
      setWebsite(savedInsights.website || "");
      setIndustry(savedInsights.industry || "");
      setDuration(savedInsights.duration || "< 6 months");
      setTeamSize(savedInsights.teamSize || "0-10");
      setSummary(savedInsights.summary || "");
      // hydrate selected skills (fallback to competencies if present)
      setSelectedTech(Array.isArray(savedInsights.technicalSkills) && savedInsights.technicalSkills.length ? savedInsights.technicalSkills : savedSelected);
      setSelectedTransferable(
        Array.isArray(savedInsights.transferableSkills) && savedInsights.transferableSkills.length
          ? savedInsights.transferableSkills
          : savedSelected
      );

      const sanitized = (savedInsights.insights || []).map((it: any) => ({
        title: it?.title || "",
        description: it?.description || "",
        tag: it?.tag || "",
      }));
      setInsights(sanitized);
    
      lsSet(ROOM_KEYS.insights, {
        companyName: savedInsights.companyName || "",
        website: savedInsights.website || "",
        industry: savedInsights.industry || "",
        duration: savedInsights.duration || "< 6 months",
        teamSize: savedInsights.teamSize || "0-10",
        summary: savedInsights.summary || "",
        technicalSkills: Array.isArray(savedInsights.technicalSkills) ? savedInsights.technicalSkills : [],
        transferableSkills: Array.isArray(savedInsights.transferableSkills) ? savedInsights.transferableSkills : [],
        insights: sanitized,
      });
    }, []);

    // persist to localStorage on changes
    useEffect(() => {
      // Sanitize insights before persisting to avoid storing any extra fields or file data
      const sanitizedInsights = (insights || []).map((it: any) => ({
        title: it?.title || "",
        description: it?.description || "",
        tag: it?.tag || "",
      }));
      const data: InsightsData = {
        companyName,
        website,
        industry,
        duration,
        teamSize,
        summary,
        technicalSkills: selectedTech,
        transferableSkills: selectedTransferable,
        insights: sanitizedInsights,
      };
      lsSet(ROOM_KEYS.insights, data);
    }, [companyName, website, industry, duration, teamSize, summary, selectedTech, selectedTransferable, insights]);

    const toggleTech = (s: string) => {
      setSelectedTech((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    };

    const toggleTransferable = (s: string) => {
      setSelectedTransferable((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
    };

    // Drag & drop + inline edit support for skills lists
    const [editingSkill, setEditingSkill] = useState<string | null>(null);
    const [editingList, setEditingList] = useState<'technical' | 'transferable' | null>(null);
    const [editingValue, setEditingValue] = useState("");
    const lastTapRef = useRef<number | null>(null);

    // handle double-tap (mobile) to edit
    const handleTouch = (skill: string, list: 'technical' | 'transferable') => {
      const now = Date.now();
      const last = lastTapRef.current || 0;
      const diff = now - last;
      // 300ms threshold for double-tap
      if (diff > 0 && diff < 350) {
        // double-tap detected
        handleDoubleClick(skill, list);
        lastTapRef.current = null;
      } else {
        lastTapRef.current = now;
        // clear after threshold to avoid memory lingering
        setTimeout(() => {
          if (lastTapRef.current && Date.now() - (lastTapRef.current || 0) >= 350) {
            lastTapRef.current = null;
          }
        }, 360);
      }
    };

    const handleDragStart = (e: React.DragEvent, index: number, listName: 'technical' | 'transferable') => {
      e.dataTransfer.setData('text/plain', JSON.stringify({ index, listName }));
    };

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent, dropIndex: number, listName: 'technical' | 'transferable') => {
      e.preventDefault();
      try {
        const raw = e.dataTransfer.getData('text/plain');
        const { index: dragIndex, listName: sourceList } = JSON.parse(raw);
        if (sourceList !== listName) return; // only re-order within same list for now

        const setter = listName === 'technical' ? setSkills : setSkills2;
        const listRef = listName === 'technical' ? skills : skills2;
        const newList = [...listRef];
        const [dragged] = newList.splice(dragIndex, 1);
        newList.splice(dropIndex, 0, dragged);
        setter(newList);
      } catch (err) {
        // ignore
      }
    };

    const handleDoubleClick = (skill: string, list: 'technical' | 'transferable') => {
      setEditingSkill(skill);
      setEditingList(list);
      setEditingValue(skill);
    };

    const handleSaveEdit = () => {
      if (!editingList) {
        setEditingSkill(null);
        setEditingValue("");
        return;
      }
      if (!editingValue.trim()) {
        setEditingSkill(null);
        setEditingList(null);
        setEditingValue("");
        return;
      }
      if (editingList === 'technical') {
        setSkills((prev) => prev.map((s) => (s === editingSkill ? editingValue.trim() : s)));
      } else if (editingList === 'transferable') {
        setSkills2((prev) => prev.map((s) => (s === editingSkill ? editingValue.trim() : s)));
      }
      setEditingSkill(null);
      setEditingList(null);
      setEditingValue("");
    };

    // Save current form files to localStorage when files change (for publishing later)
    useEffect(() => {
      const saveCurrentFiles = async () => {
        if (files.length > 0) {
          const filesData = await Promise.all(
            files.map(async (f: any) => {
              return new Promise<any>((resolve) => {
                const reader = new FileReader();
                reader.onload = () => {
                  resolve({
                    name: f.name,
                    size: f.size,
                    type: f.file.type,
                    data: reader.result as string,
                  });
                };
                reader.onerror = () => resolve(null);
                reader.readAsDataURL(f.file);
              });
            })
          );

          const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
            companyName: "",
            website: "",
            industry: "",
            duration: "< 6 months",
            teamSize: "0-10",
            summary: "",
            technicalSkills: [],
            transferableSkills: [],
            insights: [],
          } as any);

          lsSet(ROOM_KEYS.insights, {
            ...(saved as any),
            currentFormFiles: filesData.filter((f) => f !== null),
          } as any);
        } else {
          const saved = lsGet<any>(ROOM_KEYS.insights, {
            companyName: "",
            website: "",
            industry: "",
            duration: "< 6 months",
            teamSize: "0-10",
            summary: "",
            technicalSkills: [],
            transferableSkills: [],
            insights: [],
          } as any);
          if (saved && saved.currentFormFiles) {
            const { currentFormFiles, ...rest } = saved;
            lsSet(ROOM_KEYS.insights, rest);
          }
        }
      };

      saveCurrentFiles();
    }, [files]);

    // insights creation UI is preserved as design (external route)
    const appendCurrentInsight = async () => {
      const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName,
        website,
        industry,
        duration,
        teamSize,
        summary,
        technicalSkills: skills,
        transferableSkills: skills2,
        insights: [],
      });
      const filesFromStorage = (saved as any).currentFormFiles || [];
      const newItem = {
        title: (companyName || '').trim() || 'Untitled',
        description: (summary || '').trim(),
        tag: (industry || '').trim(),
        files: filesFromStorage,
      };
      const next = [...(saved.insights || []), newItem];
      // clear temp currentFormFiles after moving into the new insight
      const { currentFormFiles, ...rest } = (saved as any);
      lsSet(ROOM_KEYS.insights, { ...(rest as any), insights: next } as any);

      try {
        const allKeys = Object.keys(window.localStorage || {});
        const insightKeys = allKeys.filter((k) => /^insight_\d+$/.test(k));
        const indices = insightKeys.map((k) => parseInt(k.split('_')[1], 10)).filter((n) => !isNaN(n));
        let idx = 1;
        while (indices.includes(idx)) idx++;
        window.localStorage.setItem(`insight_${idx}`, JSON.stringify(newItem));
      } catch {}

      setInsights(next);
      setFiles([]);
      setCompanyName("");
      setWebsite("");
      setIndustry("");
      setSummary("");
    };

    const removeSavedInsight = (idx: number) => {
      const saved = lsGet<InsightsData>(ROOM_KEYS.insights, {
        companyName,
        website,
        industry,
        duration,
        teamSize,
        summary,
        technicalSkills: skills,
        transferableSkills: skills2,
        insights: [],
      });
      const next = (saved.insights || []).filter((_, i) => i !== idx);
      setInsights(next);
      lsSet(ROOM_KEYS.insights, { ...saved, insights: next });
    };

    
    return (
      <>
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

              {/* Step 2: Competencies - Completed */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-sm flex-shrink-0">
                  <Image src={check} alt="" className="w-3 h-3" />
                </div>
                <span className="hidden sm:inline text-gray-600 font-medium">Competencies</span>
              </div>
              <span className="text-gray-300">›</span>

              {/* Step 3: Insights - Current */}
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 review text-white text-xs flex items-center justify-center rounded-full shadow-md flex-shrink-0 font-semibold">
                  3
                </div>
                <span className="hidden sm:inline text-gray-900 font-semibold">Insights</span>
              </div>
            </div>

            {/* Content - Responsive Padding */}
            <div className="px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-4 sm:space-y-5">

              {/* Existing Insights (dynamic) */}
              {!!insights.length && (
                <div className="space-y-3">
                  {insights.map((it, idx) => (
                    <div key={idx} className="bg-gray-20 bg-[#F9FAFB] border border-gray-100 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-800 mb-1">{it.title}</h3>
                          <p className="text-sm text-gray-500 mb-2">{it.description}</p>
                          <span className="text-xs bg-[#F0FDFA] border border-[#99F6E4] text-[#0F766E] px-2 py-0.5 rounded-full font-medium">{it.tag}</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <button className="flex items-center gap-1 text-gray-600 hover:text-black cursor-pointer"
                            onClick={() => routes.push("/insights-overview")}
                          >
                            Continue Editing
                          </button>
                          <div className="flex justify-end">
                            <button className="flex items-center gap-1 text-red-500 hover:text-red-700"
                              onClick={() => removeSavedInsight(idx)}
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Company Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none"
                />
              </div>

              {/* Industry and Duration - Responsive */}
              <div className="flex flex-col sm:flex-row gap-4">
                {/* <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Industry</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                    <option>Finance</option>
                    <option>Retail</option>
                    <option>Healthcare</option>
                  </select>
                </div> */}

                <div className="w-1/2 relative">
                  <label className="block text-sm text-gray-700 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
                  >
                    <option value="">Select industry</option>
                    <option>Finance</option>
                    <option>Retail</option>
                    <option>Healthcare</option>
                  </select>
                  {/* custom dropdown icon */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                  <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                    <option>&lt; 6 months</option>
                    <option>6-12 months</option>
                    <option>1+ year</option>
                  </select>
                </div> */}

                <div className="w-1/2 relative">
                  <label className="block text-sm text-gray-700 mb-1">Duration</label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
                  >
                    <option>{"< 6 months"}</option>
                    <option>6-12 months</option>
                    <option>1+ year</option>
                  </select>
                  {/* custom dropdown icon */}
                  <svg
                    className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

              </div>

              {/* Team Size */}
              {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm text-gray-700 focus:outline-none">
                  <option>0-10</option>
                  <option>10-25</option>
                  <option>25+</option>
                </select>
              </div> */}


              <div className="mb-6 relative">
                <label className="block text-sm text-gray-700 mb-1">Team Size</label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:outline-none appearance-none pr-8"
                >
                  <option>0-10</option>
                  <option>10-25</option>
                  <option>25+</option>
                </select>
                <svg
                  className="w-4 h-4 absolute right-3 top-11 -translate-y-1/2 text-gray-500 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>


              {/* Summary Textarea */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Summarise the value you added in 3 paragraphs</label>
                <textarea
                  rows={4}
                  placeholder="Type your message here"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 sm:py-2.5 text-sm focus:outline-none resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">max 1200 characters (AI will tweak it in the preview)</p>
              </div>

              {/* Technical Skills */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Technical skills</span>
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">AI Generated</span>
                </div>
                <div className="space-y-2">
                  {skills.map((skill, i) => {
                    const selected = selectedTech.includes(skill);
                    const isEditing = editingSkill === skill && editingList === 'technical';
                    return (
                      <div
                        key={skill}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i, 'technical')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, i, 'technical')}
                        onTouchStart={() => handleTouch(skill, 'technical')}
                        className={`w-full flex items-center justify-between text-sm px-4 py-2 rounded-md border ${
                          selected ? "bg-teal-50 border-teal-300" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-gray-800 flex items-center flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') { setEditingSkill(null); setEditingList(null); setEditingValue(""); } }}
                              className="w-full bg-white border border-teal-300 rounded px-2 py-1 text-sm"
                              autoFocus
                            />
                          ) : (
                            <button type="button" onClick={() => toggleTech(skill)} onDoubleClick={() => handleDoubleClick(skill, 'technical')} className="text-left w-full truncate">
                              {skill}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button className="p-1" onClick={() => handleDoubleClick(skill, 'technical')} title="Edit">
                            <Image src={Edit} alt="" className="text-gray-500" />
                          </button>
                          <span className=" text-dark-400"><Image src={Tool} alt="" /></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Transferable Skills */}
              <div className="pt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-600">Transferable skills</span>
                  <span className="ml-2 text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 border border-gray-300">AI Generated</span>
                </div>
                <div className="space-y-2">
                  {skills2.map((skill, i) => {
                    const selected = selectedTransferable.includes(skill);
                    const isEditing = editingSkill === skill && editingList === 'transferable';
                    return (
                      <div
                        key={skill}
                        draggable
                        onDragStart={(e) => handleDragStart(e, i, 'transferable')}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, i, 'transferable')}
                        onTouchStart={() => handleTouch(skill, 'transferable')}
                        className={`w-full flex items-center justify-between text-sm px-4 py-2 rounded-md border ${
                          selected ? "bg-teal-50 border-teal-300" : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                        }`}
                      >
                        <div className="text-gray-800 flex items-center flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              onBlur={handleSaveEdit}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveEdit(); if (e.key === 'Escape') { setEditingSkill(null); setEditingList(null); setEditingValue(""); } }}
                              className="w-full bg-white border border-teal-300 rounded px-2 py-1 text-sm"
                              autoFocus
                            />
                          ) : (
                            <button type="button" onClick={() => toggleTransferable(skill)} onDoubleClick={() => handleDoubleClick(skill, 'transferable')} className="text-left w-full truncate">
                              {skill}
                            </button>
                          )}
                        </div>
                        <div className="flex items-center space-x-2 ml-3">
                          <button className="p-1" onClick={() => handleDoubleClick(skill, 'transferable')} title="Edit">
                            <Image src={Edit} alt="" className="text-gray-500" />
                          </button>
                          <span className=" text-dark-400"><Image src={Tool} alt="" /></span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* File Upload Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-5">
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-800 block mb-2">Upload supporting materials (optional)</label>
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

                {/* File List */}
                <div className="space-y-3">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                    >
                    <div className="flex items-start flex-1 mr-3 gap-3 min-w-0">
                        {file.type === 'image' ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={file.url} alt="preview" className="w-10 h-10 object-cover rounded flex-shrink-0" />
                        ) : file.type === 'video' ? (
                          <video src={file.url} className="w-10 h-10 rounded flex-shrink-0" />
                        ) : (
                          <Image src={Doc} alt="doc" className="w-6 h-5 sm:w-8 sm:h-6 mt-1 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                          <p className="text-xs text-gray-500">{file.size}</p>
                          {file.type === 'file' && (
                            <div className="w-full bg-gray-200 h-1.5 rounded mt-2">
                              <div
                                className="bg-blue-500 h-1.5 rounded transition-all duration-300"
                                style={{ width: `${file.progress}%` }}
                              ></div>
                            </div>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="ml-2 hover:opacity-80 flex-shrink-0 p-1"
                      >
                        <Image src={cut} alt="remove" className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add New Insight Button (design preserved) */}
              <Link href="/insights">
                <button
                  type="button"
                  onClick={appendCurrentInsight}
                  className="w-full flex  gap-2  py-3 text-sm font-medium text-teal-600 hover:bg-gray-50 transition"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-teal-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add a new insight
                </button>
              </Link>

              {/* Action Buttons - Responsive */}
              <div className="mt-6 sm:mt-8 flex flex-col-reverse sm:flex-row justify-between gap-3">
                <button
                  className="w-full sm:w-auto text-gray-700 bg-white border border-gray-300 px-6 py-2.5 rounded-lg hover:bg-gray-50 hover:border-gray-400 cursor-pointer transition shadow-sm text-sm font-medium"
                  onClick={() => routes.push("/competencies")}
                >
                  Back
                </button>
                <button
                  className="w-full sm:w-auto review text-white px-6 py-2.5 rounded-lg hover:bg-teal-600 cursor-pointer transition shadow-md text-sm font-semibold"
                  onClick={() => { appendCurrentInsight(); routes.push("/insight-preview"); }}
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
