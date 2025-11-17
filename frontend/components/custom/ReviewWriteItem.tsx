import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface ReviewWriteItemProps {
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  title: string;
  rating: number; // 1-5
  content: string;
  images?: string[]; // 선택적 이미지 배열
  likeCount: number; // 좋아요 개수
}

export default function ReviewWriteItem({
  author,
  date,
  title,
  rating,
  content,
  images,
  likeCount,
}: ReviewWriteItemProps) {
  // 별점 렌더링 (5개의 별)
  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-gray-200 text-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-1">
        <div className="flex items-center gap-3">
          {/* 작성자 아바타 */}
          <Avatar className="h-10 w-10">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          {/* 작성자 이름과 날짜 */}
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{author.name}</span>
            <span className="text-xs text-gray-500">{date}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* 제목 */}
        <h3 className="font-bold text-lg">{title}</h3>

        {/* 별점 */}
        {renderStars(rating)}

        {/* 리뷰 내용 */}
        <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
          {content}
        </p>

        {/* 사진 (선택) */}
        {images && images.length > 0 && (
          <div className="flex gap-2 overflow-x-auto">
            {images.map((image, index) => (
              <div
                key={index}
                className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100"
              >
                <Image
                  src={image}
                  alt={`Review image ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {/* 하단 액션: 좋아요, 추가 팁 */}
        <div className="flex items-center justify-between pt-2 border-t">
          {/* 좋아요 */}
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {likeCount}
            </span>
          </div>

          {/* 추가 팁 주기 버튼 */}
          <Button
            variant="outline"
            size="sm"
            className="bg-black hover:bg-gray-800 text-white border-black dark:bg-white dark:text-black dark:border-white dark:hover:bg-gray-200"
          >
            추가 팁
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
