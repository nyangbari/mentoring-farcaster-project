import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";
import { useState, useEffect } from "react";

interface CastData {
  text?: string;
  embeds?: Array<{ url: string }>;
}

interface ReviewItemProps {
  reviewer_user_name: string;
  reviewer_user_profile_url: string;
  reviewer_f_id: string;
  rating: number;
  review_hash: string;
  summary: string;
  onClick?: () => void;
}

export default function ReviewItem({
  reviewer_user_name,
  reviewer_user_profile_url,
  reviewer_f_id,
  rating,
  review_hash,
  summary,
  onClick,
}: ReviewItemProps) {
  const [castData, setCastData] = useState<CastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCastData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://210.109.54.183:3381/v1/castById?fid=${reviewer_f_id}&hash=${review_hash}`
        );

        if (!response.ok) {
          throw new Error('캐스트 데이터를 불러올 수 없습니다.');
        }

        const data: CastData = await response.json();
        setCastData(data);
        setError(null);
      } catch (err) {
        console.error('캐스트 데이터 조회 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCastData();
  }, [reviewer_f_id, review_hash]);

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

      <CardContent className="space-y-3">
        {/* 요약 */}
        <div className="pb-2 border-b">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {summary}
          </p>
        </div>

        {/* 캐스트 내용 */}
        {isLoading && (
          <div className="text-xs text-gray-500">
            리뷰 내용 로딩 중...
          </div>
        )}

        {error && (
          <div className="text-xs text-red-500">
            {error}
          </div>
        )}

        {!isLoading && !error && castData && (
          <div className="space-y-3">
            {/* 캐스트 텍스트 */}
            {castData.text && (
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {castData.text}
              </p>
            )}

            {/* 캐스트 이미지들 */}
            {castData.embeds && castData.embeds.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {castData.embeds.map((embed, index) => (
                  <img
                    key={index}
                    src={embed.url}
                    alt={`embed-${index}`}
                    className="w-full h-auto rounded-lg object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
