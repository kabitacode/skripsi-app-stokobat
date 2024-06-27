import KategoriModel from '../models/KategoriModel.js';

export const getKategori = async (req, res) => {
    try {
        const response = await KategoriModel.findAll();
        res.status(200).json({
            status: 200,
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getKategoriById = async (req, res) => {
    try {
        const response = await KategoriModel.findOne({
            where: {
                id: req.params.id
            }
        })

        if (!response) return res.status(404).json({ message: "Data tidak ditemukan!" });
        res.status(200).json({
            status: 200,
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createKategori = async (req, res) => {
    try {
        const { nama } = req.body;
        await KategoriModel.create({
            nama: nama
        });
        res.status(201).json({
            status: 201,
            message: "Kategori created successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateKategori = async (req, res) => {
    const { nama } = req.body;
    try {
        const user = await KategoriModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) return res.status(404).json({ message: "User Tidak Ditemukan!" });
        await KategoriModel.update({
            nama: nama
        }, {
            where: {
                id: user.id
            }
        })
        res.status(200).json({
            status: 200,
            message: "Kategori updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteKategori = async (req, res) => {
    try {
        const user = await KategoriModel.findOne({
            where: {
                id: req.params.id
            }
        });

        if (!user) return res.status(404).json({ message: "User Tidak Ditemukan!" });
        await KategoriModel.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "Kategori deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}