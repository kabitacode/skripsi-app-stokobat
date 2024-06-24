import User from '../models/UserModel';
import argon2 from 'argon2';


export const Login = async(req, res) => {
    const user = await User.findOne({
        where: {
            email: req.body.email
        }
    });

    if(!user) return res.status(404).json({message: "User Tidak Ditemukan!"});
    const match = await argon2.verify(user.password, req.body.password);
    if (!match) {
        return res.status(400).json({message: "Password Salah!"});
    }
    req.session.userId = user.id;
    const id = user.id;
    const name = user.name;
    const email = user.email;
    const role  = user.role;

    res.status(200).json({id, name, email, role});
}