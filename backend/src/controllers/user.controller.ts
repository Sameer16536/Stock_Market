import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import zod from "zod";
import bcrypt from "bcrypt";
import { createUser } from "../services/user.service";

const prisma = new PrismaClient();

const userInputValidation = zod.object({
  email: zod.string().email("Invalid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters long"),
  name: zod.string().min(2, "Name must be at least 2 characters long"),
});

export const registerUser = async (
  req: Request,
  res: Response,
 next: NextFunction
) :Promise<Response | void> => {
  try {
    // Check Input type validation
    const validateInput = userInputValidation.parse(req.body);
    const { email, password, name } = validateInput;
    // Find if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({ email, name, password: hashedPassword });
    // Send a success response
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


export const loginUser = async (req:Request, res:Response, next:NextFunction) => {}
export const logoutUser = async (req:Request, res:Response, next:NextFunction) => {}
export const getUserProfile = async (req:Request, res:Response, next:NextFunction) => {}