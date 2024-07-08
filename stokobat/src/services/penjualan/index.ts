import { api } from "../api";

export const fetchPenjualan = async (token: string) => {
    try {
      const response = await api.get('/penjualan', {
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


  export const fetchPenjualanAdd = async (token: string, postData: any) => {
    try {
      const response = await api.post('/penjualan', postData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };


  export const fetchPenjualanDelete = async (token: string, id: string) => {
    try {
      const response = await api.delete(`penjualan/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };