import axios, { AxiosRequestHeaders } from "axios";

// Backend Base URL
const IP_ADDRESS_BACKEND = import.meta.env.VITE_BACKEND_URL ;

// Define the interface for API call parameters
interface ApiCallParams<T = any> {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  data?: T;
  headers?: AxiosRequestHeaders;
  credentials?: boolean
}

const apiCall = async <TResponse, TRequest = Record<string, any>>({
  method,
  url,
  data,
  headers,
  credentials = true,
}: ApiCallParams<TRequest>): Promise<TResponse> => {
  try {
    const response = await axios({
      method,
      url: `${IP_ADDRESS_BACKEND}${url}`,
      data,
      withCredentials: credentials,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken") || ""}`,
        ...headers,
      },
    });
    return response.data as TResponse;
  } catch (error: any) {
    console.error("API call error:", error);
      // If 401 and it's not already a refresh call, try refreshing the token
      if (
        error.response?.status === 401 &&
        url !== "/user/refresh-token" &&
        window.location.pathname !== "/login"
      ) {
        try {
          const refreshResponse = await axios.get(`${IP_ADDRESS_BACKEND}/user/refresh-token`, {
            withCredentials: true,
          });
  
          const newToken = refreshResponse.data.acessToken;
          localStorage.setItem("accessToken", newToken);
  
          // Retry the original request with new token
          const retry = await axios({
            method,
            url: `${IP_ADDRESS_BACKEND}${url}`,
            data,
            withCredentials: credentials,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newToken}`,
              ...headers,
            },
          });
  
          return retry.data as TResponse;
        } catch (refreshErr) {
          console.error("Refresh token failed:", refreshErr);
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
        }
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
      apiCall<{ message: string; user: { id: number; email: string; name: string }; token: string }>({
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
  
  buyStock: (body: { stockSymbol: string ,quantity:number,price:number}) => {
    apiCall({
      method: "POST",
      data:body,
      url:`/stocks/buy`,

    })
  },

  sellStock: (body: { stockSymbol: string,quantity:number,price:number }) => {
    apiCall({
      method: "POST",
      data: body,
      url: `/stockssell`
    })
  },
  getUserWatchlist: (body:{userId:number}) =>
    apiCall<{ watchlist: Record<string, any>[] }>({
      method: "GET",
      url: "/user/watchlist",
      data:body
    }),

  addToWatchlist: (body: { stockSymbol: string }) =>
    apiCall<{ message: string }>({
      method: "POST",
      url: "/user/watchlist",
      data: body,
    }),

  removeFromWatchlist: (body:{stockSymbol: string}) =>
    apiCall<{ message: string }>({
      method: "DELETE",
      url: `/user/watchlist`,
      data:body
    }),
};


