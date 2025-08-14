import { useEffect, useState } from "react";

export function useFacebookSDK() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Already loaded?
    if (window.FB) {
      setReady(true);
      return;
    }

    // Init callback
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
        cookie: true,
        xfbml: false,
        version: "v19.0", // current Graph API version
      });
      setReady(true);
    };

    // Inject SDK script once
    const id = "facebook-jssdk";
    if (document.getElementById(id)) return;

    const js = document.createElement("script");
    js.id = id;
    js.src = "https://connect.facebook.net/en_US/sdk.js";
    document.body.appendChild(js);
  }, []);

  return ready; // tells you when FB is usable
}
