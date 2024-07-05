import ObatModel from "../models/ObatModel.js";


export const getData = async (req, res) => {
    try {
        const obat = await ObatModel.findByPk(req.userId);
        let stok = obat

        console.log("result =>>", stok);
    } catch (error) {
        
    }
}