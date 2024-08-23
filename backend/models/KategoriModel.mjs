import { Sequelize } from "sequelize";
import db from "../config/database.mjs";

const {DataTypes} = Sequelize;

const KategoriModel = db.define('kategori', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    penerbit: {
        type: DataTypes.STRING,
        allowNull: false
    }
} , {
    freezeTableName: true,
    timestamps: true
});

export default KategoriModel;