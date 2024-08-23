import PenjualanModel from '../models/PenjualanModel.mjs';
import ObatModel from '../models/ObatModel.mjs';
import { Sequelize, Op } from 'sequelize';
import KategoriModel from '../models/KategoriModel.mjs';

// Mendapatkan Obat Berdasarkan Kategori dengan Metode FEFO
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
                status_kadaluarsa: "Tidak Kadaluarsa"
            },
            order: [
                ['tanggal_kadaluarsa', 'ASC'] // Urutkan berdasarkan tanggal kadaluarsa yang mendekati
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

