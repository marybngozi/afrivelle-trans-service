import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const createTransaction = async (data: any) => {
  return await prisma.transaction.create({
    data: data
  })
}

const getTransactions = async ({ page= 1, limit= 100 }) => {
  const transactions = await prisma.transaction.findMany();

  return {
    count: 40,
    page: page,
    limit: limit,
    transactions: transactions
  };
};

const getSingleTransaction = async (transactionId: string) => {
  return await prisma.transaction.findFirst({
    where: {transactionId: transactionId}
  });
};

const checkTransaction = async (transactionId: string) => {
  const transaction = await prisma.transaction.findFirst({
    where: {transactionId: transactionId}
  });

  return !!(transaction);
};

export {
  checkTransaction,
  createTransaction,
  getTransactions,
  getSingleTransaction
};