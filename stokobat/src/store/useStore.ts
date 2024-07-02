// store/useStore.ts
import { create } from 'zustand';

export interface User {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

const useStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => {
    localStorage.setItem('token', user.token); 
    set({ user });
  },
  clearUser: () => {
    localStorage.removeItem('token'); 
    set({ user: null });
  },
}));

export default useStore;
