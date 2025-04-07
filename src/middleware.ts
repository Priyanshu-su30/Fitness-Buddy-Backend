import jwt, { JwtPayload } from "jsonwebtoken"
import { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();

declare global{
    namespace Express{
        interface Request{
            userId?: string;
        }
    }
}

export const userMiddleware = (req: Request, res: Response, next: NextFunction) =>{
    const token = req.headers["authorization"]
    const decodedToken = jwt.verify(token as string, process.env.JWTPASS as string) as JwtPayload

    if(decodedToken){
        req.userId = decodedToken.ID;
        next();
    }else{
        res.status(403).json({
            warning: "You are not logged in"
        })
    }
}