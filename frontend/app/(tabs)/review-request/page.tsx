"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ReviewRequestItem from "@/components/custom/ReviewRequestItem";

export default function ReviewRequestPage() {
  const router = useRouter();
  // 예시 데이터
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    author: {
      name: `User ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 1}`,
    },
    date: "2024.11.14",
    title: `리뷰 요청 제목 ${i + 1}`,
    content: "이 부분에 대해 리뷰를 요청드립니다. 코드의 구조와 로직, 그리고 성능 최적화 측면에서 피드백을 받고 싶습니다. 특히 에러 핸들링 부분이 적절한지 확인 부탁드립니다.",
    reward: 10 + i * 5,
    commentCount: Math.floor(Math.random() * 20),
    validPeriod: "5일 남음",
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">리뷰 요청</h1>
          <Button
            className="bg-green-600 hover:bg-green-700 text-white"
            onClick={() => router.push("/review-request/request")}
          >
            리뷰 요청하기
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {items.map((item) => (
          <ReviewRequestItem
            key={item.id}
            author={item.author}
            date={item.date}
            title={item.title}
            content={item.content}
            reward={item.reward}
            commentCount={item.commentCount}
            validPeriod={item.validPeriod}
          />
        ))}
      </div>
    </div>
  );
}
