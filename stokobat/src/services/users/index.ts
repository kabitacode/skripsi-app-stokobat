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