import { verify } from "./utlis";
import { Request, Response, NextFunction } from "express";

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token: any = req.headers['x-access-token'];

    if(!token) {
      return res.status(401).json({
        greet: "Hello Alien, You are not welcomed here today 👽"
      })
    }

    const tokenVerified = verify(token);

    if (!tokenVerified) {
      return res.status(401).json({
        greet: "Hello Alien, You are not welcomed here today 👽"
      })
    }

    next();
  } catch (e) {
    console.log('middleware-authenticate-error:', e);
    return res.status( 500).json({
      message: "Internal Server Error, contact admin"
    });
  }
};