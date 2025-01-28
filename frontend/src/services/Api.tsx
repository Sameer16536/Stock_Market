import axios, { AxiosRequestHeaders } from "axios";

// Backend Base URL
const IP_ADDRESS_BACKEND = "http://localhost:3000";

// Define the interface for API call parameters
interface ApiCallParams<T = any> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: T;
  headers?: AxiosRequestHeaders;
}

const apiCall = async <TResponse, TRequest = Record<string, any>>({
  method,
  url,
  data,
  headers,
}: ApiCallParams<TRequest>): Promise<TResponse> => {
  try {
    const response = await axios({
      method,
      url: `${IP_ADDRESS_BACKEND}${url}`,
      data,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        ...headers,
      },
    });
    return response.data as TResponse;
  } catch (error: any) {
    console.error("API call error:", error);
    if (error.response?.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/user/login";
    }


    throw error;
  }
};


export const APIUtility = {

  loginUser: (body: { email: string; password: string }) =>
    apiCall<{ token: string; user: Record<string, any> }>({
      method: "POST",
      url: "/user/login",
      data: body,
    }),

  registerUser: (body: { name: string; email: string; password: string }) =>
    apiCall<{ message: string }>({
      method: "POST",
      url: "/user/register",
      data: body,
    }),

  logoutUser: () =>
    apiCall<{ message: string }>({
      method: "GET",
      url: "/user/logout",
    }),

  getUserProfile: () =>
    apiCall<{ user: Record<string, any> }>({
      method: "GET",
      url: "/user/profile",
    }),

  // Transaction APIs
  getTransactionHistory: (userId: number) =>
    apiCall<{ transactions: Record<string, any>[] }>({
      method: "GET",
      url: `/user/${userId}/transactions`,
    }),



  deleteTransaction: (transactionId: number,userId:number) =>
    apiCall<{ message: string }>({
      method: "DELETE",
      url: `/user/${userId}/transactions/${transactionId}`,
    }),

  // Stock APIs
  getStockDetails: (stockSymbol: string) =>
    apiCall<{ stock: Record<string, any> }>({
      method: "GET",
      url: `/stocks/${stockSymbol}`,
    }),

};
