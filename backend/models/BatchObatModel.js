import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Obat from "./ObatModel";  

const { DataTypes } = Sequelize;

const BatchObat = db.define('batch_obat', {
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
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    tanggal_kadaluarsa: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
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
    timestamps: true
});

// Relasi dengan Obat
Obat.hasMany(BatchObat, { foreignKey: 'id_obat' });
BatchObat.belongsTo(Obat, { foreignKey: 'id_obat' });

export default BatchObat;
