import { Sequelize } from "sequelize";
import db from "../config/database";

//Model
import KategoriModel from './KategoriModel';
import UserModel from './UserModel';

const {DataTypes} = Sequelize;

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
            model: 'users', // 'users' refers to table name
            key: 'uuid' // 'users' refers to table name
        }
    },
    id_kategori: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'kategori', // 'kategori' refers to table name
          key: 'uuid' // 'uuid' refers to column name in kategori table
        }
    },
} , {
    freezeTableName: true,
    timestamps: true
});

//Kategori Foreign Key
KategoriModel.hasMany(Obat, {
    foreignKey: 'id_kategori',
});
Obat.belongsTo(KategoriModel, {
    foreignKey: 'id_kategori'
});

//User Foreign Key
UserModel.hasMany(Obat, {
    foreignKey: 'user_id'
});
Obat.belongsTo(UserModel, {
    foreignKey: 'user_id'
});

export default Obat;