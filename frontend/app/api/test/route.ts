import { NextRequest, NextResponse } from "next/server";
import { checkTokenBalanceServer } from "@/lib/server/checkTokenBalanceServer";
import { checkWalletServer } from "@/lib/server/checkWalletServer";
import { sendTokensServer } from "@/lib/server/sendTokensServer";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fn = searchParams.get("fn");

  try {
    const functions: Record<string, () => Promise<any> | any> = {
      test: () => ({ message: "Test OK" }),

      checkTokenBalance: async () => {
        const addr = "0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825";
        return await checkTokenBalanceServer(addr, 1000);
      },
      checkWallet: async () => {
        const addr = "0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825";
        return await checkWalletServer(addr);
      },
      sendTokens: async () => {
        const addr = "0x405ff2f6d7b9bc2ad28eee8edaca6ab045c63825"; // 테스트용 지갑
        return await sendTokensServer(addr, 1); // 1 MTR 발행
      },

    };

    // fn 없으면 목록 출력
    if (!fn) {
      return NextResponse.json({ available: Object.keys(functions) });
    }

    // 실행할 함수 찾기
    const func = functions[fn];
    if (!func) {
      return NextResponse.json({ error: "Function not found" }, { status: 404 });
    }

    // 실행
    const result = await func();
    return NextResponse.json({ result });

  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}
