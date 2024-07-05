import { api } from "../api";

export const fetchBatch = async (token: string) => {
    try {
      const response = await api.get('/batch', {
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

  export const fetchBatchId = async (token: string, id: string) => {
    try {
      const response = await api.get(`batch/${id}`, {
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

  export const fetchBatchAdd = async (token: string, postData: any) => {
    try {
      const response = await api.post('/batch', postData, {
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

  export const fetchBatchEdit = async (token: string, id: string, postData: any) => {
    try {
      const response = await api.patch(`batch/${id}`, postData, {
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

  export const fetchBatchDelete = async (token: string, id: string) => {
    try {
      const response = await api.delete(`batch/${id}`, {
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