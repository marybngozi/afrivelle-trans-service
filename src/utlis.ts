import { Request } from "express";
import jwt from "jsonwebtoken";
import moment from 'moment';
import axios from 'axios';

// helper function to get app url
const appUrl = (req: Request) => {
    return req.protocol + '://' + req.get('host');
}

// helper function to get random number for 3rd party api
const getRandomNumber = () => {
    const min = 1;
    const max = 100;
    return Math.floor(Math.random()*(max-min+1)+min);
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

const makeTransactionAPICall = async (data: any) => {
    const url =  process.env.TRANSACTION_PARTY_API || "https://jsonplaceholder.typicode.com";
    const id = getRandomNumber();
    const config: object = {
        method: "GET",
        url: `${url}/posts/${id}`,
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        data: data,
    };

    try {
        const transaction: any = await axios(config);
        console.log(transaction.data);

        if(!transaction.data) {
            return null
        }

        // assume transaction fetch goes well
        return {
            // transactionId: data.transactionId,
            transactionId: "123data.transactionId38",
            walletAddress: data.transactionId,
            clientId: data.clientId,
            currencyType: "ETH",
            amount: "12.98",
            transactionDate: moment().subtract(id, "days").format(),
        };

    } catch (error) {
        console.log("Error from 3rd party API call", error);
    }
}

export {
    appUrl,
    sign,
    verify,
    makeTransactionAPICall
}