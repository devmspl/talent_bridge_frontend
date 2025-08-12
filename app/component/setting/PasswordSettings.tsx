

export default function PasswordSettings() {
  return (
    <>
        <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className=" border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold ">
              <h1>Password</h1>
            </div>
          <div className="space-y-4 p-6">
            <div>
              <label className="text-sm text-gray-600 block mb-1">Current Password</label>
              <input
                type="password"
                placeholder="Current Password"
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
              <p className="text-xs text-gray-400 mt-1">
                Minimum of 8 characters with upper & lowercase & number
              </p>
            </div>

            <div>
              <label className="text-sm text-gray-600 block mb-1">New Password</label>
              <input
                type="password"
                placeholder="New Password"
                className="w-full px-3 py-2 border border-gray-200 rounded-md"
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3 mb-3">
            <button className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer">
              Save changes
            </button>
            <button className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer">
              Cancel
            </button>
          </div>
        </div>
    </>
  );
}
