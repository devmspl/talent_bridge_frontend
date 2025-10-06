"use client";
import { useChangePasswordMutation } from "@/app/store/api/userApi";
import { PasswordErrors, validatePasswordForm } from "@/app/utils/validation";
import { useState } from "react";
import { toast } from "react-toastify";

export default function PasswordSettings() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<PasswordErrors>({});

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userId = user?._id;

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleSubmit = async () => {
    const validationErrors = validatePasswordForm(
      currentPassword,
      newPassword,
      confirmPassword
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});

    try {
      const result = await changePassword({
        userId,
        currentPassword,
        newPassword,
      }).unwrap();

      toast.success(result.message || "Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="border-b border-gray-200 py-3 sm:py-4 md:py-5 px-4 sm:px-5">
        <h1 className="text-lg sm:text-xl md:text-2xl text-[#111827] font-semibold">
          Password
        </h1>
      </div>

      {/* Form Content */}
      <div className="space-y-4 sm:space-y-5 md:space-y-6 p-4 sm:p-5 md:p-6">
        {/* Current Password */}
        <div>
          <label className="text-sm sm:text-base text-gray-600 block mb-1 sm:mb-2">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-md bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          />
          {errors.currentPassword && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm sm:text-base text-gray-600 block mb-1 sm:mb-2">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          />
          <p className="text-xs sm:text-sm text-gray-400 mt-1 sm:mt-2">
            Minimum of 8 characters with upper & lowercase & number
          </p>
          {errors.newPassword && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.newPassword}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm sm:text-base text-gray-600 block mb-1 sm:mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-colors"
          />
          {errors.confirmPassword && (
            <p className="text-xs sm:text-sm text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 p-4 sm:p-5 md:p-6 pt-0">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base review text-white rounded-md hover:bg-teal-600 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          {isLoading ? "Saving..." : "Save changes"}
        </button>
        <button
          onClick={() => {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            setErrors({});
          }}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-md hover:bg-gray-100 cursor-pointer transition-colors font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

