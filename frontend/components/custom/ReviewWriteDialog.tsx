"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

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
  const [castHash, setCastHash] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!castHash.trim()) {
      alert("리뷰 캐스트 해시를 입력해주세요.");
      return;
    }

    if (rating === 0) {
      alert("별점을 선택해주세요.");
      return;
    }

    if (!description.trim()) {
      alert("간단한 설명을 입력해주세요.");
      return;
    }

    if (description.length > 50) {
      alert("설명은 50자 이내로 입력해주세요.");
      return;
    }

    try {
      setIsSubmitting(true);

      // TODO: 실제 API 호출 로직 구현
      const reviewData = {
        review_request_id: reviewRequestId,
        cast_hash: castHash,
        rating: rating,
        description: description,
      };

      console.log("리뷰 작성 데이터:", reviewData);

      // API 호출 예시
      // const response = await fetch('/api/review', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(reviewData),
      // });
      //
      // if (!response.ok) {
      //   throw new Error('리뷰 작성 실패');
      // }

      alert("리뷰가 성공적으로 작성되었습니다!");

      // 폼 초기화
      setCastHash("");
      setRating(0);
      setDescription("");
      onOpenChange(false);
    } catch (error) {
      console.error("리뷰 작성 에러:", error);
      alert("리뷰 작성 중 오류가 발생했습니다.");
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
    </Dialog>
  );
}
