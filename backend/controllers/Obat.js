import KategoriModel from '../models/KategoriModel.js';
import ObatModel from '../models/ObatModel.js';
import UserModel from '../models/UserModel.js';

export const getObat = async (req, res) => {
    try {
        const result = await ObatModel.findAll({
            include: [
                {model: KategoriModel},
                {model: UserModel, attributes: ['id', 'name', 'email', 'role']}
            ]
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getObatById = async (req, res) => {
    try {
        const result = await ObatModel.findOne({
            where: {
                id: req.params.id
            },
            include: [
                {model: KategoriModel},
                {model: UserModel, attributes: ['id', 'name', 'email', 'role']}
            ]
        });
        if (!result) return res.status(404).json({ message: "Data tidak ditemukan!" });
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createObat = async (req, res) => {
    const { nama_obat, stok, harga, tanggal_kadaluarsa, id_kategori} = req.body;
    const user_id = req.user_id;
    try {
        const result = await ObatModel.create({
            nama_obat: nama_obat,
            stok: stok,
            harga: harga,
            tanggal_kadaluarsa: tanggal_kadaluarsa,
            id_kategori: id_kategori,
            user_id: user_id
        });
        res.status(201).json({
            status: 201,
            message: "Obat created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateObat = async (req, res) => {
    const { nama_obat, stok, harga, tanggal_kadaluarsa, id_kategori} = req.body;
    const user_id = req.user_id;
    try {
        const result = await ObatModel.create({
            nama_obat: nama_obat,
            stok: stok,
            harga: harga,
            tanggal_kadaluarsa: tanggal_kadaluarsa,
            id_kategori: id_kategori,
            user_id: user_id
        });
        res.status(201).json({
            status: 201,
            message: "Obat created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteObat = (req, res) => {

}