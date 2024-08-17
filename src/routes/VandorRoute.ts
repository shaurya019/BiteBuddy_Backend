import express, { Request, Response, NextFunction } from 'express';
import { AddFood,GetFoods,UpdateVendorProfile,UpdateVendorService,VendorLogin,GetCurrentOrders ,ProcessOrder, GetOrderDetails} from '../controllers/VendorController';
import { Authenticate } from '../middleware/CommonAuth';
import multer from 'multer';

const router = express.Router();

const imageStorage = multer.diskStorage({
    destination: function(req,file, cb){
        cb(null, 'images')
    },
    filename: function(req,file,cb){
        cb(null, new Date().toISOString()+'_'+file.originalname);
    }
})

const images = multer({ storage: imageStorage }).array('images', 10);


router.get('/login', VendorLogin);

router.use(Authenticate);
router.get('/profile', VendorLogin);
router.patch('/profile', UpdateVendorProfile);
router.patch('/service', UpdateVendorService);

router.post('/food',images,AddFood);
router.get('/food', GetFoods)

router.get('/orders', GetCurrentOrders);
router.put('/order/:id/process', ProcessOrder);
router.get('/order/:id', GetOrderDetails)


router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({message:"HELLO From VandorRoute"}); 
});

export { router as VandorRoute };