// services/api.ts
import axios from 'axios';
import {api} from '@/services'

interface LoginResponse {
  email: string;
  name: string;
  role: string;
  token: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { email, password }, {
    headers: {
        "Content-Type": "application/json"
      }
  });
  return response.data;
};

export const logout = async (token: string): Promise<void> => {
  await api.delete('/logout',{
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${token}`
    }
  });
};

export const fetchRegister = async (postData: any) => {
  try {
    const response = await api.post('/register', postData, {
      headers: {
        'Content-Type': 'application/json'
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};