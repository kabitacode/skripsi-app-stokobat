import { Op } from 'sequelize';
import BatchObatModel from '../models/BatchObatModel.js';
import ObatModel from '../models/ObatModel.js';

export const getBatch = async (req, res) => {
    try {
        const result = await BatchObatModel.findAll({
            include: ObatModel,
            order: [
                [{model: ObatModel, as: 'obat'},'tanggal_kadaluarsa', 'DESC']
            ]
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        });   
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const getBatchById = async (req, res) => {
    try {
        const result = await BatchObatModel.findOne({
            include: ObatModel,
            where: {
                id: req.params.id
            }
        });
        if (!result) return res.status(404).json({message: "User tidak ditemukan"});
        res.status(200).json({
            status: 200,
            message: "success",
            data: result
        });  
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

export const createBatch = async (req, res) => {
    const { id_obat, tanggal_produksi, status_kadaluarsa } = req.body;

    try {
        const obat = await ObatModel.findByPk(id_obat);
        if (!obat) {
            throw new Error(`Obat dengan id ${id_obat} tidak ditemukan.`);
        }

        const today = new Date().toISOString().split('T')[0]; 
        const status_kadaluarsa = obat.tanggal_kadaluarsa < today ? 'Kadaluarsa' : 'Tidak Kadaluarsa';

        const result = await BatchObatModel.create({
            id_obat: id_obat,
            tanggal_produksi: tanggal_produksi,
            status_kadaluarsa: status_kadaluarsa
        });

        res.status(201).json({
            status: 201,
            message: "Batch obat created successfully",
            data: result
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBatch = async (req, res) => {
    const { id_obat, tanggal_produksi } = req.body;

    try {

        const existingBatch = await BatchObatModel.findOne({
            where: {
                id: req.params.id,
                id_obat: id_obat
            }
        });

        if (!existingBatch) {
            throw new Error(`Batch obat dengan id ${req.params.id} dan id_obat ${id_obat} tidak ditemukan.`);
        }

        const obat = await ObatModel.findByPk(id_obat);
        if (!obat) {
            throw new Error(`Obat dengan id ${id_obat} tidak ditemukan.`);
        }

        const today = new Date().toISOString().split('T')[0]; 
        const status_kadaluarsa = obat.tanggal_kadaluarsa < today ? 'Kadaluarsa' : 'Tidak Kadaluarsa';
        
        await BatchObatModel.update({
            id_obat: id_obat,
            tanggal_produksi: tanggal_produksi,
            status_kadaluarsa: status_kadaluarsa
        }, {
            where: {
                id: req.params.id
            }
        })

        res.status(200).json({
            status: 200,
            message: "Batch obat updated successfully",
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteBatch = async (req, res) => {
    try {
        const user = await BatchObatModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });

        await BatchObatModel.destroy({
            where: {
                id: user.id
            }
        })
        res.status(200).json({
            status: 200,
            message: "Batch Obat deleted successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}