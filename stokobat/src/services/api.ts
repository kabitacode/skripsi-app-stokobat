// services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

interface LoginResponse {
  email: string;
  name: string;
  role: string;
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', { email, password }, {
    headers: {
        "Content-Type": "application/json"
      }
  });
  return response.data;
};

export const logout = async (): Promise<void> => {
  await api.delete('/logout',{
    headers: {
      "Content-Type": "application/json"
    }
  });
};


export const fetchObat = async () => {
  try {
    const response = await api.get('/obat', {
      headers: {
        "Content-Type": "application/json"
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};