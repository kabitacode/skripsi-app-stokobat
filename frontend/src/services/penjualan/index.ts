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


  
  export const fetchPenjualanByKategori = async (id: string, token: string) => {
    try {
      const response = await api.get(`fefo/${id}`, {
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

  export const fetchPenjualanById = async (id: string, token: string) => {
    try {
      const response = await api.get(`penjualan/${id}`, {
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

  export const fetchPenjualanEdit = async (token: string, id: string) => {
    try {
      const response = await api.put(`penjualan/${id}`, {
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

  export const fetchPenjualanFilter = async (token: string, start_date: any, end_date: any) => {
    try {
      const response = await api.get(`/penjualan/filter?start_date=${start_date}&end_date=${end_date}`, {
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