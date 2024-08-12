import express, { Request, Response, NextFunction } from 'express';
import { UpdateVendorProfile,UpdateVendorService,VendorLogin } from '../controllers/VendorController';
import { Authenticate } from '../middleware/CommonAuth';


const router = express.Router();

router.get('/login', VendorLogin);

router.use(Authenticate);
router.get('/profile', VendorLogin);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({message:"HELLO From VandorRoute"}); 
});

export { router as VandorRoute };