"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import { updateUserData, setCurrentStep } from "@/app/store/slices/userSlice";
import { signupValidationSchema } from "@/app/utils/validation";
import logo from "@/public/assets/Icon.png"
import google from "@/public/assets/media/google.png"
import facebook from "@/public/assets/media/Icon (1).png"
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { useFacebookRegisterMutation, useGoogleSignUpMutation } from "@/app/store/api/userApi";
import { useFacebookSDK } from "@/app/hooks/useFacebookSDK";

export default function Signup() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);
  const [errors, setErrors] = useState<Record<string, string>>({});
   const [googleSignup, { isLoading: isGoogleSigning }] = useGoogleSignUpMutation();
  const [facebookRegister, { isLoading: isFacebookSigning }] = useFacebookRegisterMutation();

  const fbReady = useFacebookSDK();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(updateUserData({ [name]: value }));
    
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


    const sendTokenToBackend = async (token: string) => {
      try {
        const res = await googleSignup({ token }).unwrap();
        if (res?.token) {
          localStorage.setItem("tb_token", res.token);
          localStorage.setItem("user", JSON.stringify(res));
          toast.success("Logged in successfully", { toastId: "login-success" });
          router.push("/dashboard");
        } else {
          toast.error("Google login failed");
        }
      } catch (err: any) {
        console.error("google-signin error:", err);
        toast.error("Google login error");
      }
    };

    const loginWithGoogle = useGoogleLogin({
    onSuccess: async (tokenResponse: any) => {
      const token = tokenResponse?.access_token ?? tokenResponse?.credential;
      if (!token) {
        toast.error("Google did not return a token");
        return;
      }
      await sendTokenToBackend(token);
    },
    onError: () => {
      toast.error("Google sign-in failed (popup closed or blocked)");
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
          localStorage.setItem("tb_token", res.token);
          localStorage.setItem("user", JSON.stringify(res));
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
      <div className="relative w-full flex items-center justify-between px-6 py-4 border-b border-gray-200">
        {/* Left: Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-bold">
            <Image src={logo} alt="" />
          </div>
          <span className="text-base font-semibold text-gray-900">TalentBridge</span>
        </div>

        {/* Center: Stepper */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4 text-sm">
            {/* Step 1: Current */}
            <div className="flex items-center gap-1 text-gray-900 font-medium">
              <div className="w-6 h-6 rounded-full bg-teal-500 text-white text-xs flex items-center justify-center">1</div>
              <span>Account</span>
              <span className="text-gray-400">›</span>
            </div>

            {/* Step 2: Upcoming */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-6 h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">2</div>
              <span>Profile</span>
              <span className="text-gray-400">›</span>
            </div>

            {/* Step 3: Upcoming */}
            <div className="flex items-center gap-1 text-gray-500">
              <div className="w-6 h-6 rounded-full border border-gray-300 text-xs flex items-center justify-center">3</div>
              <span>Showcase</span>
            </div>
          </div>
        </div>

        {/* Right: Close Button */}
        <div className="text-gray-400 cursor-pointer hover:text-gray-600 text-sm">
          ×
        </div>
      </div>

      {/* === Signup Form Section === */}
      <main className="min-h-screen bg-[#f9f9f9] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-semibold text-center text-gray-900 mb-1">
            Create your account
          </h2>
          <p className="text-sm text-gray-500 text-center mb-6">
            Let's get you started with <span className="font-medium">TalentBridge</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g John Doe"
                value={user?.fullName || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-teal-500 ${
                  errors.fullName ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            {/* Email & Phone */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g johndoe@gmail.com"
                  value={user?.email || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="US (+1) 123456778899"
                  value={user?.phone || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
              <input
                type="date"
                name="dob"
                placeholder="YYYY-MM-DD"
                value={user?.dob || ''}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.dob ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            {/* Country & City */}
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input
                  type="text"
                  name="country"
                  placeholder="Your Country"
                  value={user?.country || ''}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md ${
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
                  className={`w-full px-3 py-2 border rounded-md ${
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
                className={`w-full px-3 py-2 border rounded-md ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-teal-500 text-white py-2 rounded-md font-semibold hover:bg-teal-600 transition cursor-pointer"
            >
              Right this way
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center my-4">
            <hr className="flex-grow border-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">Or</span>
            <hr className="flex-grow border-gray-200" />
          </div>

          {/* Social Login */}
          <div className="flex gap-3">
            <button className="w-1/2 border border-gray-300 py-2 rounded-md flex justify-center items-center hover:bg-gray-50 cursor-pointer"
              onClick={() => loginWithGoogle()}
            >
              <Image src={google} alt="google icon" width={24} />
            </button>
            <button className="w-1/2 border border-gray-300 py-2 rounded-md flex justify-center items-center hover:bg-gray-50 cursor-pointer"
             onClick={loginWithFacebook}
            >
              <Image src={facebook} alt="facebook icon" width={24} />
            </button>
          </div>

          {/* Bottom Text */}
          <p className="text-sm text-center mt-6 text-gray-500">
            Already have an account?{" "}
            <a href="/login" className="text-teal-600 font-medium hover:underline">
              Log in
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
