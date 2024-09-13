import PenjualanModel from '../models/PenjualanModel.mjs';
import ObatModel from '../models/ObatModel.mjs';
import { Sequelize, Op } from 'sequelize';
import KategoriModel from '../models/KategoriModel.mjs';

// Penjualan dengan metode FEFO
export const createPenjualan = async (req, res) => {
    const { jumlah, tanggal_transaksi, id_obat, id_kategori } = req.body;

    try {
        // Cari obat berdasarkan ID yang dipilih oleh user
        const obat = await ObatModel.findOne({
            where: {
                id_kategori: id_kategori,
                id: id_obat,
                stok: {
                    [Op.gte]: jumlah // Pastikan stok mencukupi
                }
            }
        });

        // Jika obat tidak ditemukan atau stok tidak mencukupi, kirim error
        if (!obat) {
            return res.status(404).json({ message: "Obat tidak ditemukan atau stok tidak mencukupi!" });
        }


        // Hitung total harga
        const total_harga = obat.harga * jumlah;

        // Kurangi stok obat yang dipilih
        obat.stok -= jumlah;
        await obat.save();

        // Membuat transaksi penjualan
        const penjualan = await PenjualanModel.create({
            jumlah,
            total_harga,
            tanggal_transaksi,
            id_obat: obat.id // Pastikan ID obat yang dipilih digunakan di sini
        });

        res.status(201).json({
            status: 201,
            message: "Penjualan berhasil dibuat",
            data: penjualan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePenjualan = async (req, res) => {
    const { id } = req.params;
    const { jumlah, tanggal_transaksi, id_obat, id_kategori } = req.body;

    try {
        // Cari penjualan berdasarkan ID
        const penjualan = await PenjualanModel.findOne({
            where: {
                id: id
            }
        });

        if (!penjualan) {
            return res.status(404).json({ message: "Penjualan tidak ditemukan!" });
        }

        // Cari obat berdasarkan ID yang dipilih oleh user
        const obat = await ObatModel.findOne({
            where: {
                id_kategori: id_kategori,
                id: id_obat,
                stok: {
                    [Op.gte]: jumlah // Pastikan stok mencukupi
                }
            }
        });

        if (!obat) {
            return res.status(404).json({ message: "Obat tidak ditemukan atau stok tidak mencukupi!" });
        }

        // Hitung total harga
        const total_harga = obat.harga * jumlah;

        // Kembalikan stok obat sebelumnya
        const previousObat = await ObatModel.findOne({
            where: {
                id: penjualan.id_obat
            }
        });
        previousObat.stok += penjualan.jumlah;
        await previousObat.save();

        // Kurangi stok obat baru yang dipilih
        obat.stok -= jumlah;
        await obat.save();

        // Update data penjualan
        await penjualan.update({
            jumlah,
            total_harga,
            tanggal_transaksi,
            id_obat: obat.id
        });

        res.status(200).json({
            status: 200,
            message: "Penjualan berhasil diperbarui",
            data: penjualan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPenjualanById = async (req, res) => {
    const { id } = req.params;

    try {
        const penjualan = await PenjualanModel.findOne({
            where: {
                id: id
            },
            include: [{
                model: ObatModel,
                include: {
                    model: KategoriModel
                }
            }]
        });

        if (!penjualan) {
            return res.status(404).json({ message: "Penjualan tidak ditemukan!" });
        }

        res.status(200).json({
            status: 200,
            message: "success",
            data: penjualan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Mendapatkan Semua Penjualan
export const getPenjualan = async (req, res) => {
    try {
        const penjualan = await PenjualanModel.findAll({
            include: [{
                model: ObatModel,
                include: {
                    model: KategoriModel
                }
            }]
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


export const deletePenjualan = async (req, res) => {
    try {
        const user = await PenjualanModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

        await PenjualanModel.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({
            status: 200,
            message: "Deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


export const getPenjualanFiltered = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        // Buat objek where untuk menampung kondisi filter
        const whereCondition = {};

        if (start_date && end_date) {
            whereCondition.tanggal_transaksi = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        // Query untuk mendapatkan data penjualan berdasarkan kondisi filter
        const filteredPenjualan = await PenjualanModel.findAll({
            include: [{
                model: ObatModel,
                include: {
                    model: KategoriModel
                }
            }],
            where: whereCondition
        });

        if (filteredPenjualan.length === 0) {
            return res.status(404).json({
                status: 404,
                message: "Tidak ada penjualan yang sesuai dengan filter."
            });
        }

        res.status(200).json({
            status: 200,
            message: "Data Penjualan berhasil ditemukan.",
            data: filteredPenjualan
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
