"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { ArrowLeft, MessageCircle, Clock, Coins } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ReviewWriteDialog from "@/components/custom/ReviewWriteDialog";

interface ReviewRequestData {
  id: number;
  user_id: string;
  title: string;
  category: string;
  description: string;
  reward: number;
  deadline: string;
}

export default function ReviewRequestDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [item, setItem] = useState<ReviewRequestData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // 데이터 조회
  useEffect(() => {
    const fetchReviewRequest = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/review-request/${id}`);

        if (!response.ok) {
          throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data: ReviewRequestData = await response.json();
        setItem(data);
        setError(null);
      } catch (err) {
        console.error("리뷰 요청 상세 조회 실패:", err);
        setError(err instanceof Error ? err.message : "알 수 없는 오류");
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviewRequest();
  }, [id]);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">리뷰 요청 상세</h1>
          </div>
        </div>
        <div className="text-center py-8 text-gray-500">
          로딩 중...
        </div>
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-black">
        <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <h1 className="text-2xl font-bold">리뷰 요청 상세</h1>
          </div>
        </div>
        <div className="text-center py-8 text-red-500">
          에러: {error || "데이터를 찾을 수 없습니다."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header with back button */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-2xl font-bold">리뷰 요청 상세</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader className="pb-0">
            <div className="flex items-center gap-3">
              {/* 작성자 아바타 */}
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${item.user_id}`}
                  alt={item.user_id}
                />
                <AvatarFallback>{item.user_id.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>

              {/* 작성자 이름과 날짜 */}
              <div className="flex flex-col">
                <span className="text-sm font-semibold">{item.user_id}</span>
                <span className="text-xs text-gray-500">{formatDate(item.deadline)}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* 카테고리 */}
            <div className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-full text-sm">
              {item.category}
            </div>

            {/* 제목 */}
            <h3 className="font-bold text-2xl">{item.title}</h3>

            {/* 요청 내용 전체 */}
            <div className="text-base text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
              {item.description}
            </div>

            {/* 하단 정보: 보상, 댓글, 유효기간 */}
            <div className="flex items-center gap-4 pt-4 border-t text-sm text-gray-600 dark:text-gray-400">
              {/* 보상 코인 */}
              <div className="flex items-center gap-1">
                <Coins className="h-4 w-4" />
                <span className="font-semibold">{item.reward} 코인</span>
              </div>

              {/* 댓글 개수 */}
              <div className="flex items-center gap-1">
                <MessageCircle className="h-4 w-4" />
                <span>0</span>
              </div>

              {/* 유효 기간 */}
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{calculateRemainingDays(item.deadline)}</span>
              </div>
            </div>

            {/* 리뷰 작성 버튼 */}
            <Button
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="lg"
              onClick={() => setIsDialogOpen(true)}
            >
              리뷰 작성하기
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* 리뷰 작성 Dialog */}
      <ReviewWriteDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        reviewRequestId={item.id}
      />
    </div>
  );
}
