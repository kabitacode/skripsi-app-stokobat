import { Sequelize } from "sequelize";

const db = new Sequelize('db_obat', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db