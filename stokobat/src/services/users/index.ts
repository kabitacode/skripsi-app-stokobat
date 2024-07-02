import { api } from "../api";

export const fetchUsers = async (token: string) => {
    try {
      const response = await api.get('/users', {
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

  export const fetchUsersId = async (token: string, id: string) => {
    try {
      const response = await api.get(`users/${id}`, {
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

  export const fetchUsersAdd = async (token: string, postData: any) => {
    try {
      const response = await api.post('/users', postData, {
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

  export const fetchUsersEdit = async (token: string, id: string, postData: any) => {
    try {
      const response = await api.patch(`users/${id}`, postData, {
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

  export const fetchUsersDelete = async (token: string, id: string) => {
    try {
      const response = await api.delete(`users/${id}`, {
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