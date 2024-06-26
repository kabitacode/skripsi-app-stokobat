import UserModel from '../models/UserModel.js';
import argon2 from 'argon2';

export const logIn = async (req, res) => {
    const user = await UserModel.findOne({
        where: {
            email: req.body.email
        }
    });

    if (!user) return res.status(404).json({ message: "User Tidak Ditemukan!" });
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
        return res.status(400).json({ message: "Password Salah!" });
    }
    req.session.user_id = user.id;
    console.log('Session after login:', req.session);

    const id = user.id;
    const name = user.name;
    const email = user.email;
    const role = user.role;

    res.status(200).json({ id, name, email, role });
}

export const Me = async (req, res) => {
    console.log('session:',req.session);
    if (!req.session.user_id) {
        return res.status(401).json({ message: "Mohon Login Ke Akun Anda!" });
    }
    const user = await UserModel.findOne({
        attributes: ['id', 'name', 'email', 'role'],
        where: {
            id: req.session.user_id
        }
    });
    console.log('user:', user);
    if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });
    res.status(200).json(user);
}

export const logOut = async (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(400).json({ message: "Tidak dapa logout!" })
        res.status(200).json({ message: "Logout Berhasil!" })
    })
}
