import React, { useEffect, useState } from "react";
import { APIUtility } from "../services/Api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Profile: React.FC = () => {
  const [profileData, setProfileData] = useState({});
  const [transactions, setTransactions] = useState<any[]>([]);
  const [watchlist, setWatchlist] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const user = useSelector((state: RootState) => state.user);
  console.log("User creds dikhe?", user);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const transactionsResponse = await APIUtility.getTransactionHistory(
          user.id
        );
        console.log(transactionsResponse); // Assuming this API is defined
        setTransactions(transactionsResponse.transactions);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  useEffect(() => {
    const getUserProfileData = async () => {
      try {
        const response = await APIUtility.getUserProfile();
        console.log("User Profile response--->", response);
        setProfileData(response);
      } catch (err: any) {
        setError(err.response.data.message || "Failed to load Profile Data");
      }
    };
    getUserProfileData();
  }, []);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await APIUtility.getUserWatchlist(user.id);
        console.log("Watchlist", response);
        setWatchlist(response.watchlist);
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to load watchlist.");
      }
    };

    fetchWatchlist();
  }, []);

  const removeFromWatchlist = async (stockId: number) => {
    const payload = {
      userId: user.id,
      stockId: stockId,
    };
    try {
      await APIUtility.removeFromWatchlist(payload);
      setWatchlist((prevWatchlist) =>
        prevWatchlist.filter((item) => item.stock.id !== stockId)
      );
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to remove stock from watchlist."
      );
    }
  };

  if (loading) {
    return <div className="text-center mt-10">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600 mt-10">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>

      {/* User Info */}
      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <p className="text-lg">
          <strong>ID:</strong> {profileData.id}
        </p>
        <p className="text-lg">
          <strong>Email:</strong> {profileData.email}
        </p>
        <p className="text-lg">
          <strong>Name:</strong> {profileData.name}
        </p>
        <p className="text-lg">
          <strong>Credits:</strong> {profileData.credits}
        </p>
      </div>

      {/* Watchlist Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Watchlist</h2>
        {watchlist.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">Stock Name</th>
                  <th className="p-3">Current Price</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {watchlist.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3 font-medium text-gray-700">
                      {item.stock.symbol}
                    </td>
                    <td className="p-3">{item.stock.data.upperBand}</td>
                    {/* <td className="p-3">{item.stock.data.priceBand}</td> */}
                    <td className="p-3 text-center">
                      <button
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                        onClick={() => removeFromWatchlist(item.stock.id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No stocks in your watchlist.</p>
        )}
      </div>

      {/* Transaction History */}
      <div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Transaction History
        </h2>
        {transactions.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border border-gray-200 rounded-lg shadow-sm">
              <thead className="bg-gray-200 text-gray-700">
                <tr>
                  <th className="p-3">Date</th>
                  <th className="p-3">Stock Symbol</th>
                  <th className="p-3">Action</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr
                    key={index}
                    className="border-t hover:bg-gray-100 transition"
                  >
                    <td className="p-3">
                      {new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium text-gray-700">
                      {transaction.stock.symbol}
                    </td>
                    <td className="p-3 capitalize">{transaction.type}</td>
                    <td className="p-3">{transaction.quantity}</td>
                    <td className="p-3 font-semibold">
                      ₹{transaction.price.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default Profile;
