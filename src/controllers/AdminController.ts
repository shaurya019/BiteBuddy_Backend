import { Request, Response, NextFunction } from 'express'
import { CreateVandorInput } from '../dto/Vandor.dto'
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';

export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body as CreateVandorInput;

    const existingUser = await Vendor.findOne({ email: email });
    if (existingUser !== null) {
        return res.json({ "message": "A vendor is already there with is email id" })
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password,salt);
    const createVandor = await Vendor.create({
        name: name,
        ownerName: ownerName,
        foodType: foodType,
        pincode: pincode,
        address: address,
        phone: phone,
        email: email,
        password: userPassword,
        salt: salt,
        serviceAvailable: false,
        coverImages: [],
        rating: 0,
    });
    return res.json(createVandor);
}

export const GetVanndors = async (req: Request, res: Response, next: NextFunction) => {

}


export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {

}