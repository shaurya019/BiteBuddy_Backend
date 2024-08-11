import express, { Request, Response, NextFunction } from 'express';
import { CreateVandor,GetVanndors,GetVandorByID } from '../controllers';


const router = express.Router();

router.post("/vandor", CreateVandor);

router.get("/vandors", GetVanndors);

router.get("/vandor/:id", GetVandorByID);

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    res.json({ message: "HELLO From AdminRoute" });
});

export { router as AdminRoute };