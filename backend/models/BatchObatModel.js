import { Sequelize } from "sequelize";
import db from "../config/database";

//Model
import ObatModel from "./ObatModel";

const {DataTypes} = Sequelize;

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

export default BatchObat;