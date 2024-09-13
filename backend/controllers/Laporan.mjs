import { Op } from 'sequelize';
import ObatModel from '../models/ObatModel.mjs';
import PenjualanModel from '../models/PenjualanModel.mjs';
import KategoriModel from '../models/KategoriModel.mjs';
import ExcelJS from 'exceljs';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Helper function to create directory if not exists
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

// Helper function to create Excel file
const createExcelFile = async (data, sheetName, fileName) => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
        worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key: key, width: 20 }));
        data.forEach(item => worksheet.addRow(item));
    }

    const downloadsPath = path.join(os.homedir(), 'Downloads');
    const filePath = path.join(downloadsPath, fileName);

    // Ensure directory exists
    ensureDirectoryExistence(filePath);

    await workbook.xlsx.writeFile(filePath);
    return filePath;
};

// Controller to get expired medicines
export const getLaporanKadaluarsa = async (req, res) => {
    try {
        const today = new Date();

        const kadaluarsaObat = await ObatModel.findAll({
            where: {
                status_kadaluarsa: "Kadaluarsa"
            },
            include: {
                model: KategoriModel
            }
        });

        const dataKadaluarsa = kadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Harga': obat.harga,
            'Kategori': obat.kategori.nama,
            'Status Kadaluarsa': obat.status_kadaluarsa,
            'Tanggal Kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const filePath = await createExcelFile(dataKadaluarsa, 'Obat Kadaluarsa', 'laporan_kadaluarsa.xlsx');

        res.send({
            status: "success",
            message: "Data berhasil di export!",
            path: filePath,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller to get medicines approaching expiry
export const getLaporanMendekatiKadaluarsa = async (req, res) => {
    try {
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        const mendekatiKadaluarsaObat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.between]: [today, oneMonthLater]
                }
            },
            include: {
                model: KategoriModel
            }
        });

        const dataMendekatiKadaluarsa = mendekatiKadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Harga': obat.harga,
            'Kategori': obat.kategori.nama,
            'Status Kadaluarsa': obat.status_kadaluarsa,
            'Tanggal Kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const filePath = await createExcelFile(dataMendekatiKadaluarsa, 'Obat Mendekati Kadaluarsa', 'laporan_mendekati_kadaluarsa.xlsx');

        res.send({
            status: "success",
            message: "Data berhasil di export!",
            path: filePath,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller to get all medicines
export const getLaporanObat = async (req, res) => {
    try {
        const allObat = await ObatModel.findAll({
            include: [
                {
                    model: KategoriModel
                }
            ]
        });

        const dataLaporan = allObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Kategori': obat.kategori.nama,
            'Harga': obat.harga,
            'Status Kadaluarsa': obat.status_kadaluarsa,
            'Tanggal Kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const filePath = await createExcelFile(dataLaporan, 'Laporan Obat', 'laporan_obat.xlsx');

        res.send({
            status: "success",
            message: "Data berhasil di export!",
            path: filePath,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: error.message });
    }
};

// Controller to get sales report
export const getLaporanPenjualan = async (req, res) => {
    try {
        const dataPenjualan = await PenjualanModel.findAll({
            include: [
                {
                    model: ObatModel
                }
            ]
        });

        const dataLaporanPenjualan = dataPenjualan.map(transaksi => ({
            'Nama Obat': transaksi.obat.nama_obat,
            'Stok': transaksi.obat.stok,
            'Harga Obat': transaksi.obat.harga,
            'Jumlah': transaksi.jumlah,
            'Total Harga': transaksi.total_harga,
            'Tanggal Transaksi': new Date(transaksi.tanggal_transaksi).toISOString().split('T')[0]
        }));

        const filePath = await createExcelFile(dataLaporanPenjualan, 'Laporan Penjualan', 'laporan_penjualan.xlsx');

        res.send({
            status: "success",
            message: "Data berhasil di export!",
            path: filePath,
        });
    } catch (error) {
        console.error('Error generating report:', error);
        res.status(500).json({ message: error.message });
    }
};

export const getData = async (req, res) => {
    try {
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        // Dapatkan semua obat
        const allObat = await ObatModel.findAll({
            include: [
                {
                    model: KategoriModel
                }
            ]
        });

        // get all data penjualan with obat
        const dataPenjualanModel = await PenjualanModel.findAll({
            include: [
                {
                    model: ObatModel
                }
            ]
        });


        const mendekatiKadaluarsaObat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.between]: [today, oneMonthLater]
                }
            },
            include: {
                model: KategoriModel
            }
        });

        // Filter dan hitung obat yang sudah kadaluarsa dan mendekati kadaluarsa
        const kadaluarsaObat = allObat.filter(obat => obat.status_kadaluarsa === "Kadaluarsa");

        const dataKadaluarsa = kadaluarsaObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'penerbit': obat.kategori.penerbit,
            'harga': obat.harga,
            'harga_beli': obat.harga_beli,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const dataMendekatiKadaluarsa = mendekatiKadaluarsaObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'penerbit': obat.kategori.penerbit,
            'harga': obat.harga,
            'harga_beli': obat.harga_beli,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        // Menyiapkan data laporan lengkap
        const dataLaporan = allObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'penerbit': obat.kategori.penerbit,
            'harga': obat.harga,
            'harga_beli': obat.harga_beli,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const dataPenjualan = dataPenjualanModel.map(transaksi => ({
            'nama_obat': transaksi.obat.nama_obat,
            'stok': transaksi.obat.stok,
            'harga_obat': transaksi.obat.harga,
            'jumlah': transaksi.jumlah,
            'total_harga': transaksi.total_harga,
            'tanggal_transaksi': new Date(transaksi.tanggal_transaksi).toISOString().split('T')[0]
        }))

        res.status(200).json({
            status: 200,
            message: "success",
            data: {
                kadaluarsa: dataKadaluarsa,
                mendekatiKadaluarsa: dataMendekatiKadaluarsa,
                laporan: dataLaporan,
                penjualan: dataPenjualan
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getFilteredObatKadaluarsa = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        // Buat objek where untuk menampung kondisi filter
        const whereCondition = {};

        if (start_date && end_date) {
            whereCondition.tanggal_kadaluarsa = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            },
            whereCondition.status_kadaluarsa === "Kadaluarsa"
        }

        // Query untuk mendapatkan data obat berdasarkan kondisi filter
        const filteredObat = await ObatModel.findAll({
            include: KategoriModel,
            where: whereCondition
        });

        if (filteredObat.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Tidak ada obat yang sesuai dengan filter."
            });
        }
        

        res.status(200).json({
            status: 200,
            message: "Data obat berhasil ditemukan.",
            data: filteredObat
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};