import React, { useEffect, useState } from "react";
import { APIUtility } from "../services/Api";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

const Profile: React.FC = () => {
    const [profileData,setProfileData] = useState({});
    const [transactions, setTransactions] = useState<any[]>([]);
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>("");
    const user = useSelector((state:RootState)=>state.user)
    console.log("User creds dikhe?",user)

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                setLoading(true);
                const transactionsResponse = await APIUtility.getTransactionHistory(user.id);
                console.log(transactionsResponse) // Assuming this API is defined
                setTransactions(transactionsResponse.transactions);
                
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load profile data.");
            } finally {
                setLoading(false);
            }
        };

        fetchProfileData();
    }, []);

    useEffect(()=>{
        const getUserProfileData = async()=>{
            try{ 
                const response = await APIUtility.getUserProfile()
                console.log("User Profile response--->",response)
                setProfileData(response)
            }catch(err:any){
                setError(err.response.data.message || "Failed to load Profile Data")
            }
        }
        getUserProfileData()
    },[])

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await APIUtility.getUserWatchlist(user.id);
                console.log("Watchlist",response)
                setWatchlist(response.watchlist);
            } catch (err: any) {
                setError(err.response?.data?.message || "Failed to load watchlist.");
            }
        };

        fetchWatchlist();
    }, []);

    const removeFromWatchlist = async (stockId: number) => {
        const payload = {
            userId : user.id,
            stockId : stockId
        }
        try {
            await APIUtility.removeFromWatchlist(payload);
            setWatchlist((prevWatchlist) => prevWatchlist.filter((stock) => stock.id !== stockId));
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to remove stock from watchlist.");
        }
    };


    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 mt-10">{error}</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">User Profile</h1>

            {/* User's Stocks */}
            <div>
            <p><strong>ID:</strong> {profileData.id}</p>
                <p><strong>Email:</strong> {profileData.email}</p>
                <p><strong>Name:</strong> {profileData.name}</p>
                <p><strong>Credits:</strong> {profileData.credits}</p>
            </div>


             {/* Watchlist Section */}
             <div className="mt-6">
                <h2 className="text-xl font-semibold mb-4">Watchlist</h2>
                {watchlist.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Stock Symbol</th>
                                <th className="border border-gray-300 p-2">Stock Name</th>
                                <th className="border border-gray-300 p-2">Current Price</th>
                                <th className="border border-gray-300 p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
  {watchlist.map((item) => (
    <tr key={item.id} className="text-center">
      <td className="border border-gray-300 p-2 font-semibold">{item.stock.symbol}</td>
      <td className="border border-gray-300 p-2">{item.stock.data.upperBand}</td>
      <td className="border border-gray-300 p-2">{item.stock.data.priceBand}</td>
      <td className="border border-gray-300 p-2">
        <button
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-all"
          onClick={() => removeFromWatchlist(item.stock.id)}
        >
          Remove
        </button>
      </td>
    </tr>
  ))}
</tbody>

                    </table>
                ) : (
                    <p className="text-gray-600">No stocks in your watchlist.</p>
                )}
            </div>

            {/* Transaction History */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                {transactions.length > 0 ? (
                    <table className="w-full border-collapse border border-gray-300">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-2">Date</th>
                                <th className="border border-gray-300 p-2">Stock Symbol</th>
                                <th className="border border-gray-300 p-2">Action</th>
                                <th className="border border-gray-300 p-2">Quantity</th>
                                <th className="border border-gray-300 p-2">Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((transaction, index) => (
                                <tr key={index} className="text-center">
                                    <td className="border border-gray-300 p-2">{new Date(transaction.createdAt).toLocaleString()}</td>
                                    <td className="border border-gray-300 p-2">{transaction.stock.symbol}</td>
                                    <td className="border border-gray-300 p-2">{transaction.type}</td>
                                    <td className="border border-gray-300 p-2">{transaction.quantity}</td>
                                    <td className="border border-gray-300 p-2">${transaction.price.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p className="text-gray-600">No transactions found.</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
