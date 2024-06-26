import UserModel from '../models/UserModel.js';

export const verifyUser = async (req, res, next) => {
    if (!req.session.user_id) {
        return res.status(401).json({ message: "Mohon Login Ke Akun Anda!" });
    }
    const user = await UserModel.findOne({
        where: {
            id: req.session.user_id
        }
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });
    req.user_id = user.id;
    req.role = user.role;
    next();
}

export const adminOnly = async (req, res, next) => {
    const user = await UserModel.findOne({
        where: {
            id: req.session.user_id
        }
    });
    if (!user) return res.status(404).json({ message: "User tidak ditemukan!" });
    if (user.role !== "admin") return res.status(403).json({message: "Akses Hanya Admin!"});
    next();
}