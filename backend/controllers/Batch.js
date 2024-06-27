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
        // Create batches in database
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
    const {status_kadaluarsa, jumlah, tanggal_kadaluarsa, tanggal_produksi, id_obat} = req.body;
    try {
        const user = await BatchObatModel.findOne({
            where: {
                id: req.params.id
            }
        });
        if (!user) return res.status(404).json({message: "Data tidak ditemukan!"});

        await BatchObatModel.update({
            status_kadaluarsa: status_kadaluarsa,
            jumlah: jumlah,
            tanggal_kadaluarsa: tanggal_kadaluarsa,
            tanggal_produksi: tanggal_produksi,
            id_obat: id_obat
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({
            status: 200,
            message: "Batch Obat updated successfully",
        }); 
    } catch (error) {
        res.status(500).json({message: error.message});
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

export const getBatchInfo = async (req, res) => {
    const { id_obat } = req.params;
    console.log(id_obat);
    try {
        const batchObats = await BatchObatModel.findAll({
            where: { id_obat: id_obat },
            include: {
                model: ObatModel,
                attributes: ['id', 'nama_obat', 'stok', 'harga', 'tanggal_kadaluarsa'],
            }
        });

        if (batchObats.length === 0) {
            return res.status(404).json({ message: 'Batch Obat tidak ditemukan untuk obat ini.' });
        }

        const responseData = batchObats.map(batchObat => ({
            id: batchObat.id,
            status_kadaluarsa: batchObat.tanggal_produksi > batchObat.Obat.tanggal_kadaluarsa ? 'Kadaluarsa' : 'Tidak Kadaluarsa',
            jumlah: batchObat.jumlah,
            tanggal_produksi: batchObat.tanggal_produksi,
            tanggal_kadaluarsa_obat: batchObat.Obat.tanggal_kadaluarsa,
            obat: {
                id: batchObat.Obat.id,
                nama_obat: batchObat.Obat.nama_obat,
                stok: batchObat.Obat.stok,
                harga: batchObat.Obat.harga,
                tanggal_kadaluarsa: batchObat.Obat.tanggal_kadaluarsa,
            }
        }));

        res.status(200).json(responseData);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}