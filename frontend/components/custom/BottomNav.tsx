"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ClipboardList, User } from "lucide-react";

const tabs = [
  {
    name: "리뷰 요청",
    href: "/review-request",
    icon: ClipboardList,
  },
  {
    name: "내 리뷰 요청",
    href: "/reviews",
    icon: FileText,
  },
  {
    name: "마이페이지",
    href: "/mypage",
    icon: User,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white dark:bg-black">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 transition-colors ${
                isActive
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              }`}
            >
              <Icon className="h-6 w-6" />
              <span className="text-xs font-medium">{tab.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
