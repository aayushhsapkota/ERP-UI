import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import IdentifyTitle from "./IdentifyTask";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import { getRevenueApi } from "../../stateManagement/API/DashApi";

const Revenue = () => {
  const options = [
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];

  const apiTimeRangeValues = {
    "This Week": "thisWeek",
    "Last Week": "lastWeek",
    "This Month": "thisMonth",
    "Last Month": "lastMonth",
    "This Year": "thisYear",
    "Last Year": "lastYear",
  };

  const [revenueData, setRevenueData] = useState([]);
  const [totalReturn, setTotalReturn] = useState([]);
  const [totalSales, setTotalSales] = useState([]);
  const [timeRange, setTimeRange] = useState(apiTimeRangeValues["This Week"]);

  const dropDownHandler = (event) => {
    if (timeRange !== apiTimeRangeValues[event.value]) {
      setTimeRange(apiTimeRangeValues[event.value]);
    }
  };

  useEffect(() => {
    getRevenueApi({ timeRange })
      .then((response) => {
        setRevenueData(response.data.data);
        setTotalSales(response.data.totalSales.toLocaleString("en-In", { currency: "INR" }));
        setTotalReturn(response.data.totalReturned.toLocaleString("en-In", {currency: "INR"}));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [timeRange]);

  return (
    <div className="w-full px-4 pt-3 pb-4 md:mt-8 mt-10 shadow-[0px_2px_10px] shadow-gray-300">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-700">
          <h3>Total Sales</h3>
        </div>
        <div>
          <Dropdown
            options={options}
            value={options[0]}
            className="text-xs"
            onChange={dropDownHandler}
          />
        </div>
      </div>
      <div className="mt-1">
        <div className="text-2xl font-bold text-gray-700">
          <h2>{totalSales}</h2>
        </div>
        <div className="text-sm mt-6 flex justify-center">
          <LineChart
            width={300}
            height={250}
            data={revenueData}
            margin={{ top: 20, right: 20, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="totalSales" stroke="green" />
            <Line
              type="monotone"
              dataKey="totalMoneyReceived"
              stroke="red"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </div>
        <div className="flex justify-between items-center text-sm mt-6">
          <IdentifyTitle color="bg-[red]" title="Cash Recieved" />
        </div>
        <div className="text-gray-700 mt-4">
          <span className="text-gray-600">Total Returns: </span>
          <span className="text-black font-semibold">{totalReturn}</span>
        </div>
      </div>
    </div>
  );
};

export default Revenue;
