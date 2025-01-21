
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function getStockHistory(symbol: string, startDate: Date, endDate: Date) {
    return await prisma.stockHistory.findMany({
        where: {
            stock: { symbol },
            date: {
                gte: startDate,
                lte: endDate,
            },
        },
        orderBy: { date: 'asc' },
    });
}


export async function buyStock(userId: number, symbol: string, quantity: number) {
    const stock = await prisma.stock.findUnique({ where: { symbol } });
    if (!stock) throw new Error('Stock not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const stockPrice = stock.data.currentPrice; // Assume `data` contains a `currentPrice` field
    const totalCost = stockPrice * quantity;

    if (user.credits < totalCost) throw new Error('Insufficient credits');

    await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits - totalCost },
    });

    await prisma.transaction.create({
        data: {
            userId,
            stockId: stock.id,
            type: 'buy',
            quantity,
            price: stockPrice,
        },
    });

    return { success: true, message: 'Stock purchased successfully' };
}

export async function sellStock(userId: number, symbol: string, quantity: number) {
    const stock = await prisma.stock.findUnique({ where: { symbol } });
    if (!stock) throw new Error('Stock not found');

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    const stockPrice = stock.data.currentPrice; // Assume `data` contains a `currentPrice` field
    const totalEarnings = stockPrice * quantity;

    await prisma.user.update({
        where: { id: userId },
        data: { credits: user.credits + totalEarnings },
    });

    await prisma.transaction.create({
        data: {
            userId,
            stockId: stock.id,
            type: 'sell',
            quantity,
            price: stockPrice,
        },
    });

    return { success: true, message: 'Stock sold successfully' };
}
