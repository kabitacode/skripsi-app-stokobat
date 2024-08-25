import { Sequelize } from 'sequelize';
import KategoriModel from "../models/KategoriModel.mjs";
import ObatModel from "../models/ObatModel.mjs";
import PenjualanModel from '../models/PenjualanModel.mjs';


export const getData = async (req, res) => {
    try {
        // Mendapatkan semua obat
        const allObat = await ObatModel.findAll({
            include: KategoriModel
        });

        // Menghitung total stok, obat kedaluwarsa, dan obat mendekati kedaluwarsa
        let totalStokObat = 0;
        let totalKadaluarsa = 0;
        let totalMendekatiKadaluarsa = 0;

        // Array detail stok, mendekati kadaluarsa, dan kadaluarsa
        let stokObat = [];
        let kadaluarsaObat = [];
        let mendekatiKadaluarsaObat = [];

        const currentDate = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        allObat.forEach(obat => {
            // Menambahkan stok ke totalStokObat
            totalStokObat += obat.stok;

            // Menambahkan detail ke array stokObat
            stokObat.push({
                id: obat.id,
                nama_obat: obat.nama_obat,
                stok: obat.stok,
                status_kadaluarsa: obat.status_kadaluarsa,
                kategori: obat.kategori.nama,
                harga: obat.harga,
                tanggal_kadaluarsa: obat.tanggal_kadaluarsa
            });

            // Memeriksa obat yang sudah kadaluarsa
            if (new Date(obat.tanggal_kadaluarsa) < currentDate) {
                totalKadaluarsa++;
                kadaluarsaObat.push({
                    id: obat.id,
                    nama_obat: obat.nama_obat,
                    stok: obat.stok,
                    harga: obat.harga,
                    status_kadaluarsa: obat.status_kadaluarsa,
                    kategori: obat.kategori.nama,
                    tanggal_kadaluarsa: obat.tanggal_kadaluarsa
                });
            }
            // Memeriksa obat yang mendekati kadaluarsa (dalam 1 bulan)
            else if (new Date(obat.tanggal_kadaluarsa) <= oneMonthLater) {
                totalMendekatiKadaluarsa++;
                mendekatiKadaluarsaObat.push({
                    id: obat.id,
                    nama_obat: obat.nama_obat,
                    stok: obat.stok,
                    harga: obat.harga,
                    status_kadaluarsa: obat.status_kadaluarsa,
                    kategori: obat.kategori.nama,
                    tanggal_kadaluarsa: obat.tanggal_kadaluarsa
                });
            }
        });

        res.status(200).json({
            status: 200,
            message: "success",
            data: {
                totalStokObat, // Total semua stok obat
                totalKadaluarsa, // Total obat yang sudah kadaluarsa
                totalMendekatiKadaluarsa, // Total obat yang mendekati kadaluarsa (dalam 1 bulan)
                detail: {
                    stokObat, // Detail semua stok obat
                    kadaluarsaObat, // Detail obat-obat yang sudah kadaluarsa
                    mendekatiKadaluarsaObat // Detail obat-obat yang mendekati kadaluarsa
                }
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPenjualanByBulan = async (req, res) => {
    try {
        const { bulan, tahun } = req.query;

        const penjualan = await PenjualanModel.findAll({
            attributes: [
                [Sequelize.fn('SUM', Sequelize.col('jumlah')), 'total_jumlah'],
                [Sequelize.fn('SUM', Sequelize.col('total_harga')), 'total_pendapatan'],
                'id_obat'
            ],
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('tanggal_transaksi')), bulan),
                    Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('tanggal_transaksi')), tahun)
                ]
            },
            include: {
                model: ObatModel,
                attributes: ['nama_obat']
            },
            group: ['id_obat']
        });

        res.status(200).json({
            status: 200,
            message: "success",
            data: penjualan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
