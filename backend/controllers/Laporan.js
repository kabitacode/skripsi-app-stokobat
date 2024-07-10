import { Op } from 'sequelize';
import ObatModel from '../models/ObatModel.js';
import PenjualanModel from '../models/PenjualanModel.js';
import KategoriModel from '../models/KategoriModel.js';
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
            attributes: ['nama_obat', 'stok', 'tanggal_kadaluarsa'] // Ambil atribut tanggal_kadaluarsa
        });

        // Dapatkan obat yang mendekati kadaluarsa (dalam waktu 1 bulan)
        const mendekatiKadaluarsaObat = await ObatModel.findAll({
            where: {
                tanggal_kadaluarsa: {
                    [Op.between]: [today, oneMonthLater]
                }
            },
            attributes: ['nama_obat', 'stok', 'tanggal_kadaluarsa'] // Ambil atribut tanggal_kadaluarsa
        });

        // Membuat data untuk diekspor ke Excel
        const dataKadaluarsa = kadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Tanggal Kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0] // Pastikan tanggal_kadaluarsa diubah ke objek Date
        }));

        const dataMendekatiKadaluarsa = mendekatiKadaluarsaObat.map(obat => ({
            'Nama Obat': obat.nama_obat,
            'Stok': obat.stok,
            'Tanggal Kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0] // Pastikan tanggal_kadaluarsa diubah ke objek Date
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

export const getData = async (req, res) => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const oneMonthLater = new Date();
        oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

        // Dapatkan semua obat
        const allObat = await ObatModel.findAll({
            include: [
                {
                    model: KategoriModel
                }
            ]
        });

        // get all data penjualan with obat
        const dataPenjualanModel = await PenjualanModel.findAll({
            include: [
                {
                    model: ObatModel
                }
            ]
        });

        // Filter dan hitung obat yang sudah kadaluarsa dan mendekati kadaluarsa
        const kadaluarsaObat = allObat.filter(obat => new Date(obat.tanggal_kadaluarsa) < today);
        const mendekatiKadaluarsaObat = allObat.filter(obat => new Date(obat.tanggal_kadaluarsa) >= today && new Date(obat.tanggal_kadaluarsa) <= oneMonthLater);

        const dataKadaluarsa = kadaluarsaObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'harga': obat.harga,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const dataMendekatiKadaluarsa = mendekatiKadaluarsaObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'harga': obat.harga,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        // Menyiapkan data laporan lengkap
        const dataLaporan = allObat.map(obat => ({
            'nama_obat': obat.nama_obat,
            'stok': obat.stok,
            'kategori': obat.kategori.nama,
            'harga': obat.harga,
            'status_kadaluarsa': obat.status_kadaluarsa,
            'tanggal_kadaluarsa': new Date(obat.tanggal_kadaluarsa).toISOString().split('T')[0]
        }));

        const dataPenjualan = dataPenjualanModel.map(transaksi => ({
            'nama_obat': transaksi.obat.nama_obat,
            'stok': transaksi.obat.stok,
            'harga_obat': transaksi.obat.harga,
            'jumlah': transaksi.jumlah,
            'total_harga': transaksi.total_harga,
            'tanggal_transaksi': new Date(transaksi.tanggal_transaksi).toISOString().split('T')[0]
        }))

        res.status(200).json({
            status: 200,
            message: "success",
            data: {
                kadaluarsa: dataKadaluarsa,
                mendekatiKadaluarsa: dataMendekatiKadaluarsa,
                laporan: dataLaporan,
                penjualan: dataPenjualan
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
