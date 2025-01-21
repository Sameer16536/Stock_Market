import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient()

export const getStockData = async (req:Request, res:Response) => {
    try {
      const { symbol } = req.params;
  
      // Fetch stock data and history
      const stock = await prisma.stock.findUnique({
        where: { symbol },
        include: {
          history: {
            orderBy: { date: 'desc' },
            take: 5, // Retrieve the last 5 history records
          },
        },
      });
  
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
  
      return res.json(stock);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error });
    }
  };

export const getStockHistory = async (req:Request, res:Response) => {
    try {
      const { symbol } = req.params;
  
      const stockHistory = await prisma.stock.findUnique({
        where: { symbol },
        select: {
          history: {
            orderBy: { date: 'desc' },
          },
        },
      });
  
      if (!stockHistory) {
        return res.status(404).json({ message: 'Stock history not found' });
      }
  
      return res.json(stockHistory.history);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error });
    }
  };

  export const buyStock = async (req:Request, res:Response) => {
    try {
      const { userId, symbol, quantity, price } = req.body;
  
      // Check if stock exists
      const stock = await prisma.stock.findUnique({
        where: { symbol },
      });
  
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
  
      // Create a transaction for buying the stock
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          stockId: stock.id,
          type: 'buy',
          quantity,
          price,
        },
      });
  
      return res.json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error });
    }
  };

  export const sellStock = async (req:Request, res:Response) => {
    try {
      const { userId, symbol, quantity, price } = req.body;
  
      // Check if stock exists
      const stock = await prisma.stock.findUnique({
        where: { symbol },
      });
  
      if (!stock) {
        return res.status(404).json({ message: 'Stock not found' });
      }
  
      // Check if the user has enough stock to sell
      const userTransactions = await prisma.transaction.findMany({
        where: { userId, stockId: stock.id, type: 'buy' },
      });
  
      const totalPurchasedQuantity = userTransactions.reduce((acc, trans) => acc + trans.quantity, 0);
  
      if (totalPurchasedQuantity < quantity) {
        return res.status(400).json({ message: 'Not enough stock to sell' });
      }
  
      // Create a transaction for selling the stock
      const transaction = await prisma.transaction.create({
        data: {
          userId,
          stockId: stock.id,
          type: 'sell',
          quantity,
          price,
        },
      });
  
      return res.json(transaction);
    } catch (error) {
      return res.status(500).json({ message: 'Something went wrong', error });
    }
  };