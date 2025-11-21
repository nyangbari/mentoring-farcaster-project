import ReviewWriteItem from "@/components/custom/ReviewWriteItem";

export default function HomePage() {
  // 베스트 리뷰 데이터
  const bestReview = {
    author: {
      name: "김개발",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=bestreview",
    },
    date: "2024.11.10",
    title: "완벽한 코드 리뷰였습니다!",
    rating: 5,
    content: "정말 상세하고 친절한 리뷰를 받았습니다. 제가 놓쳤던 성능 이슈와 보안 취약점까지 모두 짚어주셨고, 개선 방향도 구체적으로 제시해주셔서 큰 도움이 되었습니다. 코드 품질이 확실히 향상되었어요!",
    images: [
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400",
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400",
    ],
    likeCount: 127,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-black border-b p-4">
        <h1 className="text-2xl font-bold">홈</h1>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* 이주의 베스트 섹션 */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="text-xl font-bold">베스트 리뷰 요청</h2>
            <span className="text-2xl">⭐</span>
          </div>

          <ReviewWriteItem
            author={bestReview.author}
            date={bestReview.date}
            title={bestReview.title}
            rating={bestReview.rating}
            content={bestReview.content}
            images={bestReview.images}
            likeCount={bestReview.likeCount}
          />
        </div>
      </div>
    </div>
  );
}
