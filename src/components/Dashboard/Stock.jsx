import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import React, { useState,useEffect } from "react";
import "react-dropdown/style.css";
import { getStock } from "../../stateManagement/API/DashApi";

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [totalStock, setTotalStock] = useState([]);


  useEffect(() => {
    getStock()
      .then(response => {
        let data = response.data.data;
        data.forEach(item => {
          item.name = item._id;
          item.totalStock = parseFloat(item.totalStock).toFixed(2); 
          delete item._id;
        });
        setStockData(data);
        setTotalStock(response.data.totalStock.toLocaleString('en-In',{currency:'INR'}));
      });
  }, []);
    return (
    <div className="w-full px-4 pt-3 pb-16 xl:pb-4 shadow-[0px_2px_10px] shadow-gray-300">
      <div className="mt-8">
        <div className="text-gray-700 text-center mt-3">
          <span className="text-gray-600">Stock: </span>
          <span className="text-black font-semibold">{totalStock}</span>
        </div>
        <div className="text-sm flex justify-center mt-8">
          <BarChart
            width={300}
            height={250}
            data={stockData}//here
            margin={{ top: 5, right: 20, left: 0 }}
            barSize={30}
          >
            <XAxis
              dataKey="name" //here
              // scale="point"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis />
            <Tooltip />
            <CartesianGrid strokeDasharray="3 3" />
            <Bar dataKey="totalStock" fill="#8884d8"  background={{ fill: 'lightgray' }} />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

export default Stock;
