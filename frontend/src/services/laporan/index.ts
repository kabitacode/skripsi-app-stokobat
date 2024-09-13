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

export const fetchLaporanKadaluarsa = async (token: string) => {
  try {
    const response = await api.get('/laporan-kadaluarsa', {
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

export const fetchLaporanMendekatiKadaluarsa = async (token: string) => {
  try {
    const response = await api.get('/laporan-mendekati-kadaluarsa', {
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

export const fetchLaporanPenjualan = async (token: string) => {
  try {
    const response = await api.get('/laporan-penjualan', {
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

//Filter

export const fetchFilterObatKadaluarsa = async (token: string, start_date: any, end_date: any) => {
  try {
    const response = await api.get(`/laporan-kadaluarsa/filter?start_date=${start_date}&end_date=${end_date}`, {
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