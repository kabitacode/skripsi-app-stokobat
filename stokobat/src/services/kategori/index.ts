import { api } from "../api";

export const fetchKategori = async (token: string) => {
    try {
      const response = await api.get('/kategori', {
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

  export const fetchKategoriId = async (token: string, id: string) => {
    try {
      const response = await api.get(`kategori/${id}`, {
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

  export const fetchKategoriAdd = async (token: string, postData: any) => {
    try {
      const response = await api.post('/kategori', postData, {
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

  export const fetchKategoriEdit = async (token: string, id: string, postData: any) => {
    try {
      const response = await api.patch(`kategori/${id}`, postData, {
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

  export const fetchKategoriDelete = async (token: string, id: string) => {
    try {
      const response = await api.delete(`kategori/${id}`, {
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