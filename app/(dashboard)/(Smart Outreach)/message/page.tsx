// "use client"
// import { FiSend, FiPaperclip } from "react-icons/fi";
// import { HiOutlineMail, HiOutlinePhone, HiOutlineVideoCamera } from "react-icons/hi";
// import user from "@/public/assets/profile/user.png"
// import call from "@/public/assets/media/Button with icon only.png";
// import mail from "@/public/assets/media/Button with icon only (1).png";
// import deleteIcon from "@/public/assets/media/Button with icon only (2).png";
// import Image from "next/image";
// import link from "@/public/assets/icons/link.png"
// import smile from "@/public/assets/icons/smile.png"
// import { useEffect, useRef, useState } from "react";
// import { BsThreeDotsVertical } from "react-icons/bs";
// import ArchiveModal from "@/app/component/modals/message/ArchiveModal";

// export default function ChatPage() {
//    const [dropdownOpen, setDropdownOpen] = useState(false);
// const dropdownRef = useRef<HTMLDivElement>(null);

// useEffect(() => {
//   function handleClickOutside(event: MouseEvent) {
//     if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//       setDropdownOpen(false);
//     }
//   }

//   document.addEventListener("mousedown", handleClickOutside);
//   return () => {
//     document.removeEventListener("mousedown", handleClickOutside);
//   };
// }, []);
//  const [modalOpen, setModalOpen] = useState(false);

//   const openModal = () => {
//     setDropdownOpen(false); 
//     setModalOpen(true); 
//   };

//   type Message = {
//   from: "you" | "them";
//   time: string;
//   text: string;
//   date: string;
//   name?: string; // optional
// };
//   const contacts = [
//     { name: "Breanna Butler", time: "2:00 PM", message: "Latest project milestone achieved!", online: true, img: user },
//     { name: "Deanna Turner", time: "12:45 PM", message: "Scheduled for 3 PM today", online: true, img: user },
//     { name: "Anthony Samy", time: "11:30 AM", message: "A task has been assigned to you", online: false, img: user },
//     { name: "Michele Carter", time: "9:30 AM", message: "Sarah sent a project file", online: true, img: user },
//     { name: "Scott Mcdaniel", time: "1 day ago", message: "Project deadline is tomorrow", online: false, img: user },
//     { name: "Michael Lee", time: "1 day ago", message: "Check the latest report", online: true, img: user },
//     { name: "George Dean", time: "2 days ago", message: "Budget confirmation needed", online: false, img: user },
//     { name: "Lisa Tran", time: "3 days ago", message: "High-priority problem detected", online: false, img: user },
//   ];

// const messages: Message[] = [
//   { from: "them", name: "Deanna Turner", time: "12:46 PM", text: "Hi Alex! I reviewed your showcase room...", date: "Today" },
//   { from: "you", name: "", time: "12:45 PM", text: "Thank you, Sarah! I'd be very interested in learning more about the opportunity.", date: "Today" },
//   { from: "them", name: "Deanna Turner", time: "12:48 PM", text: "Integration testing is scheduled to start on July 1st.", date: "Today" },
//   { from: "you", name: "", time: "12:49 PM", text: "Thanks for the update! 😊", date: "Today" },
// ];


//   const groupByDate = messages.reduce<Record<string, Message[]>>((acc, msg) => {
//     if (!acc[msg.date]) acc[msg.date] = [];
//     acc[msg.date].push(msg);
//     return acc;
//   }, {});

//   return (
//     <>
//      <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
//       <div>
//         Smart Outreach  <span className="text-gray-800 font-semibold">/ Messages</span>
//       </div>
//     </div>

//     <div className="h-screen w-full flex text-sm font-sans gap-2">
//       {/* Sidebar */}
//       <div className="w-1/3 max-w-sm border border-gray-200 p-4 overflow-y-auto rounded">
//         <div className="flex justify-between items-center mb-4">
//           <div className="flex gap-5 font-medium p-2">
//             <span className="text-black-600 border border-gray-200 rounded-2xl px-2 py-1">All</span>
//             <span className="text-gray-400 px-2 py-1">Unread</span>
//             <span className="text-gray-400 px-2 py-1">Archived</span>
//           </div>
//         </div>
//         <input
//           placeholder="Search"
//           className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50"
//         />
//         <div className="space-y-4">
//           {contacts.map((c, i) => (
//             <div key={i} className="flex items-center justify-between">
//               <div className="flex items-center gap-3 mb-4">
//                 <div className="relative">
//                   <Image src={user} className="rounded-full" alt="" width={40} />
//                   {c.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-white border" />}
//                 </div>
//                 <div>
//                   <div className="font-semibold text-gray-900">{c.name}</div>
//                   <div className="text-gray-500 text-xs truncate w-40">{c.message}</div>
//                 </div>
//               </div>
//               <div className="text-gray-400 text-xs">{c.time}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       <div className="flex-1 flex flex-col border border-gray-200 rounded">
//          <div className="flex flex-col h-screen bg-white border border-gray-200 rounded-md">
//       <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 ">
//         <div className="flex items-center gap-3">
//           <Image
//             src={user}
//             alt="avatar"
//             className="w-10 h-10 rounded-full"
//           />
//           <div>
//             <div className="font-semibold text-gray-900">Deanna Turner</div>
//             <div className="text-sm text-gray-500">deanna.turner@gmail.com</div>
//           </div>
//         </div>
//         <div className="relative" ref={dropdownRef}>
//   <div className="flex items-center gap-4 text-gray-500">
//     <Image src={call} alt="Call" width={40} />
//     <Image src={mail} alt="Mail" width={40} />
//     <Image src={deleteIcon} alt="Delete" width={40} />
//     <button
//       onClick={() => setDropdownOpen(!dropdownOpen)}
//       className="focus:outline-none border border-gray-200 h-[40px] w-[40px] flex justify-center items-center rounded"
//     >
//       <BsThreeDotsVertical />
//     </button>
//   </div>

//   {dropdownOpen && (
//     <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
//       <ul className="py-1 text-sm text-gray-700">
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={openModal} >Archive</li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share</li>
//         <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Block</li>
//       </ul>
//     </div>
//   )}
// </div>

//       </div>

//       <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
//        {Object.entries(groupByDate).map(([date, msgs]) => (
//   <div key={date}>
//     <div className="flex items-center justify-center my-4">
//       <span className="text-xs text-gray-400 border-t border-b border-gray-200 px-4">{date}</span>
//     </div>
//     {msgs.map((msg, i) => (
//       <div
//         key={`${date}-${i}`}
//         className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"} mb-4`}
//       >
//         <div
//           className={`flex flex-col ${
//             msg.from === "you" ? "items-end text-right" : "items-start text-left"
//           } max-w-sm`}
//         >
//           <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
//             {msg.from === "you" ? (
//               <>
//                 <span>{msg.time} You</span>
//                 <Image
//                   src={user}
//                   alt="Your avatar"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                 />
//               </>
//             ) : (
//               <>
//                 <Image
//                   src={user}
//                   alt="Sender avatar"
//                   width={32}
//                   height={32}
//                   className="rounded-full"
//                 />
//                 <span>
//                   {msg.name} {msg.time}
//                 </span>
//               </>
//             )}
//           </div>

//           <div
//             className={` px-4 py-2 text-sm leading-snug ${
//               msg.from === "you"
//                 ? "bg-teal-600 text-white rounded-tl-[12px] rounded-tr-none rounded-br-[12px] rounded-bl-[12px]"
//                 : "bg-gray-100 text-gray-900 rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]"
//             }`}
//           >
//             {msg.text}
//           </div>
//         </div>
//       </div>
//     ))}
//   </div>
// ))}

//       </div>

//      <div className="border-t border-gray-200 p-4">
//   <div>
//     <textarea
//       placeholder="Type something..."
//       className="w-full h-[80px] px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm resize-none"
//     />
//   </div>

//   <div className="flex justify-between items-center mt-4">
//     <div className="flex gap-2">
//       <button className="text-gray-500">
//         <Image src={link} alt="Link" width={20} />
//       </button>
//       <button className="text-gray-500">
//         <Image src={smile} alt="Emoji" width={20} />
//       </button>
//     </div>

//     <button className="text-white bg-teal-600 px-4 py-2 rounded-full hover:bg-teal-700 flex items-center gap-1 text-sm">
//       Send
//     </button>
//   </div>
// </div>

//     </div>
//       </div>
//     </div>
//     {modalOpen && <ArchiveModal  onClose={() =>setModalOpen(false)}  /> }
//      </>
//   );
// }







"use client";
import { useEffect, useRef, useState } from "react";
import { FiSend, FiPaperclip } from "react-icons/fi";
import { HiOutlineMail, HiOutlinePhone, HiOutlineVideoCamera } from "react-icons/hi";
import { BsThreeDotsVertical } from "react-icons/bs";
import Image from "next/image";
import user from "@/public/assets/profile/user.png";
import user1 from "@/public/assets/profile/Avatar (1).png";
import user2 from "@/public/assets/profile/Avatar (2).png";
import user3 from "@/public/assets/profile/Avatar (12).png";
import user4 from "@/public/assets/profile/Avatar (4).png";
import user5 from "@/public/assets/profile/Avatar (5).png";
import user6 from "@/public/assets/profile/Avatar (8).png";
import user7 from "@/public/assets/profile/Avatar (9).png";
import user8 from "@/public/assets/profile/Avatar (10).png";
import user9 from "@/public/assets/profile/Avatar (11).png";
import call from "@/public/assets/media/Button with icon only.png";
import mail from "@/public/assets/media/Button with icon only (1).png";
import deleteIcon from "@/public/assets/media/Button with icon only (2).png";
import link from "@/public/assets/icons/link.png";
import smile from "@/public/assets/icons/smile.png";
import ArchiveModal from "@/app/component/modals/message/ArchiveModal";

type Message = {
    from: "you" | "them";
    time: string;
    text: string;
    date: string;
    name?: string;
};

type MessagesMap = Record<string, Message[]>;

export default function ChatPage() {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [modalOpen, setModalOpen] = useState(false);
    const openModal = () => {
        setDropdownOpen(false);
        setModalOpen(true);
    };

    const [filter, setFilter] = useState<"all" | "unread" | "archived">("all");
    const [selectedUser, setSelectedUser] = useState<typeof filteredContacts[0] | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedModal = localStorage.getItem("modalOpen");
            if (storedModal === "true") {
                setModalOpen(true);
            }
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("modalOpen", modalOpen.toString());
        }
    }, [modalOpen]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const contacts = [
        { profile: user1, name: "Breanna Butler", time: "2:00 PM", message: "Latest project milestone achieved!", online: true, img: user, unread: true, archived: false },
        { profile: user2, name: "Deanna Turner", time: "12:45 PM", message: "Scheduled for 3 PM today", online: true, img: user, unread: false, archived: false },
        { profile: user3, name: "Anthony Samy", time: "11:30 AM", message: "A task has been assigned to you", online: false, img: user, unread: true, archived: true },
        { profile: user4, name: "Michele Carter", time: "9:30 AM", message: "Sarah sent a project file", online: true, img: user, unread: false, archived: false },
        { profile: user5, name: "Scott Mcdaniel", time: "1 day ago", message: "Project deadline is tomorrow", online: false, img: user, unread: false, archived: true },
        { profile: user6, name: "Michael Lee", time: "1 day ago", message: "Check the latest report", online: true, img: user, unread: false, archived: false },
        { profile: user7, name: "George Dean", time: "2 days ago", message: "Budget confirmation needed", online: false, img: user, unread: true, archived: false },
        { profile: user8, name: "Lisa Tran", time: "3 days ago", message: "High-priority problem detected", online: false, img: user, unread: false, archived: false },
        { profile: user9, name: "Serigo Williams", time: "3 days ago", message: "Submit timesheets today", online: false, img: user, unread: false, archived: false },
    ];

    const messages: MessagesMap = {
        "Breanna Butler": [
            { from: "you", name: "", time: "12:45 PM", text: "Thank you, Sarah! I'd be very interested in learning more about the opportunity.", date: "Today" },
            { from: "them", name: "Deanna Turner", time: "12:46 PM", text: "Hi Alex! I reviewed your showcase room and I'm really impressed with your projects. Would you be interested in discussing a potential role at TechCorp?", date: "Today" },
            { from: "you", name: "Deanna Turner", time: "12:48 PM", text: "Thank you, Sarah! I'd be very interested in learning more about the opportunity.", date: "Today" },
            { from: "them", name: "", time: "12:49 PM", text: "Integration testing is scheduled to start on July 1st.", date: "Today" },
        ],
        "Deanna Turner": [
            { from: "them", name: "Breanna Butler", time: "2:01 PM", text: "Just finalized the budget for Q3!", date: "Today" },
        ],
    };

    const filteredContacts = contacts.filter((c) => {
        if (filter === "unread") return c.unread;
        if (filter === "archived") return c.archived;
        return true;
    });

    const currentUser = selectedUser ?? contacts[0];

    const selectedMessages = currentUser?.name ? messages[currentUser.name] || [] : [];

    

    const groupByDate: Record<string, Message[]> = selectedMessages.reduce((acc: Record<string, Message[]>, msg) => {
        if (!acc[msg.date]) acc[msg.date] = [];
        acc[msg.date].push(msg);
        return acc;
    }, {});

        

    return (
        <>
            <div className="mb-4 text-sm text-gray-500 flex justify-between items-center">
                <div>
                    Smart Outreach <span className="text-gray-800 font-semibold">/ Messages</span>
                </div>
            </div>

            <div className="h-screen w-full flex text-sm font-sans gap-2">
                {/* Sidebar */}
                <div className="w-1/3 max-w-sm border border-gray-200 p-4 overflow-y-auto rounded">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex gap-5 font-medium p-2">
                            {["all", "unread", "archived"].map((tab) => (
                                <span
                                    key={tab}
                                    onClick={() => setFilter(tab as "all" | "unread" | "archived")}
                                    className={`cursor-pointer px-2 py-1 rounded-2xl capitalize ${filter === tab
                                            ? "bg-gray-200 text-black"
                                            : "text-gray-400"
                                        }`}
                                >
                                    {tab}
                                </span>
                            ))}
                        </div>
                    </div>
                    <input placeholder="Search" className="w-full mb-4 px-4 py-2 rounded-lg border border-gray-200 bg-gray-50" />
                    <div className="space-y-4">
                        {filteredContacts.length === 0 ? (
                            <div className="text-center text-gray-400 text-sm mt-10">No user found</div>
                        ) : (
                            filteredContacts.map((c, i) => (
                                <div
                                    key={i}
                                    className="flex items-center justify-between cursor-pointer"
                                    onClick={() => setSelectedUser(c)}
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="relative">
                                            <Image src={c.profile} className="rounded-full" alt="" width={40} />
                                            {c.online && (
                                                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-white border" />
                                            )}
                                        </div>
                                        <div>
                                            <div className="font-semibold text-gray-900">{c.name}</div>
                                            <div className="text-gray-500 text-xs truncate w-40">{c.message}</div>
                                        </div>
                                    </div>
                                    <div className="text-gray-400 text-xs">{c.time}</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Section */}
                <div className="flex-1 flex flex-col border border-gray-200 rounded">
                    <div className="flex flex-col h-screen bg-white border border-gray-200 rounded-md">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 ">
                            {currentUser && (
                                <div className="flex items-center gap-3">
                                    <Image src={currentUser.profile} alt="avatar" className="w-10 h-10 rounded-full" width={40} height={40} />
                                    <div>
                                        <div className="font-semibold text-gray-900">{currentUser.name}</div>
                                        <div className="text-sm text-gray-500">{currentUser.name.toLowerCase().replace(/\s+/g, "")}@gmail.com</div>
                                    </div>
                                </div>
                            )}

                            <div className="relative" ref={dropdownRef}>
                                <div className="flex items-center gap-4 text-gray-500">
                                    <Image src={call} alt="Call" width={40} />
                                    <Image src={mail} alt="Mail" width={40} />
                                    <Image src={deleteIcon} alt="Delete" width={40} />
                                    <button
                                        onClick={() => setDropdownOpen(!dropdownOpen)}
                                        className="focus:outline-none border border-gray-200 h-[40px] w-[40px] flex justify-center items-center rounded"
                                    >
                                        <BsThreeDotsVertical />
                                    </button>
                                </div>
                                {dropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                        <ul className="py-1 text-sm text-gray-700">
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={openModal}>
                                                Archive
                                            </li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Share</li>
                                            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">Block</li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
                            {Object.entries(groupByDate).map(([date, msgs]) => (
                                <div key={date}>
                                    <div className="flex items-center justify-center my-4">
                                        <span className="text-xs text-gray-400 border-t border-b border-gray-200 px-4">{date}</span>
                                    </div>
                                    {msgs.map((msg, i) => (
                                        <div key={`${date}-${i}`} className={`flex ${msg.from === "you" ? "justify-end" : "justify-start"} mb-4`}>
                                            <div className={`flex flex-col ${msg.from === "you" ? "items-end text-right" : "items-start text-left"} max-w-sm`}>
                                                <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                                                    {msg.from === "you" ? (
                                                        <>
                                                            <span>{msg.time} You</span>
                                                            <Image src={user} alt="Your avatar" width={32} height={32} className="rounded-full" />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Image src={currentUser.profile} alt="Sender avatar" width={32} height={32} className="rounded-full" />
                                                            <span>{msg.name} {msg.time}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className={`px-4 py-2 text-sm leading-snug ${msg.from === "you" ? "bg-teal-600 text-white rounded-tl-[12px] rounded-tr-none rounded-br-[12px] rounded-bl-[12px]" : "bg-gray-100 text-gray-900 rounded-tl-none rounded-tr-[12px] rounded-br-[12px] rounded-bl-[12px]"}`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-gray-200 p-4">
                            <div>
                                <textarea
                                    placeholder="Type something..."
                                    className="w-full h-[80px] px-4 py-2 border border-gray-200 rounded-xl focus:outline-none text-sm resize-none"
                                />
                            </div>
                            <div className="flex justify-between items-center mt-4">
                                <div className="flex gap-2">
                                    <button className="text-gray-500">
                                        <Image src={link} alt="Link" width={20} />
                                    </button>
                                    <button className="text-gray-500">
                                        <Image src={smile} alt="Emoji" width={20} />
                                    </button>
                                </div>
                                <button className="text-white bg-teal-600 px-4 py-2 rounded-full hover:bg-teal-700 flex items-center gap-1 text-sm">
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {modalOpen && <ArchiveModal onClose={() => setModalOpen(false)} />}
        </>
    );
}

