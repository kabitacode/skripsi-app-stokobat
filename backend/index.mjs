import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/database.mjs';
import bodyParser from 'body-parser';

//Route
import UserRoute from './routes/UserRoute.mjs';
import ObatRoute from './routes/ObatRoute.mjs';
import AuthRoute from './routes/AuthRoute.mjs';
import KategoriRoute from './routes/KategoriRoute.mjs';
import BatchRoute from './routes/BatchRoute.mjs';
import PenjualanRoute from './routes/PenjualanRoute.mjs';
import DashboardRoute from './routes/DashboardRoute.mjs';
import LaporanRoute from './routes/LaporanRoute.mjs';
import FefoRoute from './routes/FefoRoute.mjs';



dotenv.config();

const app = express();


// (async () => {
//     try {
//         // Sinkronkan semua model
//         await db.sync(); // Gunakan { force: true } hanya saat pengembangan
//         console.log('All models were synchronized successfully.');   

//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();


app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(bodyParser.json());

app.use(AuthRoute);
app.use(UserRoute);
app.use(ObatRoute);
app.use(KategoriRoute);
app.use(BatchRoute);
app.use(PenjualanRoute);
app.use(DashboardRoute);
app.use(LaporanRoute);
app.use(FefoRoute);



app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});