import { Sequelize } from "sequelize";
import db from "../config/database";

//Model
import ObatModel from "./ObatModel";

const {DataTypes} = Sequelize;

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
            key: 'uuid'
        }
    },
} , {
    freezeTableName: true,
    timestamps: true
});

//Obat Foreign Key
ObatModel.hasMany(ObatModel, {
    foreignKey: 'id_obat',
});
ObatModel.belongsTo(ObatModel, {
    foreignKey: 'id_obat'
});

export default Penjualan;