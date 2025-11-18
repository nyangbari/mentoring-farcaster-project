import { create } from 'zustand';

export interface UserData {
  fid: number;
  username: string;
  displayName: string;
  pfpUrl: string;
  profile?: any;
}

interface UserStore {
  user: UserData | null;
  isLoading: boolean;
  isMiniApp: boolean;
  connectedWallet: string | null;
  setUser: (user: UserData | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsMiniApp: (isMiniApp: boolean) => void;
  setConnectedWallet: (wallet: string | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  isLoading: true,
  isMiniApp: false,
  connectedWallet: null,
  setUser: (user) => set({ user, isLoading: false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsMiniApp: (isMiniApp) => set({ isMiniApp }),
  setConnectedWallet: (wallet) => set({ connectedWallet: wallet }),
  clearUser: () => set({ user: null, isLoading: false, connectedWallet: null }),
}));
