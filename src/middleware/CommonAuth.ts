import { Request, NextFunction, Response } from 'express'
import { AuthPayload } from '../dto/Auth.dto';
import { ValidateSignature } from '../utility';

declare module 'express-serve-static-core' {
    interface Request {
        user?: AuthPayload;
    }
}

export const Authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const signature = await ValidateSignature(req);
    if (signature) {
        return next();
    } else {
        return res.json({ message: "User Not authorized" });
    }
}