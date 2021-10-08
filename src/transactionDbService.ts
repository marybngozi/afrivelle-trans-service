import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

const createTransaction = async (data: any) => {
  return await prisma.transaction.create({
    data: data
  })
}

const getTransactions = async ({ page= 1, limit= 100 }) => {
  limit = (limit > 100)? 100: limit;
  const offset = (page - 1) * limit;

  // get total count of transactions
  const totalCount = await prisma.transaction.count();

  // get the transactions
  const transactions = await prisma.transaction.findMany({
    skip: offset,
    take: limit,
  });

  return {
    count: totalCount,
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