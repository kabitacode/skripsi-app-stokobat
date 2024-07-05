import PenjualanModel from '../models/PenjualanModel.js';
import ObatModel from '../models/ObatModel.js';
import { Sequelize, Op } from 'sequelize';
const getObatFEFO = async (jumlah, id_obat) => {
    try {
        console.log(`Mencari obat dengan id_obat: ${id_obat} dan jumlah: ${jumlah}`);
        const obat = await ObatModel.findOne({
            where: {
                id: id_obat,
                stok: {
                    [Op.gte]: jumlah
                },
                tanggal_kadaluarsa: {
                    [Op.gt]: new Date()
                }
            },
            order: [
                ['tanggal_kadaluarsa', 'ASC']
            ]
        });

        console.log(`Hasil pencarian obat: ${obat ? JSON.stringify(obat) : 'Tidak ditemukan'}`);
        return obat;
    } catch (error) {
        throw new Error(`Error in getObatFEFO: ${error.message}`);
    }
};

export const createPenjualan = async (req, res) => {
    const { jumlah, tanggal_transaksi, id_obat } = req.body;

    try {
        // Mendapatkan obat berdasarkan FEFO
        const obat = await getObatFEFO(jumlah, id_obat);
        if (!obat) {
            return res.status(404).json({ message: "Obat tidak ditemukan atau stok tidak mencukupi!" });
        }

        // Menghitung total harga
        const total_harga = obat.harga * jumlah;

        // Mengurangi stok obat
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

export const getPenjualanById = async (req, res) => {
    try {
        const penjualan = await PenjualanModel.findOne({
            where: {
                id: req.params.id
            },
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



export const updatePenjualan = async (req, res) => {
    try {
        const penjualan = await PenjualanModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!penjualan) return res.status(404).json({ message: "Penjualan tidak ditemukan!" });

        const { jumlah, tanggal_transaksi, id_obat } = req.body;

        // Mengembalikan stok obat sebelumnya
        const obatLama = await ObatModel.findOne({ where: { id: penjualan.id_obat } });
        obatLama.stok += penjualan.jumlah;
        await obatLama.save();

        // Mendapatkan obat baru berdasarkan FEFO
        const obatBaru = await getObatFEFO(jumlah, id_obat);
        if (!obatBaru) {
            return res.status(404).json({ message: "Obat tidak ditemukan atau stok tidak mencukupi!" });
        }

        // Menghitung total harga
        const total_harga = obatBaru.harga * jumlah;

        // Mengurangi stok obat baru
        obatBaru.stok -= jumlah;
        await obatBaru.save();

        await PenjualanModel.update({
            jumlah,
            total_harga,
            tanggal_transaksi,
            id_obat: obatBaru.id
        }, {
            where: {
                id: penjualan.id
            }
        });

        res.status(200).json({
            status: 200,
            message: "Penjualan berhasil diperbarui"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deletePenjualan = async (req, res) => {
    try {
        const penjualan = await PenjualanModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!penjualan) return res.status(404).json({ message: "Penjualan tidak ditemukan!" });

        // Mengembalikan stok obat
        const obat = await ObatModel.findOne({ where: { id: penjualan.id_obat } });
        obat.stok += penjualan.jumlah;
        await obat.save();

        await PenjualanModel.destroy({
            where: {
                id: penjualan.id
            }
        });

        res.status(200).json({
            status: 200,
            message: "Penjualan berhasil dihapus"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
