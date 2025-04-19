import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser } from "../services/user.service";
import rateLimit from "express-rate-limit";
const prisma = new PrismaClient();

//Rate limit
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, 
  message: "Too many requests, please try again later.",
})

const userInputValidation = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  name: zod.string().min(2, "Name must be at least 2 characters long"),
});

const generateAccessToken = (user:any)=>{
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
}
const generateRefreshToken = (user:any)=>{
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, process.env.JWT_SECRET as string, {
    expiresIn: "7d",
  });
}

// Register User
export const registerUser = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Validate input data
    const validateInput = userInputValidation.parse(req.body);
    const { email, password, name } = validateInput;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ email, name, password: hashedPassword });

    if(!newUser){
      return res.status(500).json({ error: "Error creating user" });
    }
    const token = generateAccessToken(newUser);
    const refreshToken = generateRefreshToken(newUser);

  await prisma.refreshToken.create({
    data:{
      userId:newUser.id,
      token:refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    }
  })    
    // Set refresh token as cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Respond with success
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser,token:token  });
  } catch (error) {
    if (error instanceof zod.ZodError) {
      // Return validation errors
      return res.status(400).json({ error: error.errors });
    }
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

// Login User
export const loginUser = [authRateLimiter,async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    // Find user in the database
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token =generateAccessToken(user);

    // Generate refresh token
    const refreshToken  = generateRefreshToken(user);

    await prisma.refreshToken.create({  
      data:{
        userId:user.id,
        token:refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      }
    })

    // Set token as cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send success response
    return res.status(200).json({
      message: "User logged in successfully",
      user: { id: user.id, email: user.email, name: user.name },
      token,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}];

// Logout User
export const logoutUser = async (
  req: Request  & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      await prisma.refreshToken.update({ where: { token }, data: { revoked: true } });
    }
    res.clearCookie("refreshToken");
    return res.status(200).json({ message: "Logged out" });
  } catch (err) {
    return res.status(500).json({ error: "Logout failed" });
  }
};

// Get User Profile
export const getUserProfile = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user profile from the database
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.name,
      credits: user.credits,
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const getUserStockWatchlist = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Fetch user's watchlist using the join table
    const watchlist = await prisma.userStockWatchlist.findMany({
      where: { userId: req.user.id },
      include: { stock: true },
    });

    return res.status(200).json({ userId: req.user.id, watchlist });
  } catch (error) {
    console.error("Error Fetching User stock watchlist", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const postUserStockWatchlist = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { stockId } = req.body;

    // Check if stock exists
    const stock = await prisma.stock.findUnique({
      where: { id: Number(stockId) },
    });

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    // Check if already in watchlist
    const existingEntry = await prisma.userStockWatchlist.findUnique({
      where: {
        userId_stockId: { userId: req.user.id, stockId: Number(stockId) },
      },
    });

    if (existingEntry) {
      return res.status(400).json({ error: "Stock already in watchlist" });
    }

    // Add to watchlist using join table
    await prisma.userStockWatchlist.create({
      data: {
        userId: req.user.id,
        stockId: Number(stockId),
      },
    });

    return res.status(201).json({ message: "Stock added to watchlist" });
  } catch (error) {
    console.error("Error Adding Stock to Watchlist", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

export const deleteUserStockWatchlist = async (
  req: Request & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { stockId } = req.body;
  
    // Check if stock exists
    const stock = await prisma.stock.findUnique({
      where: { id: Number(stockId) },
    });

    if (!stock) {
      return res.status(404).json({ error: "Stock not found" });
    }

    // Check if stock is in watchlist
    const watchlistEntry = await prisma.userStockWatchlist.findUnique({
      where: {
        userId_stockId: { userId: req.user.id, stockId: Number(stockId) },
      },
    });

    if (!watchlistEntry) {
      return res.status(400).json({ error: "Stock not in watchlist" });
    }

    // Remove stock from watchlist
    await prisma.userStockWatchlist.delete({
      where: {
        userId_stockId: { userId: req.user.id, stockId: Number(stockId) },
      },
    });

    return res.status(200).json({ message: "Stock removed from watchlist" });
  } catch (error) {
    console.error("Error Removing Stock from Watchlist", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};


export const refreshAccessToken = [authRateLimiter,async(req: Request, res: Response)=>{
  try{
    const oldToken = req.cookies.refreshToken;

    if(!oldToken){
      return res.status(401).json({error:"No refresh Token"});
    }

    const decoded = jwt.verify(oldToken, process.env.JWT_SECRET as string) as {
      id: number};
     
      const existing = await prisma.refreshToken.findUnique({ where: { token: oldToken }, include: { user: true } });
      if (!existing || existing.revoked || existing.expiresAt < new Date()) {
        return res.status(401).json({ error: "Invalid or expired token" });
      }
  
      // Revoke old
      await prisma.refreshToken.update({
        where: { token: oldToken },
        data: { revoked: true }
      });
  
      // Issue new
      const newToken = generateRefreshToken(decoded.id);
      await prisma.refreshToken.create({
        data: {
          userId: decoded.id,
          token: newToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      const newAcessToken = generateAccessToken(existing.user);
      res.cookie("refreshToken", newToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });
      return res.status(200).json({ message: "Token refreshed successfully", acessToken: newAcessToken });
  }catch(error){
    console.error("Error Refreshing Access Token", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}]


export const cleanExpiredTokens = async () => {
  const result = await prisma.refreshToken.deleteMany({
    where: {
      OR: [
        { revoked: true },
        { expiresAt: { lt: new Date() } }
      ]
    }
  });
  console.log(`🧹 Cleaned ${result.count} expired/blacklisted tokens`);
};
