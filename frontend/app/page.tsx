"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { sdk } from "@farcaster/miniapp-sdk";
import { useUserStore } from "@/lib/store/userStore";

export default function RootPage() {
  const router = useRouter();
  const { setUser, setIsLoading, setIsMiniApp } = useUserStore();

  useEffect(() => {
    const initSDK = async() => {
      try {
        setIsLoading(true);
        const inMiniApp = await sdk.isInMiniApp();
        setIsMiniApp(inMiniApp);

        if (inMiniApp) {
          await sdk.actions.ready();
          const context = await sdk.context;
          const contextUser = context.user;

          const res = await fetch(`/api/userdata?fid=${contextUser.fid}`);
          const additionalProfile = await res.json();

          const userData = {
            fid: contextUser.fid,
            username: contextUser.username || '',
            displayName: contextUser.displayName || '',
            pfpUrl: contextUser.pfpUrl || '',
            profile: additionalProfile
          };

          setUser(userData);

          // 잠시 후 리뷰 요청 페이지로 리다이렉트
          setTimeout(() => {
            router.push("/review-request");
          }, 1000);
        } else {
          // 웹 접속인 경우
          alert("web");
          setIsLoading(false);

          // 웹 접속도 리뷰 요청 페이지로 리다이렉트
          setTimeout(() => {
            router.push("/review-request");
          }, 1000);
        }

      } catch (error) {
        console.error("Login Err:", error);
        setIsLoading(false);
      }
    };
    initSDK();
  }, [router, setUser, setIsLoading, setIsMiniApp]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white dark:bg-black">
      <div className="flex flex-col items-center gap-6">
        {/* Spinner */}
        <Spinner className="h-12 w-12 text-blue-600 dark:text-blue-400" />

        {/* Login text */}
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
          login...
        </p>
      </div>
    </div>
  );
}
