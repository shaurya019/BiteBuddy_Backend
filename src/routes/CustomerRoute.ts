import express, { Request, Response, NextFunction } from 'express';
import { CustomerLogin, CustomerSignUp, CustomerVerify, EditCustomerProfile, GetCustomerProfile, RequestOtp } from '../controllers';
import { Authenticate } from '../middleware';
// import { Offer } from '../models/Offer';

const router = express.Router();


router.post('/signup', CustomerSignUp)


router.post('/login', CustomerLogin)


router.use(Authenticate);


router.patch('/verify', CustomerVerify)



router.get('/otp', RequestOtp)


router.get('/profile', GetCustomerProfile)
router.patch('/profile', EditCustomerProfile)