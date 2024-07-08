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


async function getObatFEFO(jumlah, id_kategori) {
    try {
        const today = new Date().toISOString().split('T')[0]; // Tanggal hari ini dalam format DATEONLY

        // Cari obat yang memiliki kategori yang sama, stok mencukupi, dan belum kadaluarsa
        const obat = await ObatModel.findOne({
            where: {
                id_kategori: id_kategori,
                stok: {
                    [Op.gt]: 0 // Ambil obat yang stoknya lebih dari 0
                },
                // tanggal_kadaluarsa: {
                //     [Op.gt]: today // Hanya obat yang tanggal kadaluarsanya lebih besar dari hari ini
                // }
            },
            include: {
                model: BatchObatModel,
                where: {
                    status_kadaluarsa: {
                        [Op.ne]: 'Kadaluarsa' // Batch tidak boleh dalam status kadaluarsa
                    }
                },
                required: true // Memastikan ada setidaknya satu batch yang memenuhi kriteria
            },
            order: [
                ['tanggal_kadaluarsa', 'ASC'] // Urutkan berdasarkan tanggal kadaluarsa untuk FEFO
            ]
        });

        return obat;
    } catch (error) {
        throw new Error(`Error saat mencari obat dengan metode FEFO: ${error.message}`);
    }
}

             


export const createPenjualan = async (req, res) => {
    const { jumlah, tanggal_transaksi, id_kategori } = req.body;

    try {
        // Cari obat berdasarkan kategori dengan metode FEFO
        const obat = await getObatFEFO(jumlah, id_kategori);

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
            id_obat: obat.id
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