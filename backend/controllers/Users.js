import User from '../models/UserModel.js';
import argon2 from 'argon2'

export const getUser = async (req, res) => {
    try {
        const response = await User.findAll();
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await User.findOne({
            where: {
                id: req.params.id
            }
        });
        res.status(200).json(response);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({ message: "Password dan Confirm Password tidak sama!" });
    }

    const hasPassword = await argon2.hash(password);
    try {
        await User.create({
            name: name,
            email: email,
            password: hasPassword,
            role: role
        });
        res.status(200).json({ message: "Success" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const updateUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!user) return res.status(404).json({message: "User Tidak Ditemukan!"});
    const { name, email, password, confPassword, role } = req.body;
    let hashPassword;
    if (password === "" || password === null) {
        hashPassword = user.password;
    }else{
        hashPassword = await argon2.hash(password);
    }

    if (password !== confPassword) {
        return res.status(400).json({ message: "Password dan Confirm Password tidak sama!" });
    }

    try {
        await User.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "Success Updated" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async(req, res) => {
    const user = await User.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!user) return res.status(404).json({message: "User Tidak Ditemukan!"});
  
    try {
        await User.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({ message: "Success Deleted" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}