import { Request, Response } from "express";
import { getTransactions, getSingleTransaction } from "./transactionDbService"

const getManyTransactions = async (req: Request, res: Response) => {
  try {
    const { transactions, count, page, limit } = await getTransactions(req.query);

    return res.status(200).json({
      message: 'Transactions fetched successfully',
      data: transactions,
      meta: {
        currentPage: page,
        dataTotal: count,
        pageSize: limit,
        pageTotal: Math.ceil(count / limit),
      },
    });
  } catch (e) {
    console.log('transactions-get', e);
    return res.status(500).json({
      message: "Internal Server Error, contact admin"
    })
  }
};

const getOneTransaction = async (req: Request, res: Response) => {
  try {
    const transaction = await getSingleTransaction(req.params.transactionId);

    return res.status(200).json({
      message: 'Transaction fetched successfully',
      data: transaction,
      meta: {
        currentPage: 1,
        pageSize: 1,
        pageTotal: 1,
      },
    });
  } catch (e) {
    console.log('singleTransactions-get', e);
    return res.status(500).json({
      message: "Internal Server Error, contact admin"
    })
  }
};

export {
  getManyTransactions,
  getOneTransaction
};
