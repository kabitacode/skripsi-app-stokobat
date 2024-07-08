import { Op } from 'sequelize';
import ObatModel from '../models/ObatModel.js';
import xlsx from 'xlsx';

export const getLaporan = async (req, res) => {
    try {
        const today = new Date();
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        // Dapatkan obat yang sudah kadaluarsa
        const kadaluarsaObat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.lt]: today
                }
            },
            attributes: ['nama_obat', 'stok', 'tanggal_kadaluarsa']
        });

        // Dapatkan obat yang mendekati kadaluarsa (dalam waktu 1 bulan)
        const mendekatiKadaluarsaObat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.between]: [today, oneMonthLater]
                }
            },
            attributes: ['nama_obat', 'stok', 'tanggal_kadaluarsa']
        });

        // Membuat data untuk diekspor ke Excel
        const dataKadaluarsa = kadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Tanggal Kadaluarsa': obat.tanggal_kadaluarsa.toISOString().split('T')[0]
        }));

        const dataMendekatiKadaluarsa = mendekatiKadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Tanggal Kadaluarsa': obat.tanggal_kadaluarsa.toISOString().split('T')[0]
        }));

        const wb = xlsx.utils.book_new();

        const wsKadaluarsa = xlsx.utils.json_to_sheet(dataKadaluarsa);
        xlsx.utils.book_append_sheet(wb, wsKadaluarsa, 'Obat Kadaluarsa');

        const wsMendekatiKadaluarsa = xlsx.utils.json_to_sheet(dataMendekatiKadaluarsa);
        xlsx.utils.book_append_sheet(wb, wsMendekatiKadaluarsa, 'Obat Mendekati Kadaluarsa');

        const buffer = xlsx.write(wb, { bookType: 'xlsx', type: 'buffer' });

        res.setHeader('Content-Disposition', 'attachment; filename=laporan_obat.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export default router;
