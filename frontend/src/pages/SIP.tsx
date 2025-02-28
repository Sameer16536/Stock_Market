import React from "react";
import SipChart from "../component/SIPChart";
import NavBar from "../component/Navbar";

const sipPlans = [
  {
    planName: "HDFC Equity Fund",
    type: "Equity",
    returns: "12.5%",
    duration: "5 Years",
    nav: 45.2,
    sipAmount: 5000,
    growth: [
      { year: "Year 1", amount: 53000 },
      { year: "Year 2", amount: 112000 },
      { year: "Year 3", amount: 174000 },
      { year: "Year 4", amount: 239000 },
      { year: "Year 5", amount: 305000 },
    ],
  },
  {
    planName: "ICICI Prudential Bluechip Fund",
    type: "Large Cap",
    returns: "10.8%",
    duration: "3 Years",
    nav: 33.6,
    sipAmount: 3000,
    growth: [
      { year: "Year 1", amount: 36000 },
      { year: "Year 2", amount: 79000 },
      { year: "Year 3", amount: 127000 },
    ],
  },
  {
    planName: "Aditya Birla Sun Life Tax Relief 96",
    type: "Tax Saving",
    returns: "15.2%",
    duration: "7 Years",
    nav: 52.4,
    sipAmount: 10000,
    growth: [
      { year: "Year 1", amount: 106000 },
      { year: "Year 2", amount: 223000 },
      { year: "Year 3", amount: 359000 },
      { year: "Year 4", amount: 506000 },
      { year: "Year 5", amount: 665000 },
      { year: "Year 6", amount: 838000 },
      { year: "Year 7", amount: 1024000 },
    ],
  },
];

const SIP: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <NavBar />
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        Systematic Investment Plans (SIP)
      </h1>
      <p className="text-lg text-gray-700 mb-6">
        Discover your SIP growth over the years with a clear and intuitive
        chart.
      </p>
      <div className="space-y-8">
        {sipPlans.map((plan, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {plan.planName}
            </h2>
            <p className="text-gray-600">
              <span className="font-bold">Type:</span> {plan.type}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">Returns:</span> {plan.returns}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">Duration:</span> {plan.duration}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">NAV:</span> ₹{plan.nav.toFixed(2)}
            </p>
            <p className="text-gray-600">
              <span className="font-bold">SIP Amount:</span> ₹
              {plan.sipAmount.toLocaleString()}
            </p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-700">
                Growth Over Time
              </h3>
              <SipChart
                data={plan.growth.map((item) => ({
                  label: item.year,
                  value: item.amount,
                }))}
                xKey="label"
                yKey="value"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SIP;
