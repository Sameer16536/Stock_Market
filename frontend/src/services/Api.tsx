import axios from "axios";

// Base configuration for axios
const api = axios.create({
  baseURL: "http://localhost:8000", // Replace with your backend URL
  timeout: 5000, // Optional: Adjust the timeout as needed
  headers: {
    "Content-Type": "application/json",
  },
});

// Define API routes
const API = {
  // Stock-related routes
  getStockData: (symbol: string) => api.get(`/stocks/${symbol}`),
  getStockHistory: (symbol: string) => api.get(`/stocks/${symbol}/history`),
  buyStock: (data: {
    userId: number;
    symbol: string;
    quantity: number;
    price: number;
  }) => api.post("/stocks/buy", data),
  sellStock: (data: {
    userId: number;
    symbol: string;
    quantity: number;
    price: number;
  }) => api.post("/stocks/sell", data),

  // User-related routes
  getUserData: (userId: number) => api.get(`/user/profile/${userId}`),
  createUser: (data: { name: string; email: string; password: string }) => api.post("/user/register", data),

  // Transaction-related routes
  getUserTransactions: (userId: number) =>
    api.get(`/users/${userId}/transactions`),
};

export default API;
