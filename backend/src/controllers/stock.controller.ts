import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

export const getSingleStockData = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const stock = await prisma.stock.findUnique({
      where: { symbol },
      include: {
        history: {
          orderBy: { date: "desc" },
          take: 1, // Fetch the latest history record
        },
      },
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    return res.json(stock);
  } catch (error) {
    console.error("Error fetching stock data:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch stock data.", error });
  }
};

export const getStockHistoryData = async (req: Request, res: Response) => {
  try {
    const { symbol } = req.params;

    const stock = await prisma.stock.findUnique({
      where: { symbol },
      include: {
        history: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!stock || stock.history.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for the given stock." });
    }

    return res.json(stock.history);
  } catch (error) {
    console.error("Error fetching stock history:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch stock history.", error });
  }
};

export const getAllStocksWithMetadata = async (req: Request, res: Response) => {
  try {
    const stocks = await prisma.stock.findMany({
      include: {
        history: {
          orderBy: { date: "desc" },
          take: 1, // Include only the latest history for each stock
        },
      },
    });

    return res.json(stocks);
  } catch (error) {
    console.error("Error fetching stocks:", error);
    return res.status(500).json({ message: "Failed to fetch stocks.", error });
  }
};

export const getStockHistoryByDateRange = async (
  req: Request,
  res: Response
) => {
  try {
    const { symbol } = req.params;
    const { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ message: "Start date and end date are required." });
    }

    const stock = await prisma.stock.findUnique({
      where: { symbol },
      include: {
        history: {
          where: {
            date: {
              gte: new Date(startDate as string),
              lte: new Date(endDate as string),
            },
          },
          orderBy: { date: "desc" },
        },
      },
    });

    if (!stock || stock.history.length === 0) {
      return res
        .status(404)
        .json({ message: "No history found for the given date range." });
    }

    return res.json(stock.history);
  } catch (error) {
    console.error("Error fetching stock history by date range:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch stock history by date range.", error });
  }
};

export const getRecentHistoryForAllStocks = async (
  req: Request,
  res: Response
) => {
  try {
    const recentHistory = await prisma.stockHistory.findMany({
      orderBy: { date: "desc" },
      distinct: ["stockId"], // Fetch the latest record for each stock
    });

    return res.json(recentHistory);
  } catch (error) {
    console.error("Error fetching recent history:", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch recent history for stocks.", error });
  }
};

export const buyStock = async (req: Request, res: Response) => {
  try {
    const { userId,  quantity, price } = req.body;
    const { symbol } = req.params;

    // Validate stock existence
    const stock = await prisma.stock.findUnique({
      where: { symbol },
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Fetch the user to check credits
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCost = quantity * price;

    if (user.credits < totalCost) {
      return res
        .status(400)
        .json({ message: "Insufficient credits to buy stock" });
    }

    // Deduct credits and create transaction
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        stockId: stock.id,
        type: "buy",
        quantity,
        price,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: user.credits - totalCost },
    });

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};

/**
 * Sell Stock Controller
 * Increases user's credits and creates a 'sell' transaction.
 */
export const sellStock = async (req: Request, res: Response) => {
  try {
    const { userId,quantity, price } = req.body;
    const { symbol } = req.params;

    // Validate stock existence
    const stock = await prisma.stock.findUnique({
      where: { symbol },
    });

    if (!stock) {
      return res.status(404).json({ message: "Stock not found" });
    }

    // Fetch user transactions to calculate the owned quantity
    const userTransactions = await prisma.transaction.findMany({
      where: { userId, stockId: stock.id, type: "buy" },
    });

    const totalPurchasedQuantity = userTransactions.reduce(
      (acc, transaction) => acc + transaction.quantity,
      0
    );

    // Ensure sufficient quantity to sell
    if (totalPurchasedQuantity < quantity) {
      return res.status(400).json({ message: "Not enough stock to sell" });
    }

    const earnings = quantity * price;

    // Create sell transaction and update user's credits
    const transaction = await prisma.transaction.create({
      data: {
        userId,
        stockId: stock.id,
        type: "sell",
        quantity,
        price,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: earnings } },
    });

    return res.json(transaction);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong", error });
  }
};
