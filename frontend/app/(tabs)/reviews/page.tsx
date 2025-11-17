import { Button } from "@/components/ui/button";
import ReviewWriteItem from "@/components/custom/ReviewWriteItem";

export default function ReviewsPage() {
  // 예시 데이터
  const items = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    author: {
      name: `Reviewer ${i + 1}`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=reviewer${i + 1}`,
    },
    date: "2024.11.14",
    title: `리뷰 제목 ${i + 1}`,
    rating: Math.floor(Math.random() * 5) + 1, // 1-5 랜덤 별점
    content: "이 프로젝트는 정말 훌륭했습니다. 코드 구조가 깔끔하고 잘 정리되어 있어서 이해하기 쉬웠습니다. 특히 에러 핸들링 부분이 잘 되어 있어 안정적으로 작동했습니다.",
    images: i % 2 === 0 ? [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    ] : undefined, // 짝수 아이템만 이미지 추가
    likeCount: Math.floor(Math.random() * 100) + 10, // 10-109 랜덤 좋아요 개수
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">리뷰 작성</h1>
          <Button className="bg-orange-600 hover:bg-orange-700 text-white">
            리뷰 작성하기
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-4 p-4">
        {items.map((item) => (
          <ReviewWriteItem
            key={item.id}
            author={item.author}
            date={item.date}
            title={item.title}
            rating={item.rating}
            content={item.content}
            images={item.images}
            likeCount={item.likeCount}
          />
        ))}
      </div>
    </div>
  );
}
