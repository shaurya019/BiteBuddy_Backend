import { plainToClass } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { CreateCustomerInput, EditCustomerProfileInput, UserLoginInput } from '../dto/Customer.dto';
import { validate } from 'class-validator';
import { GeneratePassword, GenerateSalt, GenerateSignature, ValidatePassword } from '../utility';
import { Customer } from '../models/Customer';
import { GenerateOtp, onRequestOTP } from '../utility/NotificationUtility';

export const CustomerSignUp = async (req: Request, res: Response, next: NextFunction) => {

    const customerInput = plainToClass(CreateCustomerInput, req.body);
    const inputErrors = await validate(customerInput, { validationError: { target: true } });
    if (inputErrors.length > 0) {
        return res.status(400).json(inputErrors);
    }

    const { email, phone, password } = customerInput;
    const salt = await GenerateSalt();
    const userPassword = await GeneratePassword(password, salt);
    const { otp, expiry } = GenerateOtp();

    const existingCustomer = await Customer.find({ email: email });

    if (existingCustomer !== null) {
        return res.status(400).json({ message: 'Email already exist!' });
    }


    const result = await Customer.create({
        email: email,
        password: userPassword,
        salt: salt,
        phone: phone,
        otp: otp,
        otp_expiry: expiry,
        firstName: '',
        lastName: '',
        address: '',
        verified: false,
        lat: 0,
        lng: 0,
    });

    if (result) {
        await onRequestOTP(otp, phone);

        const signature = await GenerateSignature(
           { _id: result._id as string,
            email: result.email,
            verified: result.verified}
        )

        return res.status(201).json({signature, verified: result.verified, email: result.email})
    }

    return res.status(400).json({ msg: 'Error while creating user' });
}


export const CustomerLogin = async (req: Request, res: Response, next: NextFunction) => {
    const customerInputs = plainToClass(UserLoginInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { email, password } = customerInputs;
    const customer = await Customer.findOne({ email: email});
    if(customer){
        const validation = await ValidatePassword(password, customer.password, customer.salt);
        
        if(validation){

            const signature = GenerateSignature({
                _id: customer._id as string,
                email: customer.email,
                verified: customer.verified
            })

            return res.status(200).json({
                signature,
                email: customer.email,
                verified: customer.verified
            })
        }
    }

    return res.json({ msg: 'Error With Signup'});
}


export const CustomerVerify = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    const customer = req.user;
    if (customer) {
        const profile = await Customer.findById(customer._id);
        if (profile) {
            if (parseInt(otp) === profile.otp && profile.otp_expiry >= new Date()) {
                profile.verified = true;

                const updatedCustomerResponse = await profile.save();
                const signature = GenerateSignature({
                    _id: updatedCustomerResponse._id as string,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })

                return res.status(200).json({
                    signature,
                    email: updatedCustomerResponse.email,
                    verified: updatedCustomerResponse.verified
                })
            }
        }
    }
    return res.status(400).json({ msg: 'Unable to verify Customer'});
}

export const EditCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    const customerInputs = plainToClass(EditCustomerProfileInput, req.body);

    const validationError = await validate(customerInputs, {validationError: { target: true}})

    if(validationError.length > 0){
        return res.status(400).json(validationError);
    }

    const { firstName, lastName, address } = customerInputs;

    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
            profile.firstName = firstName;
            profile.lastName = lastName;
            profile.address = address;
            const result = await profile.save()
            
            return res.status(201).json(result);
        }

    }
    return res.status(400).json({ msg: 'Error while Updating Profile'});
}

export const GetCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;
 
    if(customer){
        
        const profile =  await Customer.findById(customer._id);
        
        if(profile){
             
            return res.status(201).json(profile);
        }

    }
    return res.status(400).json({ msg: 'Error while Fetching Profile'});
}

export const RequestOtp = async (req: Request, res: Response, next: NextFunction) => {
    const customer = req.user;

    if(customer){

        const profile = await Customer.findById(customer._id);

        if(profile){
            const { otp, expiry } = GenerateOtp();
            profile.otp = otp;
            profile.otp_expiry = expiry;

            await profile.save();
            const sendCode = await onRequestOTP(otp, profile.phone);

            if (!sendCode) {
                return res.status(400).json({ message: 'Failed to verify your phone number' })
            }

            return res.status(200).json({ message: 'OTP sent to your registered Mobile Number!'})

        }
    }

    return res.status(400).json({ msg: 'Error with Requesting OTP'});
}