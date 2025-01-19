import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import zod from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser } from "../services/user.service";

const prisma = new PrismaClient();

const userInputValidation = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  name: zod.string().min(2, "Name must be at least 2 characters long"),
});

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

    // Respond with success
    return res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
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
export const loginUser = async (
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
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });

    // Set token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000, // 1 day
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
};

// Logout User
export const logoutUser = async (
  req: Request  & { user?: { id: number; email: string; name: string } },
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    // Clear the token cookie
    res.clearCookie("token");
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ error: "Internal Server Error" });
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
    });
  } catch (error) {
    console.error("Error getting user profile:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
