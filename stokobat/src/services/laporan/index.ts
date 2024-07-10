import { api } from "../api";

export const fetchLaporanObat = async (token: string) => {
    try {
      const response = await api.get('/laporan-obat', {
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Disposition': 'attachment; filename=laporan_kadaluarsa.xlsx',
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

export const fetchDataLaporan = async (token: string) => {
    try {
      const response = await api.get('/laporan/data', {
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