import React,{useState,useEffect} from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import IdentifyTitle from "./IdentifyTask";
import "react-dropdown/style.css";
import { getCashFlow } from "../../stateManagement/API/DashApi";
import Dropdown from "react-dropdown";

const CashFlow = () => {
  const options = ['Last five months']
  const [cashFlowData, setCashFlowData] = useState([]);

  useEffect(() => {
    getCashFlow().then((response) => {
      let data = response.data.cashFlowData;
    
      setCashFlowData(data);
    });
  }, []);


  return (
    <div className="w-full px-4 pt-4 pb-4 xl:mt-8 shadow-[0px_2px_10px] shadow-gray-300">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-700">
          <h3>Cash Flow</h3>
        </div>
     <div>
          <Dropdown options={options} value={options[0]} className="text-xs" />
        </div>
      </div>
      <div className="mt-12">
        <div className="text-sm flex justify-center">
          <BarChart
            width={300}
            height={270}
            data={cashFlowData}
            margin={{ top: 20, right: 20, left: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="_id" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="cashIn" fill="#82ca9d" />
            <Bar dataKey="cashOut" fill="#8884d8" />
          </BarChart>
        </div>
        <div>
          <div className="flex justify-center text-xs mt-6">
            <div>
              <IdentifyTitle color="bg-[#82ca9d]" title="Cash In" />
            </div>
            <div className="pl-4">
              <IdentifyTitle color="bg-[#8884d8]" title="Cash Out" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CashFlow;
