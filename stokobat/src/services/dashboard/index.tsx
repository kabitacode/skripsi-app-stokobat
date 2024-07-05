import { api } from "../api";

export const fetchDashboard = async (token: string) => {
    try {
      const response = await api.get('/dashboard', {
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