import { Op } from 'sequelize';
import BatchObatModel from '../models/BatchObatModel.js';
import ObatModel from '../models/ObatModel.js';

export const getBatch = async (req, res) => {
    try {
        const result = await BatchObatModel.findAll({
            include: ObatModel
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
    const { batches } = req.body;

    try {
        const results = await Promise.all(batches.map(async batch => {
            const obat = await ObatModel.findByPk(batch.id_obat);
            if (!obat) {
                throw new Error(`Obat dengan id ${batch.id_obat} tidak ditemukan.`);
            }

            const status_kadaluarsa = batch.tanggal_produksi > obat.tanggal_kadaluarsa ? 'Kadaluarsa' : 'Tidak Kadaluarsa';

            const createdBatch = await BatchObatModel.create({
                id_obat: batch.id_obat,
                tanggal_produksi: batch.tanggal_produksi,
                status_kadaluarsa: status_kadaluarsa
            });

            return createdBatch;
        }));

        res.status(201).json({
            status: 201,
            message: "Batch obat created successfully",
            data: results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateBatch = async (req, res) => {
    const { batches } = req.body;

    try {

        const result = await Promise.all(batches.map(async batch => {
            const existingBatch = await BatchObatModel.findOne({
                where: {
                    id: batch.id,
                    id_obat: batch.id_obat
                }
            });

            if (!existingBatch) {
                throw new Error(`Batch obat dengan id ${batch.id} dan id_obat ${batch.id_obat} tidak ditemukan.`);
            }

            const obat = await ObatModel.findByPk(batch.id_obat);
            if (!obat) {
                throw new Error(`Obat dengan id ${batch.id_obat} tidak ditemukan.`);
            }

            const status_kadaluarsa = batch.tanggal_produksi > obat.tanggal_kadaluarsa ? 'Kadaluarsa' : 'Tidak Kadaluarsa';

            // Update batch data
            existingBatch.tanggal_produksi = batch.tanggal_produksi;
            existingBatch.status_kadaluarsa = status_kadaluarsa;

            await existingBatch.save();

            return existingBatch;
        }));

        res.status(200).json({
            status: 200,
            message: "Batch obat updated successfully",
            data: result
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