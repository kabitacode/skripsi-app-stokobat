import { api } from "../api";

export const fetchLaporan = async (token: string) => {
    try {
      const response = await api.get('/laporan', {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };