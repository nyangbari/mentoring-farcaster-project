"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useUserStore } from "@/lib/store/userStore";

interface ReviewWriteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reviewRequestId: number;
}

export default function ReviewWriteDialog({
  open,
  onOpenChange,
  reviewRequestId,
}: ReviewWriteDialogProps) {
  const router = useRouter();
  const { user, connectedWallet } = useUserStore();
  const [castHash, setCastHash] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 알림 다이얼로그 상태
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // 알림 표시 함수
  const showAlert = (title: string, message: string, success = false) => {
    setAlertTitle(title);
    setAlertMessage(message);
    setIsSuccess(success);
    setAlertOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 유효성 검사
    if (!user?.fid) {
      showAlert("로그인 필요", "로그인이 필요합니다.");
      return;
    }

    if (!connectedWallet) {
      showAlert("지갑 연결 필요", "지갑 연결이 필요합니다.");
      return;
    }

    if (!castHash.trim()) {
      showAlert("입력 필요", "리뷰 캐스트 해시를 입력해주세요.");
      return;
    }

    if (rating === 0) {
      showAlert("별점 선택 필요", "별점을 선택해주세요.");
      return;
    }

    if (!description.trim()) {
      showAlert("입력 필요", "간단한 설명을 입력해주세요.");
      return;
    }

    if (description.length > 50) {
      showAlert("글자 수 초과", "설명은 50자 이내로 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      // API 명세에 맞게 요청 데이터 구성
      const reviewData = {
        review_request_id: reviewRequestId,
        review_hash: castHash,
        reviewer_f_id: user.fid.toString(),
        reviewer_user_name: user.displayName || user.username || "Anonymous",
        reviewer_user_profile_url: user.pfpUrl || "",
        reviewer_wallet_addr: connectedWallet,
        rating: rating,
        summary: description,
      };

      console.log("리뷰 작성 데이터:", reviewData);

      // API 호출
      const response = await fetch('/api/review/create-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `리뷰 작성 실패: ${response.status}`);
      }

      // 폼 초기화
      setCastHash("");
      setRating(0);
      setDescription("");
      onOpenChange(false);

      // 성공 알림 표시
      showAlert("성공", "리뷰가 성공적으로 작성되었습니다!", true);
    } catch (error) {
      console.error("리뷰 작성 에러:", error);
      showAlert("오류 발생", `리뷰 작성 중 오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`, false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= 50) {
      setDescription(value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>리뷰 작성하기</DialogTitle>
          <DialogDescription>
            리뷰 캐스트 해시와 간단한 설명을 입력해주세요.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* 리뷰 캐스트 해시 입력 */}
            <div className="space-y-2">
              <Label htmlFor="castHash"># 리뷰 캐스트 해시</Label>
              <Input
                id="castHash"
                placeholder="캐스트 hash를 입력하세요"
                value={castHash}
                onChange={(e) => setCastHash(e.target.value)}
                className="bg-white dark:bg-gray-900"
                required
              />
            </div>

            {/* 별점 선택 (5점 만점) */}
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110 focus:outline-none"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-none text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* 간단 설명 입력 (50자 제한) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="description">간단한 설명</Label>
                <span className="text-xs text-gray-500">
                  {description.length}/50
                </span>
              </div>
              <Textarea
                id="description"
                placeholder="50자 이내로 간단히 설명해주세요"
                value={description}
                onChange={handleDescriptionChange}
                className="bg-white dark:bg-gray-900"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              취소
            </Button>
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? "작성 중..." : "작성"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>

      {/* 알림 다이얼로그 */}
      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{alertTitle}</AlertDialogTitle>
            <AlertDialogDescription>{alertMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setAlertOpen(false);
                if (isSuccess) {
                  // 성공 시 리뷰 요청 탭으로 이동
                  router.push("/review-request");
                }
              }}
            >
              확인
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Dialog>
  );
}
