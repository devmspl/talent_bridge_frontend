"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { updateUserData, setCurrentStep } from "@/app/store/slices/userSlice";
import { signupValidationSchema } from "@/app/utils/validation";
import logo from "@/public/assets/Icon1.svg"
import google from "@/public/assets/media/Google.svg"
import facebook from "@/public/assets/media/Facebook.svg"
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useFacebookRegisterMutation, useGoogleSignUpMutation } from "@/app/store/api/userApi";
import { useFacebookSDK } from "@/app/hooks/useFacebookSDK";
import Cookies from "js-cookie";
import Link from "next/link";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [errors, setErrors] = useState<Record<string, string>>({});
   const [googleSignup, { isLoading: isGoogleSigning }] = useGoogleSignUpMutation();
  const [facebookRegister, { isLoading: isFacebookSigning }] = useFacebookRegisterMutation();

  const fbReady = useFacebookSDK();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let processedValue = value;
    
    if (name === 'phone') {
      // Remove all non-digit characters and limit to 10 digits
      processedValue = value.replace(/\D/g, '').slice(0, 10);
    }
    
    dispatch(updateUserData({ [name]: processedValue }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    try {
      signupValidationSchema.validateSync(user ?? {}, { abortEarly: false });
      return true;
    } catch (validationErrors: any) {
      const newErrors: Record<string, string> = {};
      validationErrors.inner.forEach((error: any) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      dispatch(setCurrentStep(2));
      router.push("/step-2");
    }
  };


    const sendTokenToBackend = async (idToken: string) => {
      try {
        const res = await googleSignup({ idToken }).unwrap();
        if (res?.token && res?._id) {
          Cookies.set("tb_token", res.token, { expires: 7 });
          Cookies.set("tb_userId", res._id, { expires: 7 });
          toast.success("Logged in successfully", { toastId: "login-success" });
          router.push("/dashboard");
        } else {
          toast.error("Google signup failed");
        }
      } catch (err: any) {
        console.error("google-signup error:", err);
        toast.error("Google signup error");
      }
    };

    const registerWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      const token = tokenResponse?.access_token ?? tokenResponse?.credential;
      console.log("token", token);
      if (!token) {
        toast.error("Google did not return a token");
        return;
      }
      await sendTokenToBackend(token);
    },
    onError: () => {
      toast.error("Google sign-up failed (popup closed or blocked)");
    },
    scope: "openid profile email",
    flow: "implicit", 
  });

const loginWithFacebook = () => {
  if (!fbReady) {
    toast.info("Facebook is still loading, please try again.");
    return;
  }

  window.FB.login(
    async (response: any) => {
      const token = response?.authResponse?.accessToken;
      if (!token) {
        toast.error("Facebook login cancelled or failed");
        return;
      }

      try {
        const res = await facebookRegister({ accessToken: token }).unwrap();

        if (res?.token) {
          Cookies.set("tb_token", res.token, { expires: 7 });
          toast.success("Logged in successfully");
          router.push("/dashboard");
        } else {
          toast.error("Facebook login failed");
        }
      } catch (err) {
        console.error("facebook-signin error:", err);
        toast.error("Facebook login error");
      }
    },
    { scope: "public_profile,email" }
  );
};




  return (
    <>
      {/* === Onboarding Navbar === */}
      <div className="relative w-full flex items-center justify-between px-3 sm:px-4 md:px-6 py-3 sm:py-4 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full icon flex items-center justify-center text-white text-xs sm:text-sm font-bold">
            <Image src={logo} alt="" />
          </div>
        <Link href="/auth">  <span className="text-sm sm:text-base font-semibold text-gray-900">TalentBridge</span></Link>
        </div>

        {/* Center: Stepper - Responsive */}
        <div className="hidden sm:block absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm">
            {/* Step 1: Current */}
            <div className="flex items-center gap-1 text-gray-900 font-medium">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">1</div>
              <span className="hidden md:inline">Account</span>
              <span className="text-gray-400 hidden sm:inline">›</span>
            </div>

            {/* Step 2: Upcoming */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">2</div>
              <span className="hidden md:inline">Profile</span>
              <span className="text-gray-400 hidden sm:inline">›</span>
            </div>

            {/* Step 3: Upcoming */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">3</div>
              <span className="hidden md:inline">Showcase</span>
            </div>
          </div>
        </div>

        {/* Mobile Stepper */}
        <div className="sm:hidden absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-1 text-xs">
            <div className="w-5 h-5 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">1</div>
            <span className="text-gray-500">of 3</span>
          </div>
        </div>

        {/* Right: Close Button */}
        <div className="text-gray-400 cursor-pointer hover:text-gray-600 text-sm sm:text-base">
          ×
        </div>
      </div>

      {/* === Signup Form Section === */}
      <main className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-3 sm:px-4 md:px-6 py-6 sm:py-8 md:py-12">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg bg-white rounded-xl shadow p-4 sm:p-6 md:p-8">
          <h2 className="text-xl sm:text-2xl md:text-[30px] leading-tight font-Inter text-center text-[#111827] mb-1 sm:mb-2 font-semibold">
            Create your account
          </h2>
          <p className="text-xs sm:text-sm text-gray-500 text-center mb-4 sm:mb-6">
            Let's get you started with <span className="font-medium">TalentBridge</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g John Doe"
                value={user?.fullName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:py-2.5 border rounded-md text-sm sm:text-base ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Phone - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g johndoe@gmail.com"
                  value={user?.email || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-md text-sm sm:text-base ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
             
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone number
                </label>
                <div className="flex">
                  <select
                    name="countryCode"
                    className="px-1 sm:px-1 py-2 sm:py-2.5 border-gray-300 rounded-l-md border-t border-b border-l bg-white text-sm sm:text-base focus:outline-none bg-[url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 fill=%22none%22 viewBox=%220 0 24 24%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpath stroke-linecap=%22round%22 stroke-linejoin=%22round%22 d=%22M19 9l-7 7-7-7%22 /%3E%3C/svg%3E')] bg-no-repeat bg-right-1"
                  >
                    <option value="+1">US (+1)</option>
                    <option value="+91">IN (+91)</option>
                    <option value="+44">GB (+44)</option>
                    <option value="+61">AU (+61)</option>
                  </select>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="1234567890"
                    value={user?.phone || ""}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 sm:py-2.5 border-t border-b border-r rounded-r-md text-sm sm:text-base ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    inputMode="numeric"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a valid 10-digit phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>
            </div>

            {/* Country & City - Responsive layout */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Your Country"
                  value={user?.country || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-md text-sm sm:text-base ${
                    errors.country ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  placeholder="Your City"
                  value={user?.city || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 sm:py-2.5 border rounded-md text-sm sm:text-base ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={user?.password || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 sm:py-2.5 border rounded-md text-sm sm:text-base ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full review text-white py-2 sm:py-2.5 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer text-sm sm:text-base"
            >
              Right this way
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4 sm:my-6">
            <hr className="flex-grow border-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">Or</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Social Login */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="w-full sm:w-1/2 border border-gray-300 py-2 sm:py-2.5 rounded-md flex justify-center items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => registerWithGoogle()}
            >
              <Image src={google} alt="google icon" width={20} height={20} />
            </button>
            <button className="w-full sm:w-1/2 border border-gray-300 py-2 sm:py-2.5 rounded-md flex justify-center items-center hover:bg-gray-50 cursor-pointer"
             onClick={loginWithFacebook}
            >
              <Image src={facebook} alt="facebook icon" width={20} height={20} />
            </button>
          </div>

          {/* Bottom Text */}
          <p className="text-sm text-center mt-4 sm:mt-6 text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-teal-600 font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </>
  );
}
