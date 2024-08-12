import { Request, Response, NextFunction } from 'express';
import { EditVendorInput, VendorLoginInput } from '../dto'
import { FindVendor } from './AdminController';
import { GenerateSignature, ValidatePassword } from '../utility/PasswordUnility';

export const VendorLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body as VendorLoginInput;

    const existingUser = await FindVendor('', email);
    if (existingUser !== null) {
        const validation = await ValidatePassword(password, existingUser.password, existingUser.salt);
        if (validation !== null) {
            const signature = await GenerateSignature({
                _id: existingUser._id as string,
                email: existingUser.email,
                name: existingUser.name
            })
            return res.json(existingUser);
        }
    }

    return res.json({ 'message': 'Login credential is not valid' })
}

export const GetVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    if (user) {
        const existingVendor = await FindVendor(user._id);
        return res.json(existingVendor);
    }

    return res.json({ 'message': 'vendor Information Not Found' })
}

export const UpdateVendorProfile = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    const { foodType, name, address, phone } = req.body as EditVendorInput;

    if (user) {
        const existingVendor = await FindVendor(user._id);

        if (existingVendor !== null) {
            existingVendor.name = name;
            existingVendor.address = address;
            existingVendor.phone = phone;
            existingVendor.foodType = foodType;

            const saveResult = await existingVendor.save();

            return res.json(saveResult);
        }
    }

    return res.json({ 'message': 'vendor Information Not Found' })

}

export const UpdateVendorService = async (req: Request, res: Response, next: NextFunction) => {

}