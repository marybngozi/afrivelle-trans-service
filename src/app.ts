import * as dotenv from "dotenv";
import express, {Application, Request, Response} from "express";
import * as amqpConMgr from 'amqp-connection-manager';
import cors from "cors";
dotenv.config();

import authenticate from "./middleware";
import { getManyTransactions, getOneTransaction, updateTransaction } from "./transactionController";
import { brokerConnection } from "./brokerService";
import { appUrl, sign } from "./utlis";

const app = express()
const PORT: number  = parseInt(process.env.PORT as string);

app.use(cors());

app.use(express.json());

/*
*  Would be adding the routes here since it is a simple app
* */
// home route with instructions to proceed
// TODO make puzzle dynamic
app.get('/', async (req: Request, res: Response) => {
    const fullUrl = appUrl(req);

    return res.status(200).json({
        greet: "Hello, Welcome Human!, I assume you are one 😀",
        task: "In order to make sure, make a POST call to the verify resource with the result of the puzzle.",
        puzzle: "21 + 12",
        meta: {
            verify: `POST ${fullUrl}/verify/<result>`
        }
    })
})

// route to verify you are human and issue jwt
app.post('/verify/:result', async (req: Request, res: Response) => {
    const result = req.params.result;
    const fullUrl = appUrl(req);

    if(!result || parseInt(result) !== 33) {
        return res.status(400).json({
            greet: "Hello Alien, You are not welcomed here today 👽"
        })
    }

    // generate a token
    const { token, expiresIn } = sign();

    return res.status(200).json({
        greet: "Hello, Welcome Human! You have earned a token for access to Earth 🤠" +
            "You would find the paths to the resources you seek in the meta box.",
        token: token,
        tokenExpiry: expiresIn,
        meta: {
            getSingleTransaction: `GET ${fullUrl}/api/transactions/<transactionId>`,
            getTransactions: `GET ${fullUrl}/api/transactions?page=<page>&limit<limit>`
        }
    })
})

// Get all the transactions with limit and page
app.get('/api/transactions', authenticate, getManyTransactions)

// Get a single transaction
app.get('/api/transactions/:transactionId', authenticate, getOneTransaction)

// When route is not found, returns a json
app.use((req: Request, res: Response) => {
    return res.status(404).json({
        message: "This path you seek on earth was not found 👮🏽‍",
    });
});


app.on('error', (e:Application) => {
    console.log("Could not start server: ", e)
});

app.listen(PORT, () => {
    console.log(
        [
            '---------------------------',
            'Server Running',
            '---------------------------',
            `Listening on port: ${PORT}`,
            '---------------------------',
        ],
    );
});

process.on('beforeExit', () => {
    console.log('closing')
    // @ts-ignore
    ch.close()
    // @ts-ignore
    conn.close()
})