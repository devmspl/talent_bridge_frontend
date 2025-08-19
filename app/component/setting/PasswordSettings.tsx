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
      <div className=" border-b border-gray-200 py-5 px-5 text-2xl text-black font-semibold ">
        <h1>Password</h1>
      </div>

      <div className="space-y-4 p-6">
        {/* Current Password */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Current Password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50"
          />
          {errors.currentPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.currentPassword}
            </p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">New Password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
          />
          <p className="text-xs text-gray-400 mt-1">
            Minimum of 8 characters with upper & lowercase & number
          </p>
          {errors.newPassword && (
            <p className="text-xs text-red-500 mt-1">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-sm text-gray-600 block mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            className="w-full px-3 py-2 border border-gray-200 rounded-md"
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 mt-1">
              {errors.confirmPassword}
            </p>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3 mb-3">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className="px-6 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 cursor-pointer disabled:opacity-50"
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
          className="px-6 py-2 border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

