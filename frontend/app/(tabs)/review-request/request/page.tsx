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

export default function CreateReviewRequestPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    amount: "",
    deadline: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // TODO: API 호출 및 처리
    router.back();
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
    </div>
  );
}
