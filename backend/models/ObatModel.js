import { Sequelize } from "sequelize";
import db from "../config/database.js";
import Kategori from './KategoriModel.js';
import User from './UserModel.js';

const { DataTypes } = Sequelize;

const Obat = db.define('obat', {
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
    tanggal_kadaluarsa: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
            notEmpty: true,
        }
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
Kategori.hasMany(Obat, { foreignKey: 'id_kategori' });
Obat.belongsTo(Kategori, { foreignKey: 'id_kategori' });

User.hasMany(Obat, { foreignKey: 'user_id' });
Obat.belongsTo(User, { foreignKey: 'user_id' });

export default Obat;
