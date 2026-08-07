export type ThemeMode = "light" | "dark";

export interface User {
  id: string;
  createdAt: string;
  updatedAt: string;
  email: string | null;
  name: string;
  username: string | null;
  title: string | null;
  avatarUrl: string | null;
  isGuest: boolean;
  themeMode: ThemeMode;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}
