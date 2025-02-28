import React from "react";
import NavBar from "./Navbar";
const StockMarketGuide: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className="bg-white p-6 rounded shadow-md max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Stock Market Guide
        </h1>
        <p className="text-gray-700 mb-4">
          Welcome to the Stock Market Tracker! This guide will help you
          understand the basics of the stock market and how to use this
          application effectively.
        </p>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            What is the Stock Market?
          </h2>
          <p className="text-gray-700">
            The stock market is a platform where shares of publicly listed
            companies are bought and sold. Investors can trade stocks to gain
            profits or to invest in a company's growth over time.
          </p>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Key Terms to Know
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>
              <strong>Stock:</strong> A share of ownership in a company.
            </li>
            <li>
              <strong>Price:</strong> The current value of one share of stock.
            </li>
            <li>
              <strong>Market Trend:</strong> The general direction in which the
              stock market is moving.
            </li>
            <li>
              <strong>Volatility:</strong> The degree of variation in stock
              prices over time.
            </li>
            <li>
              <strong>Portfolio:</strong> A collection of investments owned by
              an individual or institution.
            </li>
          </ul>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            How to Use This Application
          </h2>
          <ol className="list-decimal list-inside text-gray-700">
            <li>
              Select a stock from the stock list to view its real-time data and
              trends.
            </li>
            <li>
              Check the stock price trends displayed on the interactive chart.
            </li>
            <li>
              Keep an eye on market trends and stock changes to make informed
              decisions.
            </li>
            <li>
              Use the search functionality to find specific stocks quickly.
            </li>
          </ol>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">
            Tips for New Investors
          </h2>
          <ul className="list-disc list-inside text-gray-700">
            <li>Start with small investments to minimize risk.</li>
            <li>Research thoroughly before investing in a stock.</li>
            <li>Stay updated with market news and company performance.</li>
            <li>Diversify your portfolio to reduce risk.</li>
            <li>
              Be patient and avoid impulsive decisions during market volatility.
            </li>
          </ul>
        </div>

        <div className="text-center">
          <p className="text-gray-700 italic">
            “The stock market is filled with individuals who know the price of
            everything but the value of nothing.” – Philip Fisher
          </p>
        </div>
      </div>
    </>
  );
};

export default StockMarketGuide;
