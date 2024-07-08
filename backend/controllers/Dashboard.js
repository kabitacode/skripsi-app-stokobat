import ObatModel from "../models/ObatModel.js";

export const getData = async (req, res) => {
    try {
        // Mendapatkan semua obat
        const allObat = await ObatModel.findAll();

        // Menghitung total stok, obat kedaluwarsa, dan obat mendekati kedaluwarsa
        let totalStok = 0;
        let totalKadaluarsa = 0;
        let totalMendekatiKadaluarsa = 0;

        const currentDate = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        allObat.forEach(obat => {
            totalStok += obat.stok;
            if (new Date(obat.tanggal_kadaluarsa) < currentDate) {
                totalKadaluarsa++;
            } else if (new Date(obat.tanggal_kadaluarsa) <= oneMonthLater) {
                totalMendekatiKadaluarsa++;
            }
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
