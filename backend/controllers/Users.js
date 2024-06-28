import UserModel from '../models/UserModel.js';
import argon2 from 'argon2'

export const getUser = async (req, res) => {
    try {
        const response = await UserModel.findAll({
            attributes: ['id', 'name', 'email', 'role']
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUserById = async (req, res) => {
    try {
        const response = await UserModel.findOne({
            attributes: ['id', 'name', 'email', 'role'],
            where: {
                id: req.params.id
            }
        });
        res.status(200).json({
            status: 200,
            message: "success",
            data: response
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    const { name, email, password, confPassword, role } = req.body;
    if (password !== confPassword) {
        return res.status(400).json({ message: "Password dan Confirm Password tidak sama!" });
    }

    const hasPassword = await argon2.hash(password);
    try {
        await UserModel.create({
            name: name,
            email: email,
            password: hasPassword,
            role: role
        });
        res.status(200).json({
            status: 200,
            message: "User created successfully"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const updateUser = async(req, res) => {
    const user = await UserModel.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!user) return res.status(404).json({message: "Data Tidak Ditemukan!"});
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
        await UserModel.update({
            name: name,
            email: email,
            password: hashPassword,
            role: role
        }, {
            where: {
                id: user.id
            }
        });
        res.status(200).json({
            status: 200,
            message: "User updated successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}

export const deleteUser = async(req, res) => {
    const user = await UserModel.findOne({
        where: {
            id: req.params.id
        }
    });

    if(!user) return res.status(404).json({message: "User Tidak Ditemukan!"});
  
    try {
        await UserModel.destroy({
            where: {
                id: user.id
            }
        });
        res.status(200).json({
            status: 200,
            message: "User deleted successfully"
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}