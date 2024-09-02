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

  export const fetchFilterObat = async (token: string, start_date: any, end_date: any) => {
    try {
      const response = await api.get(`/obat/filter?start_date=${start_date}&end_date=${end_date}`, {
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

  export const fetchFilterObatByStatus = async (token: string, status: string) => {
    try {
      const response = await api.get(`/obat/filter-status?status_kadaluarsa=${status}`, {
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

  export const fetchFilterObatByMinStok = async (token: string, min_stok: any) => {
    try {
      const response = await api.get(`/obat/filter-stok?min_stok=${min_stok}`, {
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

  export const fetchFilterObatByEmptyStok = async (token: string, empty_stok: any) => {
    try {
      const response = await api.get(`/obat/filter-stok?stok_habis=${empty_stok}`, {
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

  export const fetchFilterObatByMendekatiKadaluarsa = async (token: string, param: any) => {
    try {
      const response = await api.get(`/obat/filter-stok?mendekati_kadaluarsa=${param}`, {
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


