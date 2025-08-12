"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
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
        const res = await fetch("http://38.242.230.126:5832/User/login/linkedin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            redirect_uri: "http://localhost:3000/linkedin"
          })
        });

        const data = await res.json();

        if (res.ok && data?.token) {
          localStorage.setItem("tb_token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user ?? data));
          router.push("/dashboard");
        } else {
          toast.error(data?.message || "LinkedIn login failed");
        }
      } catch (error) {
        console.error(error);
        toast.error("Login error");
      }
    })();
  }, [router]);

  return <div className="p-4">Logging in with LinkedIn... please wait</div>;
}
