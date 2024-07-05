import ObatModel from "../models/ObatModel.js";
import BatchObatModel from "../models/BatchObatModel.js";
import { Op } from 'sequelize';

export const getData = async (req, res) => {
    try {
        // Mendapatkan semua obat
        const allObat = await ObatModel.findAll({
            include: [{
                model: BatchObatModel
            }]
        });

        // Menghitung total stok, obat kedaluwarsa, dan obat mendekati kedaluwarsa
        let totalStok = 0;
        let totalKadaluarsa = 0;
        let totalMendekatiKadaluarsa = 0;

        const currentDate = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        allObat.forEach(obat => {
            totalStok += obat.stok;
            obat.batch_obats.forEach(batch => {
                if (batch.tanggal_produksi > obat.tanggal_kadaluarsa) {
                    totalKadaluarsa++;
                } else if (batch.tanggal_produksi <= oneMonthLater && batch.tanggal_produksi >= currentDate) {
                    totalMendekatiKadaluarsa++;
                }
            });
        });

        res.status(200).json({
            status: 200,
            message: "success",
            data: {
                totalStok,
                totalKadaluarsa,
                totalMendekatiKadaluarsa
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
