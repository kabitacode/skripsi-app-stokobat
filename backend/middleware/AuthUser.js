import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
const blacklistedTokens = new Set();

export const verifyUser = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        if (!authHeader) {
            return res.status(401).json({ message: "Mohon login ke akun Anda!" });
        }

        const token = authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "Mohon login ke akun Anda!" });


        if (blacklistedTokens.has(token)) {
            return res.status(403).json({ message: "Token telah di-logout!" });
        }

        jwt.verify(token, process.env.SESS_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Token tidak valid!" });
            }

            req.userId = decoded.id;
            req.role = decoded.role;
            req.token = token;
            next();
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const adminOnly = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({
            where: {
                id: req.userId
            }
        });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });
        if (user.role !== "admin") return res.status(403).json({ message: "Akses Hanya Admin!" });
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}