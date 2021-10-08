import { Request, Response } from "express";
import {getTransactions, getSingleTransaction, checkTransaction, createTransaction } from "./transactionDbService"
import { publishToQueue } from "./brokerService"
import { makeTransactionAPICall } from "./utlis"

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

    if(!transaction){
      return res.status(404).json({
        message: 'Transaction not found',
        data: null,
        meta: {
          currentPage: 1,
          pageSize: 1,
          pageTotal: 1,
        },
      });
    }

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

const updateTransaction = async (data: any) => {
  try{
    console.log(data)
    // make sure the transactionId id present
    if(!data){
      return {
        code: "E401",
        status: "error",
        message: "Bad request: No Data provided"
      }
    }

    const { transactionId } = data;

    if(!transactionId){
      return {
        code: "E401",
        status: "error",
        message: "Bad request: No transactionId provided"
      }
    }

    // check if transactionId already exists
    const transactionExists = await checkTransaction(transactionId);

    if (!transactionExists) {
      return {
        code: "E401",
        status: "error",
        message: "Duplicate: TransactionId already exists"
      }
    }

    // make a request to a 3rd party API for the transaction
    const returnedTransaction = await makeTransactionAPICall(data);

    if (!returnedTransaction) {
      return {
        code: "E401",
        status: "error",
        message: "Not Found: TransactionId was not found"
      }
    }

    // log the transaction to the database
    const newTransaction = await createTransaction(returnedTransaction);

    if(!newTransaction) {
      return {
        code: "E301",
        status: "error",
        message: "Not Updated: TransactionId was not updated"
      }
    }

    // publish NewTransaction Event
    // await publishToQueue(ch,"NewTransaction", newTransaction)

    return {
      code: "S201",
      status: "success",
      message: "Update Successful: TransactionId was updated"
    }
  }
  catch (e) {
    console.log("UpdateTransaction-controller", e)
  }

}

export {
  getManyTransactions,
  getOneTransaction,
  updateTransaction
};
