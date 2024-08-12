import { Request, Response, NextFunction } from 'express'
import { CreateVandorInput } from '../dto/Vandor.dto'
import { Vendor } from '../models';
import { GeneratePassword, GenerateSalt } from '../utility';


export const FindVendor = async (id: String | undefined, email?: string) => {

    if (email) {
        return await Vendor.findOne({ email: email })
    } else {
        return await Vendor.findById(id);
    }

}


export const CreateVandor = async (req: Request, res: Response, next: NextFunction) => {
    const { name, ownerName, foodType, pincode, address, phone, email, password } = req.body as CreateVandorInput;

    const existingVandor = await FindVendor('', email);

    if (existingVandor !== null) {
        return res.json({ "message": "A vendor is already there with is email id" })
    }

    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
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
    const vendors = await Vendor.find();

    if (vendors !== null) {
        return res.json(vendors);
    }

    return res.json({ "message": "Vendors are not availiable" });
}


export const GetVandorByID = async (req: Request, res: Response, next: NextFunction) => {
    const vendorId = req.params.id;

    if (vendorId === null) {
        return res.json({ "message": "Invaild ID" });
    }

    const vendor = await FindVendor(vendorId);

    if (vendor !== null) {
        return res.json(vendor);
    }

    return res.json({ "message": "Vendors are not availiable" });
}