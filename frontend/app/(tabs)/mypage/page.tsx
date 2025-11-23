"use client";

import { useUserStore } from "@/lib/store/userStore";
import { WalletConnect } from "@/components/custom/WalletConnect";

export default function MyPage() {
  const { user, isMiniApp, connectedWallet } = useUserStore();

  return (
    <div className="flex min-h-screen flex-col items-start p-6 bg-white dark:bg-black">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">마이페이지</h1>

      {/* Connection Status */}
      <div className="w-full max-w-2xl mb-6">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            접속 방식: {isMiniApp ? "Farcaster Mini App" : "Web Browser"}
          </p>
        </div>
      </div>

      {/* Wallet Connection Section */}
      <div className="w-full max-w-2xl mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          지갑 연결
        </h2>
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <WalletConnect />
        </div>
      </div>

      {/* User Information Section */}
      {user ? (
        <div className="w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            사용자 정보
          </h2>

          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 space-y-4">
            {/* Profile Picture */}
            {user.pfpUrl && (
              <div className="flex items-center gap-4 pb-4 border-b border-gray-300 dark:border-gray-600">
                <img
                  src={user.pfpUrl}
                  alt="Profile"
                  className="w-20 h-20 rounded-full"
                />
                <div>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {user.displayName}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    @{user.username}
                  </p>
                </div>
              </div>
            )}

            {/* Basic Info */}
            <div className="space-y-3">
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">FID: </span>
                <span className="text-gray-600 dark:text-gray-400">{user.fid}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Username: </span>
                <span className="text-gray-600 dark:text-gray-400">{user.username}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700 dark:text-gray-300">Display Name: </span>
                <span className="text-gray-600 dark:text-gray-400">{user.displayName}</span>
              </div>
            </div>

            {/* Connected Wallet */}
            {connectedWallet && (
              <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-3">
                  연결된 지갑
                </h3>
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-3">
                  <p className="text-xs font-semibold text-green-800 dark:text-green-300 mb-1">
                    현재 연결된 지갑
                  </p>
                  <p className="font-mono text-sm text-green-700 dark:text-green-400 break-all">
                    {connectedWallet}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full max-w-2xl">
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
            <p className="text-gray-600 dark:text-gray-400">
              사용자 정보를 불러오는 중이거나 로그인이 필요합니다.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
