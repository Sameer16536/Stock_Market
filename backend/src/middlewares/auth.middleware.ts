import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const refreshToken  = req.cookies.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }
    const secret = process.env.JWT_SECRET as string;

    const decoded = jwt.verify(refreshToken, secret) as {
      id: string;
      email: string;
      name: string;
    };

    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };

    next();
  } catch (error) {
    console.error("Error in authMiddleware:", error);
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
