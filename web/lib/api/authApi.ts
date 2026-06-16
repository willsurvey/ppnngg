import { publicApi, adminApi } from './client';
import type { LoginRequest, LoginResponse } from '@/types';

export const authApi = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const { data } = await publicApi.post('/auth/login', credentials);
    return data;
  },

  async logout(): Promise<void> {
    await adminApi.post('/auth/logout');
  },
};
