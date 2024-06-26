import { Sequelize } from "sequelize";
import db from "../config/database.js";
import ObatModel from "./ObatModel.js";

const { DataTypes } = Sequelize;

const Penjualan = db.define('transaksi_penjualan', {
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
        },
          onDelete: 'CASCADE', // Aksi CASCADE saat menghapus Obat akan menghapus semua Penjualan terkait
        onUpdate: 'CASCADE'
    },
}, {
    freezeTableName: true,
    timestamps: true
});

// Relasi dengan Obat
ObatModel.hasMany(Penjualan, { foreignKey: 'id_obat', onDelete: 'CASCADE', onUpdate: 'CASCADE' });
Penjualan.belongsTo(ObatModel, { foreignKey: 'id_obat', onDelete: 'CASCADE', onUpdate: 'CASCADE' });

export default Penjualan;
