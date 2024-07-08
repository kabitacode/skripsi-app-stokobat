import PenjualanModel from '../models/PenjualanModel.js';
import ObatModel from '../models/ObatModel.js';
import { Sequelize, Op } from 'sequelize';
import BatchObatModel from '../models/BatchObatModel.js';
import KategoriModel from '../models/KategoriModel.js';

export const getPenjualan = async (req, res) => {
    try {
        const penjualan = await PenjualanModel.findAll({
            include: [{
                model: ObatModel,
                attributes: ['nama_obat', 'stok', 'harga', 'tanggal_kadaluarsa']
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
export const getObatByKategori = async (req, res) => {
    const { id } = req.params;

    try {
        const today = new Date().toISOString().split('T')[0];

        const obatList = await ObatModel.findAll({
            where: {
                id_kategori: id,
                stok: {
                    [Op.gt]: 0 // Ambil obat yang stoknya lebih dari 0
                },
                tanggal_kadaluarsa: {
                    [Op.lt]: today // Hanya batch yang belum kadaluarsa
                }
            },
            include: {
                model: BatchObatModel,
                where: {
                    status_kadaluarsa: 'Tidak Kadaluarsa',
                },
                required: true // Pastikan obat hanya diambil jika memiliki batch yang valid
            },
            order: [
                ['tanggal_kadaluarsa', 'DESC'] // Urutkan berdasarkan tanggal kadaluarsa batch untuk FEFO
            ]
        });

        res.status(200).json({
            status: 200,
            message: "success",
            data: obatList
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
             


export const createPenjualan = async (req, res) => {
    const { jumlah, tanggal_transaksi, id_obat } = req.body;

    try {
        // Cari obat berdasarkan id_obat yang dipilih klien
        const obat = await ObatModel.findOne({
            where: {
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