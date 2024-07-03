import UserModel from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const blacklistedTokens = new Set();

export const logIn = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            where: {
                email: req.body.email
            }
        });

        if (!user) return res.status(404).json({ message: "User Tidak Ditemukan!" });
        if (user.password !== req.body.password) {
            return res.status(400).json({ message: "Password Salah!" });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.SESS_SECRET, { expiresIn: '7d' })

        const id = user.id;
        const name = user.name;
        const email = user.email;
        const role = user.role;

        res.status(200).json({ id, name, email, role, token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const Me = async (req, res) => {
    try {
        const user = await UserModel.findOne({
            attributes: ['id', 'name', 'email', 'role'],
            where: {
                id: req.userId
            }
        });
        if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

export const logOut = async (req, res) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            blacklistedTokens.add(token);
        }

        res.status(200).json({ message: "Logout Berhasil!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
