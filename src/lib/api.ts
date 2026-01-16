import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export interface AuthResponse {
  message: string;
  token: string;
  username: string;
  avatar?: string;
}

export interface MoodData {
  mood: string;
  date: string;
}

export interface YearMoodData {
  year: string;
  moods: Record<string, string>;
  stats: Record<string, number>;
  percentages: Record<string, string>;
  totalDays: number;
}

export const authApi = {
  register: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/register', { username, password }),
  login: (username: string, password: string) =>
    api.post<AuthResponse>('/auth/login', { username, password }),
  googleLogin: (credential: string) =>
    api.post<AuthResponse>('/auth/google', { credential }),
};

export const moodApi = {
  logMood: (mood: string, date?: string) =>
    api.post<MoodData>('/mood', { mood, date }),
  getTodayMood: () =>
    api.get<{ mood: MoodData | null; date: string }>('/mood/today'),
  getYearMoods: (year: number) =>
    api.get<YearMoodData>(`/mood/year/${year}`),
};

export default api;
