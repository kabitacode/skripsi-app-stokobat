import { api } from "../api";

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