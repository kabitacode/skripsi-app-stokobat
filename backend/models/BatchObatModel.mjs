import { Sequelize } from "sequelize";
import db from "../config/database.mjs";
import ObatModel from "./ObatModel.mjs";  

const { DataTypes } = Sequelize;

const BatchObatModel = db.define('batch_obat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    status_kadaluarsa: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    tanggal_produksi: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    id_obat: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'obat',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: true,
});

BatchObatModel.beforeSave(async (batchObat, options) => {
    const obat = await ObatModel.findByPk(batchObat.id_obat);
    if (!obat) {
        throw new Error('Obat tidak ditemukan.');
    }

    // Bandingkan tanggal_produksi batch dengan tanggal_kadaluarsa obat
    if (batchObat.tanggal_produksi > obat.tanggal_kadaluarsa) {
        batchObat.status_kadaluarsa = 'Kadaluarsa';
    } else {
        batchObat.status_kadaluarsa = 'Tidak Kadaluarsa';
    }
});

// Relasi dengan Obat
ObatModel.hasMany(BatchObatModel, { foreignKey: 'id_obat' });
BatchObatModel.belongsTo(ObatModel, { foreignKey: 'id_obat' });

export default BatchObatModel;
