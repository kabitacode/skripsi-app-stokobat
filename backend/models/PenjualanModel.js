import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ObatModel from "./ObatModel.js";  

const { DataTypes } = Sequelize;

const PenjualanModel = db.define('transaksi_penjualan', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    jumlah: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    total_harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    tanggal_transaksi: {
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
ObatModel.hasMany(PenjualanModel, { foreignKey: 'id_obat' });
PenjualanModel.belongsTo(ObatModel, { foreignKey: 'id_obat' });

export default PenjualanModel;
