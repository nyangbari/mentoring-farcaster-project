import { NextRequest, NextResponse } from "next/server";

// 여기에 테스트할 함수 import
// import { myFunction } from "@/lib/myModule";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fn = searchParams.get("fn");

  try {
    // 여기에 테스트할 함수 추가
    const functions: Record<string, () => Promise<any> | any> = {
      test: () => ({ message: "Test OK" }),

      // 여기에 lib 함수 추가
      // myFunction: async () => {
      //   const result = await myFunction();
      //   return result;
      // },
    };

    if (!fn) {
      return NextResponse.json({
        available: Object.keys(functions),
      });
    }

    const func = functions[fn];
    if (!func) {
      return NextResponse.json({ error: "Function not found" }, { status: 404 });
    }

    const result = await func();
    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
