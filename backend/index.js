import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
// import db from './config/database.js';
import UserRoute from './routes/UserRoute.js';
import ObatRoute from './routes/ObatRoute.js';
import AuthRoute from './routes/AuthRoute.js';

dotenv.config();

const app = express();

// (async () => {
//     try {
//         await db.authenticate();
//         console.log('Database connection has been established successfully.');
        
//         // Sinkronkan semua model
//         await db.sync({ force: true }); // Gunakan { force: true } hanya saat pengembangan
//         console.log('All models were synchronized successfully.');

       
//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: 'auto'
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}));

app.use(express.json());
app.use(UserRoute);
app.use(ObatRoute);
app.use(AuthRoute);

app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});