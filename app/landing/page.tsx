import Image from "next/image";
import Banner from '../../public/assets/Frame 1216401620.svg'
import Banner1 from '../../public/assets/Illustration (1).png'
import Banner2 from '../../public/assets/Illustration.png'
import Banner3 from '../../public/assets/Frame 1618871196.png'
import Banner4 from '../../public/assets/Illustration (2).png'

export default function page() {
  return (
    <>
    {/* Hero Section */}
    <section className="flex flex-col lg:flex-row items-center justify-between px-6 lg:px-20 py-16 bg-white">
        <div className="max-w-xl">
          <span className="inline-block bg-gray-100 text-sm px-3 py-1 rounded-full mb-4">
            We're Launching Soon 🎉
          </span>
          <h1 className="text-4xl font-bold text-teal-600 mb-4">
            Ditch the CV.
            <br />
            <span className="text-gray-900">Own your Story</span>
          </h1>
          <p className="mb-6 text-lg text-gray-700">
            Redefine how you present yourself—create dynamic, interactive
            showcase rooms, connect with recruiters and professionals, and take
            control of your opportunities like never before.
          </p>
          <div className="flex items-center gap-2">
            <input
              type="email"
              placeholder="Your future starts here - enter your email"
              className="px-4 py-2 border rounded-md w-full max-w-xs"
            />
            <button className="bg-teal-600 text-white px-4 py-2 rounded-md hover:bg-teal-700">
              Own my Story
            </button>
          </div>
          <div className="flex items-center mt-4 space-x-2 text-sm text-gray-500">
            <Image
              src={Banner}
              width={32}
              height={32}
              className="rounded-full"
              alt="Beta user"
            />
            <span>Over 10k beta users ⭐⭐⭐⭐⭐</span>
          </div>
        </div>

        <div className="mt-10 lg:mt-0 max-w-md">
          <Image
            src={Banner}
            width={400}
            height={300}
            alt="Hero visual"
            className="rounded-xl shadow-md"
          />
          <div className="mt-4 space-y-2 text-sm bg-gray-50 p-4 rounded-lg shadow-inner">
            <p>“Hello, I’m Joseph Miguez, Product Analyst”</p>
            <p>“Finally, a platform that reflects the current day!”</p>
            <p>“My showcase room got me noticed fast!”</p>
          </div>
        </div>
      </section>

      {/* Dynamic Showcase Rooms */}
      <section className="px-6 lg:px-20 py-16 bg-gray-50">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <Image
            src={Banner1}
            width={400}
            height={300}
            alt="Showcase Room"
            className="rounded-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Dynamic Showcase Rooms
            </h2>
            <p className="text-gray-700">
              Create interactive, multimedia rooms to highlight your skills,
              projects, and experiences in any domain—from art and tech to
              sports and beyond.
            </p>
            <p className="mt-2 text-gray-700">
              Share specific rooms and present your story your way, embracing
              multiple skills, and nonlinear paths, all while staying in control
              of who sees what.
            </p>
          </div>
        </div>
      </section>
      <section className="px-6 lg:px-20 py-16 bg-gray-50">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <Image
            src={Banner2}
            width={400}
            height={300}
            alt="Showcase Room"
            className="rounded-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Dynamic Showcase Rooms
            </h2>
            <p className="text-gray-700">
              Create interactive, multimedia rooms to highlight your skills,
              projects, and experiences in any domain—from art and tech to
              sports and beyond.
            </p>
            <p className="mt-2 text-gray-700">
              Share specific rooms and present your story your way, embracing
              multiple skills, and nonlinear paths, all while staying in control
              of who sees what.
            </p>
          </div>
        </div>
      </section>
      {/* Recruiter Database */}
      <section className="px-6 lg:px-20 py-16 bg-white">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Recruiter and Professional Database
            </h2>
            <p className="text-gray-700">
              Our <strong>enriched recruiter database</strong> helps you find
              the right people whether you’re looking for a job, a mentor, or a
              collaborator.
            </p>
            <p className="mt-2 text-gray-700">
              Discover recruiters based on specialization, location, and hiring
              trends with real-time data and smart filtering.
            </p>
          </div>
          <Image
            src={Banner3}
            width={400}
            height={300}
            className="rounded-md"
            alt="Recruiter database"
          />
        </div>
      </section>

      {/* Hyper-Personalised Outreach */}
      <section className="px-6 lg:px-20 py-16 bg-gray-50">
        <div className="grid md:grid-cols-2 items-center gap-10">
          <Image
            src={Banner4}
            width={400}
            height={300}
            className="rounded-md"
            alt="Outreach feature"
          />
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Hyper-Personalised Outreach
            </h2>
            <p className="text-gray-700">
              With AI and smart tools, you can craft personalized messages that
              actually connect—highlighting your strengths and getting the
              attention of the right professionals.
            </p>
            <p className="mt-2 text-gray-700">
              No more generic emails. Everything is tailored to spotlight your
              story and match you with real opportunities.
            </p>
          </div>
        </div>
      </section>

     
    </>
  );
}
