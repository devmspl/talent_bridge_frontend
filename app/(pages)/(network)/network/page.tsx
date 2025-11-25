
"use client";
import { FaStar } from "react-icons/fa";
import { BiSearch } from "react-icons/bi";
import Image, { StaticImageData } from "next/image";
import Avatar from "@/app/component/Avatar";
import location from "@/public/assets/icons/map-pin.png";
import bag from "@/public/assets/icons/briefcase-4.png";
import building from "@/public/assets/icons/building-2.png";
import search from "@/public/assets/icons/menu-search-2.svg";
import amazone from "@/public/assets/media/amazon.png";
import profile from "@/public/assets/profile/Avatar.png";
import { useState } from "react";
import FilterModal from "@/app/component/modals/network/FilterModal";
import { useRouter } from "next/navigation";
import { useGetAllUsersQuery } from "@/app/store/api/userApi";
import left from "@/public/assets/icons/left icon.svg"
import right from "@/public/assets/icons/right icon.svg"
import Cookies from "js-cookie";
import not_found from "@/public/assets/media/Searching.svg" 

export default function RecruiterGrid() {
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    companyName: "",
    experience: "",
  });

  const { data: users, isLoading, isError } = useGetAllUsersQuery({
    page_no: 1,
    page_size: 100,
  });
  const routes = useRouter();
  const userId = Cookies.get("tb_userId");

  if (isLoading) {
    return <div className="p-6">Loading users...</div>;
  }
  if (isError) {
    return <div className="p-6 text-red-500">Failed to load users.</div>;
  }
  if (!Array.isArray(users)) {
    return <div className="p-6 text-red-500">Failed to load users.</div>;
  }

  const handleClick = (id: any) => {
    routes.push(`/profile/${id}`);
  };


  const filteredUsers = users
    .filter((card: any) => card._id !== userId)
    .filter((card: any) => {
      return (
        (filters.location === "" ||
          card.location
            ?.toLowerCase()
            .includes(filters.location.toLowerCase())) &&
        (filters.industry === "" ||
          card.industryType?.[0]
            ?.toLowerCase()
            .includes(filters.industry.toLowerCase())) &&
        (filters.companyName === "" ||
          card.company
            ?.toLowerCase()
            .includes(filters.companyName.toLowerCase())) &&
        (filters.experience === "" ||
          card.experienceLevel
            ?.toLowerCase()
            .includes(filters.experience.toLowerCase()))
      );
    });
  const activeFiltersCount = Object.values(filters).filter(
    (val) => val && val.trim() !== ""
  ).length;

  return (
    <>
      <div className="bg-white min-h-screen ">
        <div className="max-w-9xl mx-auto">
          <div className="border border-gray-200 rounded-lg px-6 py-5 bg-white mb-6">
            <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
              Find Recruiters & Industry Professionals
            </h1>
            <p className="text-sm text-gray-500">
              Connect with top recruiters in your industry
            </p>
          </div>

          {/* Search and Filter */}
          <div className="bg-[#F9FAFB] px-4 py-3 rounded-lg  mb-6">
            <div className="flex items-center gap-3">
            <div className="relative flex-grow">
              <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                placeholder="Search by name, company or role"
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <button
              className="flex items-center gap-2 review hover:bg-[#00a19a] text-white px-4 py-2 rounded-md text-sm  font-medium hover:cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              {activeFiltersCount === 0 ? (
                <>
                  <Image src={search} alt="Filters" /> Filters
                </>
              ) : (
                <div className="flex items-center gap-1">
                  <span className="bg-white text-[#02ABAC] rounded-full w-4 h-4 flex items-center justify-center text-xs font-inter font-semibold">
                    {activeFiltersCount}
                  </span>
                  Filters
                </div>
              )}
            </button>
            </div>

            {/* Applied filters chips */}
            {activeFiltersCount > 0 && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {(
                  [
                    { key: 'industry', label: 'Industry' },
                    { key: 'experience', label: 'Experience' },
                    { key: 'companyName', label: 'Company name' },
                    { key: 'location', label: 'Location' },
                  ] as { key: keyof typeof filters; label: string }[]
                ).map(({ key, label }) =>
                  filters[key] ? (
                    <span key={key as string} className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full flex items-center gap-2">
                      {label}
                      <button
                        aria-label={`Remove ${label}`}
                        className="text-gray-400 hover:text-gray-600"
                        onClick={() => setFilters({ ...filters, [key]: '' })}
                      >
                        × 
                      </button>
                    </span>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Recruiter Cards */}
          {filteredUsers.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center py-12 px-4">
              <div className="max-w-md text-center">
                <div className="flex justify-center mb-4">
                 <Image src={not_found} alt="Filters" width={477.7142333984375} height={303.9999694824219} />
                </div>
                <h3 className="text-lg font-semibold text-[#111827] mb-2">No results found</h3>
                <p className="text-sm text-[#4B5563] font-normal mb-6">Sorry, no results match your search. Please try again with a different query.</p>
                <div className="flex gap-3 justify-center">
                  <button 
                    onClick={() => setFilters({
                      location: "",
                      industry: "",
                      companyName: "",
                      experience: ""
                    })}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    Clear filters
                  </button>
                  <button 
                    onClick={() => {
                      setFilters({
                        location: "",
                        industry: "",
                        companyName: "",
                        experience: ""
                      });
                      const input = document.querySelector('input[type="text"]') as HTMLInputElement;
                      input?.focus();
                    }}
                    className="px-4 py-2 bg-[#02ABAC] rounded-md text-sm font-medium text-white hover:bg-teal-600"
                  >
                    Start a new search
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
                {filteredUsers.map((card: any, i: number) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-md shadow-sm p-4 bg-white hover:shadow-md transition"
                  >
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span
                          className={`px-2 py-0.5 rounded-full font-medium capitalize ${card.type === "Recruiter"
                              ? "bg-gray-100 text-gray-700"
                              : "bg-pink-100 text-pink-700"
                            }`}
                        >
                          {card.type || "Industry Professional"}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-500">
                          <FaStar className="text-xs" />
                          <span className="text-[12px] font-medium text-[#4B5563]">
                            {card.rating || "4.7"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 border-b border-gray-200 p-2">
                        <Avatar
                          avatar={card.avatar}
                          avatarSvg={card.avatarSvg}
                          alt={card.fullname}
                          width={64}
                          height={64}
                          className="rounded-full object-cover"
                          style={{ width: "64px", height: "64px" }}
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-tight mb-1">
                            {card.fullname}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight mb-1">
                            {card.industryType?.[0] || "Technology"}
                          </p>
                          <p className="text-xs text-gray-400 leading-tight flex gap-1 mb-1">
                            <Image src={amazone} alt="" width={16} height={16} />{" "}
                            {card.company || "Google"}
                          </p>
                        </div>
                      </div>

                      <div className="text-[12px] font-medium text-[#4B5563] mt-3 space-y-0.5">
                        <div className="flex items-center gap-1 mb-3">
                          <Image src={location} alt="" height={16} />
                          {card.location || "UK"}
                        </div>
                        <div className="flex mb-3 gap-2 text-[12px] font-medium text-[#4B5563]">
                          <Image src={bag} alt=" " height={16} />
                          {card.industryType?.[0] || "Tech"}
                        </div>
                        <div className="flex mb-3 text-[12px] font-medium text-[#4B5563]">
                          <Image src={building} alt="" height={16} />
                          {card.placements || "18"} Placements •{" "}
                          {card.responseRate || "90%"} response rate
                        </div>
                      </div>
                    </div>
                    <button
                      className="w-full text-xs text-center py-1.5 border border-gray-300 rounded-md font-medium text-gray-800 hover:bg-gray-100 transition cursor-pointer"
                      onClick={() => handleClick(card._id)}
                    >
                      View Profile
                    </button>
                  </div>
                ))}
              </div>
           
            </div>
          )}
             <div className="border border-gray-200 mt-8 rounded-lg px-6 py-5 flex justify-between items-center text-xs text-gray-500 w-full">
                <p>Showing 1 to {Math.min(filteredUsers.length, 5)} of {filteredUsers.length} results</p>
                <div className="flex gap-2">
                  <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100 p-2">
                    <Image src={left} alt="Previous page" />
                  </button>
                  <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100 p-2">
                    <Image src={right} alt="Next page" />
                  </button>
                </div>
              </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <FilterModal
          filters={filters}
          setFilters={setFilters}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}