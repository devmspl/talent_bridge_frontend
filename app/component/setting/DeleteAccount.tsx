"use client"
import { useState } from "react";
import { ImInfo } from "react-icons/im";
import DeleteAccountModal from "../modals/setting/DeleteAccountModal";

export default function DeleteAccount() {
    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold">
        <h1>Delete account</h1>
      </div>

      <div className="p-6 space-y-5 text-sm text-gray-700">
        <p className="font-semibold text-black">We're sorry to see you go</p>
        <p>Please read the following carefully before proceeding:</p>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>Deleting your account is permanent and cannot be undone.</li>
          <li>All your data, including projects, files, and settings, will be permanently removed.</li>
          <li>Ensure you have saved or exported any important information before proceeding.</li>
          <li>If you need help, please contact our support team.</li>
        </ul>

        {/* Warning box */}
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md px-4 py-3 flex gap-2">
            <div>
          <p className="font-medium mb-1 flex gap-2"><ImInfo /></p>
            </div>
            <div>
             <p className="font-medium mb-1 flex gap-2">Note</p>
            <p>If you have any active subscriptions, they will be canceled immediately upon account deletion.</p>
            </div>
        </div>

        <p>
          To proceed with account deletion, please confirm your action by clicking the button below.
        </p>

        <button className="mt-4 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-5 py-2 rounded-md"
        onClick={()=>setIsOpen(true)}
        >
          I want to delete my account
        </button>
      </div>
    </div>
    {isOpen && <DeleteAccountModal onClose={() => setIsOpen(false)} />}
    </>
  );
}
