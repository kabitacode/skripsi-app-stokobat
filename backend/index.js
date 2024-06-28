import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';
import SequelizeStore from 'connect-session-sequelize';
import db from './config/database.js';

//Route
import UserRoute from './routes/UserRoute.js';
import ObatRoute from './routes/ObatRoute.js';
import AuthRoute from './routes/AuthRoute.js';
import KategoriRoute from './routes/KategoriRoute.js';
import BatchRoute from './routes/BatchRoute.js';


dotenv.config();

const app = express();

const sessionStore = SequelizeStore(session.Store);

const store = new sessionStore({
    db: db
});

// (async () => {
//     try {
//         // Sinkronkan semua model
//         await db.sync(); // Gunakan { force: true } hanya saat pengembangan
//         console.log('All models were synchronized successfully.');   

//     } catch (error) {
//         console.error('Unable to connect to the database:', error);
//     }
// })();

app.use(session({
    secret: process.env.SESS_SECRET,
    resave: false,
    saveUninitialized: true,
    store: store,
    cookie: {
        secure: 'auto',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 1 day
    }
}));

app.use(cors({
    credentials: true,
    origin: 'http://localhost:3001'
}));
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(AuthRoute);
app.use(UserRoute);
app.use(ObatRoute);
app.use(KategoriRoute);
app.use(BatchRoute);

store.sync();

app.listen(process.env.APP_PORT, () => {
    console.log(`Server running on port ${process.env.APP_PORT}`);
});