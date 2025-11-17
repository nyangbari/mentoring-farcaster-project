"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/home");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

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
