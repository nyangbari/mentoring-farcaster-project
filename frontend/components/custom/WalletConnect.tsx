"use client";

import { useState } from "react";
import { useUserStore } from "@/lib/store/userStore";
import { sdk } from "@farcaster/miniapp-sdk";

export function WalletConnect() {
  const { isMiniApp, setConnectedWallet, connectedWallet } = useUserStore();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connectFarcasterWallet = async () => {
    if (!isMiniApp) {
      setError("Farcaster 미니앱에서만 지갑을 연결할 수 있습니다.");
      return;
    }

    try {
      setIsConnecting(true);
      setError(null);

      // Farcaster Mini App SDK의 Ethereum Provider 사용
      const provider = sdk.wallet.ethProvider;
      const accounts = await provider.request({
        method: 'eth_requestAccounts'
      }) as string[];

      if (accounts && accounts.length > 0) {
        setConnectedWallet(accounts[0]);
      }
    } catch (err: any) {
      console.error("Wallet connection error:", err);
      setError(err.message || "지갑 연결에 실패했습니다.");
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setConnectedWallet(null);
    setError(null);
  };

  if (!isMiniApp) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-sm text-yellow-800 dark:text-yellow-300">
          Farcaster 미니앱에서만 지갑 연결이 가능합니다.
        </p>
      </div>
    );
  }

  if (connectedWallet) {
    return (
      <div className="space-y-4">
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-green-800 dark:text-green-300 mb-2">
            Farcaster 지갑 연결됨
          </p>
          <p className="font-mono text-sm text-green-700 dark:text-green-400 break-all">
            {connectedWallet}
          </p>
        </div>
        <button
          onClick={disconnectWallet}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
        >
          지갑 연결 해제
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Farcaster 미니앱을 통해 지갑을 연결하세요.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
          <p className="text-sm text-red-800 dark:text-red-300">
            {error}
          </p>
        </div>
      )}

      <button
        onClick={connectFarcasterWallet}
        disabled={isConnecting}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {isConnecting ? (
          <>
            <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
            연결 중...
          </>
        ) : (
          'Farcaster 지갑 연결'
        )}
      </button>
    </div>
  );
}
