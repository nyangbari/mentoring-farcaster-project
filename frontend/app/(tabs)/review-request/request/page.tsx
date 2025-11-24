"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/lib/store/userStore";

export default function CreateReviewRequestPage() {
  const router = useRouter();
  const { user, connectedWallet } = useUserStore();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    amount: "",
    deadline: "",
  });
  const [showWalletAlert, setShowWalletAlert] = useState(false);

  // 토큰 잔액 확인 함수 (추후 구현 예정)
  const checkTokenBalance = async (requiredAmount: number): Promise<boolean> => {
    // TODO: 실제 지갑 연결 및 토큰 잔액 확인 로직 구현
    console.log(`토큰 잔액 확인 중... 필요한 금액: ${requiredAmount}`);

    // 임시 반환값 (추후 실제 검증 로직으로 교체)
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 지갑 연동 확인
    if (!connectedWallet) {
      setShowWalletAlert(true);
      return;
    }

    // 카테고리 필수 체크
    if (!formData.category) {
      alert("카테고리를 선택해주세요.");
      return;
    }

    const rewardAmount = parseFloat(formData.amount);

    // 토큰 잔액 확인
    try {
      const hasEnoughBalance = await checkTokenBalance(rewardAmount);

      if (!hasEnoughBalance) {
        alert("토큰 잔액이 부족합니다. 지갑을 확인해주세요.");
        return;
      }
    } catch (error) {
      console.error("토큰 잔액 확인 에러:", error);
      alert("토큰 잔액 확인 중 오류가 발생했습니다.");
      return;
    }

    // 폼 데이터를 새로운 API 형식에 맞게 변환
    const requestData = {
      f_id: user?.fid.toString() || "unknown",
      wallet_address: connectedWallet,
      title: formData.title,
      user_name: user?.displayName || user?.username || "Anonymous",
      user_profile_url: user?.pfpUrl || "",
      category: formData.category,
      description: formData.content,
      reward: rewardAmount,
      deadline: formData.deadline,
    };

    try {
      const response = await fetch('/api/review-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status}`);
      }

      const data = await response.json();
      console.log("API 응답:", data);
      alert("리뷰 요청이 성공적으로 전송되었습니다!");
      router.back();
    } catch (error) {
      console.error("API 호출 에러:", error);
      alert(`요청 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
    }
  };

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
          <h1 className="text-2xl font-bold">리뷰 요청 작성</h1>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
          {/* 제목 */}
          <div className="space-y-2">
            <Label htmlFor="title">제목</Label>
            <Input
              id="title"
              placeholder="리뷰 요청 제목을 입력하세요"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="bg-white dark:bg-gray-900"
              required
            />
          </div>

          {/* 카테고리 */}
          <div className="space-y-2">
            <Label htmlFor="category">카테고리</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({ ...formData, category: value })
              }
              required
            >
              <SelectTrigger className="bg-white dark:bg-gray-900">
                <SelectValue placeholder="카테고리를 선택하세요" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="food">음식</SelectItem>
                <SelectItem value="electronics">전자장비</SelectItem>
                <SelectItem value="vehicle">차량</SelectItem>
                <SelectItem value="cosmetics">화장품</SelectItem>
                <SelectItem value="software">SW</SelectItem>
                <SelectItem value="sports">스포츠</SelectItem>
                <SelectItem value="other">기타</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 내용 */}
          <div className="space-y-2">
            <Label htmlFor="content">내용</Label>
            <Textarea
              id="content"
              placeholder="리뷰 요청 내용을 상세히 작성해주세요"
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              className="bg-white dark:bg-gray-900"
              rows={8}
              required
            />
          </div>

          {/* 금액 */}
          <div className="space-y-2">
            <Label htmlFor="amount">금액 (코인)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="보상 금액을 입력하세요"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="bg-white dark:bg-gray-900"
              min="0"
              required
            />
          </div>

          {/* 기한 */}
          <div className="space-y-2">
            <Label htmlFor="deadline">기한</Label>
            <Input
              id="deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) =>
                setFormData({ ...formData, deadline: e.target.value })
              }
              className="bg-white dark:bg-gray-900"
              required
            />
          </div>

          {/* Submit 버튼 */}
          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-700 text-white dark:bg-gray-500 dark:hover:bg-gray-600"
            size="lg"
          >
            리뷰 요청하기
          </Button>
        </form>
      </div>

      {/* 지갑 미연동 알림 Dialog */}
      <Dialog open={showWalletAlert} onOpenChange={setShowWalletAlert}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>지갑 연동 필요</DialogTitle>
            <DialogDescription>
              리뷰 요청을 등록하려면 먼저 지갑을 연동해주세요.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWalletAlert(false)}
            >
              취소
            </Button>
            <Button
              onClick={() => {
                setShowWalletAlert(false);
                router.push("/mypage");
              }}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              지갑 연동하러 가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
