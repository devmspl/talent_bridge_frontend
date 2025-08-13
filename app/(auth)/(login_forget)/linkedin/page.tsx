// "use client";
// import { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-toastify";
// import { useLinkedinSigninMutation } from "@/app/store/api/userApi";

// export default function LinkedInCallback() {
//   const router = useRouter();
//   const [linkedinSignin, { isLoading }] = useLinkedinSigninMutation();

//   useEffect(() => {
//     (async () => {
//       const params = new URLSearchParams(window.location.search);
//       const code = params.get("code");
//       const state = params.get("state");
//       const savedState = sessionStorage.getItem("linkedin_oauth_state");

//       if (!code) {
//         toast.error("No code from LinkedIn");
//         return;
//       }
//       if (state !== savedState) {
//         toast.error("Invalid OAuth state");
//         return;
//       }

//       try {
//         // Exchange code → access token
//         const formData = new URLSearchParams();
//         formData.append("grant_type", "authorization_code");
//         formData.append("code", code);
//         formData.append("redirect_uri", process.env.NEXT_PUBLIC_LINKEDIN_REDIRECT_URI || "http://localhost:3000/linkedin");
//         formData.append("client_id", process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "");
//         formData.append("client_secret", process.env.LINKEDIN_CLIENT_SECRET || "");

//         const tokenResponse = await fetch("https://www.linkedin.com/oauth/v2/accessToken", {
//           method: "POST",
//           headers: { "Content-Type": "application/x-www-form-urlencoded" },
//           body: formData
//         });
//         const tokenData = await tokenResponse.json();

//         if (!tokenData.access_token) {
//           toast.error("Could not get LinkedIn token");
//           return;
//         }

//         // Send ONLY token to your API
//         const res = await linkedinSignin({ token: tokenData.access_token }).unwrap();

//         if (res?.token) {
//           localStorage.setItem("tb_token", res.token);
//           localStorage.setItem("user", JSON.stringify(res.user ?? res));
//           toast.success("Logged in successfully");
//           router.push("/dashboard");
//         } else {
//           toast.error("LinkedIn login failed");
//         }
//       } catch (error: any) {
//         console.error("LinkedIn login error:", error);
//         toast.error(error?.data?.message || error?.error || "Login error");
//       }
//     })();
//   }, [router, linkedinSignin]);

//   return (
//     <div className="p-4">
//       {isLoading ? "Logging in with LinkedIn..." : "Processing..."}
//     </div>
//   );
// }


"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";

export default function LinkedInCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get("code");
      const state = params.get("state");
      const savedState = sessionStorage.getItem("linkedin_oauth_state");

      if (!code) {
        toast.error("No code from LinkedIn");
        return;
      }
      if (state !== savedState) {
        toast.error("Invalid OAuth state");
        return;
      }

      try {
        // Step 1: Code ko backend ko bhejna
        const tokenRes = await axios.post("http://localhost:5000/getLinkedInToken", { code });
        const accessToken = tokenRes.data.access_token;

        if (!accessToken) {
          toast.error("LinkedIn did not return an access token");
          return;
        }

        // Step 2: Tumhari API ko token bhejna
        const res = await axios.post("http://38.242.230.126:5832/User/login/linkedin", {
          token: accessToken
        });

        if (res.data?.token) {
          localStorage.setItem("tb_token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user ?? res.data));
          toast.success("Logged in successfully");
          router.push("/dashboard");
        } else {
          toast.error("Login failed");
        }
      } catch (error: any) {
        console.error("LinkedIn login error:", error);
        toast.error(error?.response?.data?.message || "Login error");
      }
    })();
  }, [router]);

  return <p>Processing LinkedIn login...</p>;
}
