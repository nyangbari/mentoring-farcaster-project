import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface ReviewItemProps {
  reviewer_user_name: string;
  reviewer_user_profile_url: string;
  rating: number;
  review_hash: string;
  summary: string;
  onClick?: () => void;
}

export default function ReviewItem({
  reviewer_user_name,
  reviewer_user_profile_url,
  rating,
  review_hash,
  summary,
  onClick,
}: ReviewItemProps) {
  return (
    <Card
      className="w-full cursor-pointer hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          {/* 리뷰어 정보 */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={reviewer_user_profile_url} alt={reviewer_user_name} />
              <AvatarFallback>{reviewer_user_name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-semibold">{reviewer_user_name}</span>
          </div>

          {/* 별점 */}
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-none text-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {/* 해시 값 */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">해시:</span>
          <span className="text-xs font-mono text-gray-700 dark:text-gray-300 truncate">
            {review_hash}
          </span>
        </div>

        {/* 요약 */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {summary}
        </p>
      </CardContent>
    </Card>
  );
}
