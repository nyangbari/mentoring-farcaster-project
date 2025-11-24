"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReviewRequestItem from "@/components/custom/ReviewRequestItem";

interface ReviewRequestData {
  id: number;
  f_id: string;
  title: string;
  category: string;
  description: string;
  reward: number;
  deadline: string;
}

interface ApiResponse {
  items: ReviewRequestData[];
  total_items: number;
}

export default function ReviewRequestPage() {
  const router = useRouter();
  const [items, setItems] = useState<ReviewRequestData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // 페이지 로딩 시 API 호출
  useEffect(() => {
    const fetchReviewRequests = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/review-request?page=${page}&limit=10`);

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data: ApiResponse = await response.json();
        setItems(data.items);
        setTotalItems(data.total_items);
        setError(null);
      } catch (err) {
        console.error("리뷰 요청 목록 조회 실패:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewRequests();
  }, [page]);

  // 날짜를 "YYYY.MM.DD" 형식으로 변환
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
  };

  // 마감일까지 남은 기간 계산
  const calculateRemainingDays = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return "마감";
    if (diffDays === 0) return "오늘 마감";
    return `${diffDays}일 남음`;
  };

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
        {isLoading && (
          <div className="text-center py-8 text-gray-500">
            로딩 중...
          </div>
        )}

        {error && (
          <div className="text-center py-8 text-red-500">
            에러: {error}
          </div>
        )}

        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            등록된 리뷰 요청이 없습니다.
          </div>
        )}

        {!isLoading && !error && items.map((item) => (
          <ReviewRequestItem
            key={item.id}
            author={{
              name: item.f_id,
              avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.f_id}`,
            }}
            date={formatDate(item.deadline)}
            title={item.title}
            content={item.description}
            reward={item.reward}
            commentCount={0} // TODO: 댓글 수 API 추가 필요
            validPeriod={calculateRemainingDays(item.deadline)}
            onClick={() => router.push(`/review-request/${item.id}`)}
          />
        ))}
      </div>

      {/* Pagination info */}
      {!isLoading && !error && items.length > 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          총 {totalItems}개의 리뷰 요청
        </div>
      )}
    </div>
  );
}
