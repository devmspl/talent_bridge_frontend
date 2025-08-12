"use client"
import { FaStar } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { BiSearch } from 'react-icons/bi';
import { FiFilter } from 'react-icons/fi';
import { RiBuildingLine } from 'react-icons/ri';
import Image from 'next/image';
import location from "@/public/assets/icons/map-pin.png";
import bag from "@/public/assets/icons/briefcase-4.png";
import building from "@/public/assets/icons/building-2.png";
import search from "@/public/assets/icons/menu-search-2.png"
import bitbuckit from '@/public/assets/media/bitbucket.png';
import visa from '@/public/assets/media/visa.png';
import go from '@/public/assets/media/go.png';
import intercome from '@/public/assets/media/intercom.png';
import bamboo from '@/public/assets/media/bamboo.png';
import facebook from '@/public/assets/media/Facebook.png';
import hubspot from '@/public/assets/media/hubspot.png';
import amazone from '@/public/assets/media/amazon.png';
import { useState } from 'react';
import FilterModal from '@/app/component/modals/network/FilterModal';
import { useRouter } from 'next/navigation';


export default function RecruiterGrid() {
  const [showModal, setShowModal] = useState(false);

  const routes =useRouter()


  return (
    <>
    <div className="bg-white min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto">
      <div className="border border-gray-200 rounded-lg px-6 py-5 bg-white mb-6">
          <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-1">
            Find Recruiters & Industry Professionals
          </h1>
          <p className="text-sm text-gray-500">
            Connect with top recruiters in your industry
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-lg shadow-sm mb-6">
          <div className="relative flex-grow">
            <BiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Search by name, company or role"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button className="flex items-center gap-1 bg-[#00b4aa] hover:bg-[#00a19a] text-white px-4 py-2 rounded-md text-sm font-medium hover:cursor-pointer"
          onClick={() => setShowModal(true)}>
           <Image src={search} alt="" /> Filters
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cards.map((card, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-md shadow-sm p-4 bg-white hover:shadow-md transition"
            >
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium capitalize ${
                      card.type === 'Recruiter'
                        ? 'bg-gray-100 text-gray-700'
                        : 'bg-pink-100 text-pink-700'
                    }`}
                  >
                    {card.type}
                  </span>
                  {card.rating && (
                    <div className="flex items-center gap-1 text-yellow-500">
                      <FaStar className="text-xs" />
                      {card.rating}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <img
                    src={card.img}
                    className="w-10 h-10 rounded-full object-cover"
                    alt={card.name}
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {card.name}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{card.role}</p>
                    <p className="text-xs text-gray-400 leading-tight flex gap-1"><Image src={card.company_logo} alt="" width={16} /> {card.company}</p>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 space-y-0.5">
                  <div className="flex items-center gap-1 mb-3">
                    <Image src={location} alt="" />{card.location}
                  </div>
                  <div className='flex mb-3'>  <Image src={bag} alt=" " height={16} />{card.industry}</div>
                  <div className='flex mb-3'>
                 <Image src={building} alt="" />{card.placements} Placements • {card.responseRate} response rate
                  </div>
                </div>
              </div>
              <button className="w-full text-xs text-center py-1.5 border border-gray-300 rounded-md font-medium text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              onClick={()=>routes.push('/profile')}>
                View Profile
              </button>
            </div>
          ))}
        </div>

        <div className="border border-gray-200 mt-8 rounded-lg px-6 py-5  flex justify-between items-center text-xs text-gray-500 ">
          <p>Showing 1 to 5 of 20 results</p>
          <div className="flex gap-2">
            <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100">&lt;</button>
            <button className="w-7 h-7 border border-gray-300 rounded hover:bg-gray-100">&gt;</button>
          </div>
        </div>
      </div>
    </div>
    {showModal && <FilterModal onClose={() => setShowModal(false)} />}
    </>
  );
}

const cards = [
  {
    type: 'Recruiter',
    rating: 4.8,
    name: 'Maria Riggs',
    role: 'Talent Acquisition Lead',
    company: 'BitBucket',
    company_logo :bitbuckit,
    location: 'London, UK',
    industry: 'Technology',
    placements: '1.3k',
    responseRate: '98%',
    img: 'https://randomuser.me/api/portraits/women/65.jpg',
  },
  {
    type: 'Recruiter',
    rating: 3.5,
    name: 'Sophia Carter',
    role: 'Senior Tech Recruiter',
    company: 'Visa',
    company_logo :visa,
    location: 'San Francisco, USA',
    industry: 'AI & Machine Learning',
    placements: '120',
    responseRate: '86%',
    img: 'https://randomuser.me/api/portraits/women/30.jpg',
  },
  {
    type: 'Industry Professional',
    name: 'Michael Ross',
    role: 'Head of Innovation',
    company: 'Goldman Sachs',
    company_logo :go,
    location: 'Dubai, UAE',
    industry: 'Technology',
    placements: '18',
    responseRate: '23%',
    img: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    type: 'Industry Professional',
    name: 'Michael Ross',
    role: 'Line Manager',
    company: 'Intercome',
    company_logo :intercome,
    location: 'New York, USA',
    industry: 'Healthcare',
    placements: '13',
    responseRate: '65%',
    img: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    type: 'Recruiter',
    rating: 1.8,
    name: 'Mark Robinson',
    role: 'Cybersecurity Manager',
    company: 'Bamboo',
    company_logo :bamboo,
    location: 'Berlin, Germany',
    industry: 'Cybersecurity',
    placements: '10',
    responseRate: '13%',
    img: 'https://randomuser.me/api/portraits/men/23.jpg',
  },
  {
    type: 'Recruiter',
    rating: 4.8,
    name: 'Priya Patel',
    role: 'Renewable Energy',
    company: 'Facebook',
    company_logo :facebook,
    location: 'Mumbai, India',
    industry: 'Technology',
    placements: '1.3k',
    responseRate: '91%',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    type: 'Industry Professional',
    name: 'Lisa Cheng',
    role: 'VP, Product',
    company: 'HubSpot',
    company_logo :hubspot,
    location: 'Singapore',
    industry: 'Marketing & Sales',
    placements: '112',
    responseRate: '81%',
    img: 'https://randomuser.me/api/portraits/women/67.jpg',
  },
  {
    type: 'Industry Professional',
    name: 'Ahmed Khan',
    role: 'Senior Finance Manager',
    company: 'Amazon',
    company_logo :amazone,
    location: 'Toronto, Canada',
    industry: 'E-commerce',
    placements: '98',
    responseRate: '78%',
    img: 'https://randomuser.me/api/portraits/men/10.jpg',
  },
];
