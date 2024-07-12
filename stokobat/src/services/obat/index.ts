import { api } from "../api";

export const fetchObat = async (token: string) => {
    try {
      const response = await api.get('/obat', {
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

  export const fetchObatId = async (token: string, id: string) => {
    try {
      const response = await api.get(`obat/${id}`, {
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

  export const fetchObatAdd = async (token: string, postData: any) => {
    try {
      const response = await api.post('/obat', postData, {
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

  export const fetchObatEdit = async (token: string, id: string, postData: any) => {
    try {
      const response = await api.patch(`obat/${id}`, postData, {
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

  export const fetchObatDelete = async (token: string, id: string) => {
    try {
      const response = await api.delete(`obat/${id}`, {
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

  export const fetchObatUpdateStatus = async (token: string) => {
    try {
      const response = await api.put('obat/updateKadaluarsa', {
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