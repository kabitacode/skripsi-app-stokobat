import { Op } from 'sequelize';
import KategoriModel from '../models/KategoriModel.mjs';
import ObatModel from '../models/ObatModel.mjs';
import UserModel from '../models/UserModel.mjs';

export const getObat = async (req, res) => {
    try {
        const result = await ObatModel.findAll({
            include: [
                { model: KategoriModel },
                { model: UserModel, attributes: ['id', 'name', 'email', 'role'] }
            ],
            order: [
                ['tanggal_kadaluarsa', 'ASC']
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
                { model: KategoriModel },
                { model: UserModel, attributes: ['id', 'name', 'email', 'role'] }
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
    const { nama_obat, stok, harga, tanggal_kadaluarsa, id_kategori } = req.body;
    const user_id = req.userId;
    try {
        const today = new Date().toISOString().split('T')[0];
        let status_kadaluarsa = 'Tidak Kadaluarsa';
        if (tanggal_kadaluarsa < today) {
            status_kadaluarsa = 'Kadaluarsa';
        }

        const result = await ObatModel.create({
            nama_obat,
            stok,
            harga,
            tanggal_kadaluarsa,
            status_kadaluarsa,
            id_kategori,
            user_id
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
    const { nama_obat, stok, harga, tanggal_kadaluarsa, id_kategori } = req.body;
    const user_id = req.userId;
    try {
        const today = new Date().toISOString().split('T')[0];
        let status_kadaluarsa = 'Tidak Kadaluarsa';
        if (tanggal_kadaluarsa < today) {
            status_kadaluarsa = 'Kadaluarsa';
        }

        const user = await ObatModel.findOne({
            where: {
                id: req.params.id
            }
        })
        if (!user) return res.status(404).json({ message: "Data tidak ditemukan!" });

        await ObatModel.update({
            nama_obat: nama_obat,
            stok: stok,
            harga: harga,
            tanggal_kadaluarsa: tanggal_kadaluarsa,
            status_kadaluarsa,
            id_kategori: id_kategori,
            user_id: user_id
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({
            status: 200,
            message: "Obat updated successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteObat = async (req, res) => {
    try {
        const user = await ObatModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

        await ObatModel.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({
            status: 200,
            message: "Obat deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const searchObat = async (req, res) => {
    const { nama_obat } = req.query;
    try {
        const result = await ObatModel.findAll({
            where: {
                nama_obat: {
                    [Op.iLike]: `%${nama_obat}%`
                }
            }
        });
        if (result.length > 0) {
            res.status(200).json({
                status: 200,
                message: "success",
                data: result
            });
        } else {
            res.status(404).json({ message: "Obat tidak ditemukan" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateKadaluarsa = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Mencari obat yang tanggal kadaluarsanya telah terlewat hari ini
        const obat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.lt]: today
                },
                status_kadaluarsa: {
                    [Op.ne]: "Kadaluarsa"
                }
            }
        });

        if (obat.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "Tidak ada obat yang perlu diperbarui."
            });
        }

        // Memperbarui status kadaluarsa
        for (let i of obat) {
            i.status_kadaluarsa = "Kadaluarsa";
            await i.save();
        }

        res.status(200).json({
            status: 200,
            message: "Data Obat berhasil diperbarui!",
            data: obat
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getFilteredObatByStatus = async (req, res) => {
    try {
        const { status_kadaluarsa } = req.query;

        // Buat objek where untuk menampung kondisi filter
        const whereCondition = {};

    
        if (status_kadaluarsa) {
            whereCondition.status_kadaluarsa = status_kadaluarsa;
        }

        // Query untuk mendapatkan data obat berdasarkan kondisi filter
        const filteredObat = await ObatModel.findAll({
            include: [
                {model: KategoriModel},
                {model: UserModel}
            ],
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

export const getFilteredObat = async (req, res) => {
    try {
        const { start_date, end_date } = req.query;

        // Buat objek where untuk menampung kondisi filter
        const whereCondition = {};

        if (start_date && end_date) {
            whereCondition.tanggal_kadaluarsa = {
                [Op.between]: [new Date(start_date), new Date(end_date)]
            };
        }

        // Query untuk mendapatkan data obat berdasarkan kondisi filter
        const filteredObat = await ObatModel.findAll({
            include: [
                {model: KategoriModel},
                {model: UserModel}
            ],
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


export const getObatByStokAndKadaluarsa = async (req, res) => {
    try {
        const { min_stok, stok_habis, mendekati_kadaluarsa } = req.query;

        // Buat objek where untuk menampung kondisi filter
        const whereCondition = {};

        // Filter berdasarkan minimum stok
        if (min_stok) {
            whereCondition.stok = {
                [Op.lte]: parseInt(min_stok)
            };
        }

        // Filter untuk stok yang sudah habis
        if (stok_habis === 'true') {
            whereCondition.stok = 0;
        }

        // Filter untuk obat yang mendekati kadaluarsa (dalam 1 bulan ke depan)
        if (mendekati_kadaluarsa === 'true') {
            const today = new Date();
            const oneMonthLater = new Date();
            oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

            whereCondition.tanggal_kadaluarsa = {
                [Op.between]: [today, oneMonthLater]
            };
        }

        // Query untuk mendapatkan data obat berdasarkan kondisi filter
        const filteredObat = await ObatModel.findAll({
            include: [
                {model: KategoriModel},
                {model: UserModel}
            ],
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
