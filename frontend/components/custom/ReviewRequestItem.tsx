import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, Clock, Coins } from "lucide-react";

interface ReviewRequestItemProps {
  author: {
    name: string;
    avatar?: string;
  };
  date: string;
  title: string;
  content: string;
  reward: number; // 보상 코인
  commentCount: number; // 댓글 개수
  validPeriod: string; // 유효 기간
}

export default function ReviewRequestItem({
  author,
  date,
  title,
  content,
  reward,
  commentCount,
  validPeriod,
}: ReviewRequestItemProps) {
  // 내용이 길면 잘라내고 ...추가
  const truncateContent = (text: string, maxLength: number = 100) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
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

      <CardContent className="space-y-1">
        {/* 제목 */}
        <h3 className="font-bold text-lg">{title}</h3>

        {/* 요청 내용 */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {truncateContent(content)}
        </p>

        {/* 하단 정보: 보상, 댓글, 유효기간 */}
        <div className="flex items-center gap-4 pt-2 border-t text-sm text-gray-600 dark:text-gray-400">
          {/* 보상 코인 */}
          <div className="flex items-center gap-1">
            <Coins className="h-4 w-4" />
            <span>{reward}</span>
          </div>

          {/* 댓글 개수 */}
          <div className="flex items-center gap-1">
            <MessageCircle className="h-4 w-4" />
            <span>{commentCount}</span>
          </div>

          {/* 유효 기간 */}
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{validPeriod}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}