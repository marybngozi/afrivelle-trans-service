import { Request } from "express";
import jwt from "jsonwebtoken";
import moment from 'moment';

const appUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

const SECRET_KEY = process.env.SECRET_KEY || "earth is good";
const TOKEN_VALIDITY = process.env.TOKEN_VALIDITY || 10;

const sign = () => {
    const expiryDate = moment()
        .add(TOKEN_VALIDITY, 'days')
        .toDate();

    const epochExpiryDate = Math.round(expiryDate.getTime() / 1000);

    const token = jwt.sign({
        sub: "Human",
        exp: epochExpiryDate,
    }, SECRET_KEY);

    return {
        token,
        expiresIn: moment(epochExpiryDate*1000).from(new Date()),
    };
};

const verify = (token: string) => {
    try {
        const payload = jwt.verify(token, SECRET_KEY, {
            ignoreExpiration: false,
        });

        return !!(payload && payload.sub);
    } catch {
        return false;
    }
};

export {
    appUrl,
    sign,
    verify
}