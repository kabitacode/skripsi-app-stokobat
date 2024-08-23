import { Sequelize } from "sequelize";
import db from "../config/database.mjs";
import KategoriModel from './KategoriModel.mjs';
import UserModel from './UserModel.mjs';

const { DataTypes } = Sequelize;

const ObatModel = db.define('obat', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama_obat: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    stok: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    harga: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    harga_beli: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    tanggal_kadaluarsa: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    status_kadaluarsa: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kategori',
            key: 'id'
        }
    },
}, {
    freezeTableName: true,
    timestamps: true
});

// Relasi dengan Kategori dan User
KategoriModel.hasMany(ObatModel, { foreignKey: 'id_kategori' });
ObatModel.belongsTo(KategoriModel, { foreignKey: 'id_kategori' });

UserModel.hasMany(ObatModel, { foreignKey: 'user_id' });
ObatModel.belongsTo(UserModel, { foreignKey: 'user_id' });

export default ObatModel;
