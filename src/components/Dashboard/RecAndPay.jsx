import React, { useState, useEffect } from "react";
// import ProgressBar from "@ramonak/react-progress-bar";
import Triggers from "react-scroll-trigger";
import { getFinancials, getMonthProfit } from "../../stateManagement/API/DashApi";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

const RecAndPay = () => {
  const [visible, setVisible] = useState(false);
  const options = ["All Time"];
  const [toReceive, setToReceive] = useState([]);
  const [toPay, setToPay] = useState([]);
  const [rePer, setRePer] = useState([]);
  const [payPer, setPayPer] = useState([]);
  const [netProfit, setNetProfit] = useState([]);

  useEffect(() => {
    getFinancials().then((response) => {
      let toPay = response.data.totalPayables;
      let toReceive = response.data.totalReceivables;
      let totalSales = response.data.totalSales;
      let totalPurchase = response.data.totalPurchase;

      const payPercentage = parseFloat(
        ((toPay / totalPurchase) * 100).toFixed(2)
      );
      const rePercentage = parseFloat(
        ((toReceive / totalSales) * 100).toFixed(2)
      );
      


      setToReceive(toReceive.toLocaleString('en-In',{currency:'INR'}));
      setToPay(toPay.toLocaleString('en-In',{currency:'INR'}));
      setPayPer((100-payPercentage).toFixed(2))
      setRePer((100-rePercentage).toFixed(2));

    });
  }, []);

  useEffect(() => {
    getMonthProfit().then((response) => {
      let netProfit = response.data.netProfit;
      setNetProfit(netProfit.toLocaleString('en-In',{currency:'INR'}));
    });
  }, []);





  return (
    <div className="w-full px-4 pt-3 pb-28 xl:pb-4 shadow-[0px_2px_10px] shadow-gray-300">
      <div className="flex justify-end">
        <Dropdown options={options} value={options[0]} className="text-xs" />
      </div>
      <div className="mt-8">
        <div>
          <div className="text-gray-700 mt-3">
            <span className="text-gray-600">Recievables: </span>
            <span className="text-black font-semibold">{toReceive}</span>
          </div>
          {/* <div className="mt-10">
            <div className="flex items-center px-8">
              <ProgressBar
                completed={rePer}
                className="w-full"
                barContainerClassName="bg-neutral-600 rounded-3xl h-8"
                completedClassName="bg-green-600 w-[40%] rounded-3xl h-8"
                isLabelVisible={false}
                animateOnRender={true}
                transitionDuration="2s"
                transitionTimingFunction="ease-in-out"
              />
              <span className="pl-3 text-2xl font-semibold">{rePer}%</span>
            </div>
          </div> */}
          <div className="mt-10">
            <Triggers onEnter={() => setVisible(true)}>
              <div className="flex items-center px-8">
                <div className="w-full bg-neutral-600 rounded-3xl h-8">
                  <div
                    style={{
                      width: visible ? `${rePer}%` : "0%" /* Dynamic width */,
                      backgroundColor: "rgb(22 163 74)",
                      borderRadius: "999px",
                      height: "100%",
                      transitionDuration: "1s",
                      transitionTimingFunction: "ease-in-out",
                    }}
                  />
                </div>
                <span className="pl-3 text-2xl font-semibold">{rePer}%</span>
              </div>
            </Triggers>
          </div>
        </div>
        <div className="mt-12">
          <div className="text-gray-700 mt-3">
            <span className="text-gray-600">Payables: </span>
            <span className="text-black font-semibold">{toPay}</span>
          </div>
          {/* <div className="mt-10">
            <div className="flex items-center px-8">
              <ProgressBar
                completed={payPer}
                className="w-full"
                barContainerClassName="bg-neutral-600 rounded-3xl h-8"
                completedClassName="bg-blue-600 w-[30%] rounded-3xl h-8"
                isLabelVisible={false}
              />
              <span className="pl-3 text-2xl font-semibold">{payPer}%</span>
            </div>
          </div> */}
          <div className="mt-10">
            <div className="flex items-center px-8">
              <div className="w-full bg-neutral-600 rounded-3xl h-8">
                <div
                  style={{
                    width: visible ? `${payPer}%` : "0%" /* Dynamic width */,
                    backgroundColor: "rgb(37 99 235)",
                    borderRadius: "999px",
                    height: "100%",
                    transitionDuration: "2s",
                    transitionTimingFunction: "ease-in-out",
                  }}
                />
              </div>
              <span className="pl-3 text-2xl font-semibold">{payPer}%</span>
            </div>
          </div>
          <div className="text-gray-700 mt-14">
            <span className="text-gray-600">Monthly Profit: </span>
            <span className="text-black font-semibold">{netProfit}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecAndPay;
