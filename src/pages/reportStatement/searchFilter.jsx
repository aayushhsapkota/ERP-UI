import React, { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {  MdDateRange } from "react-icons/md";
import { TbUserSearch } from "react-icons/tb";
import { defaultSearchStyle } from "../../constants/defaultStyles";
import NepaliDatePicker from "../../components/Common/NepaliDatePicker";
import { useDispatch } from "react-redux";
import { setTransactionDate } from "../../stateManagement/slice/transactionSlice";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import DialogBoxPDF from "./dialogBoxPDF";

const SearchFilter = ({
  userDetail,
  setViewReport,
  searchBy,
  handlerSearchValue,
  merchant = false,
  componentRef,
  setOpenPdf,
}) => {
  const dateStyle =
    "text-center bg-[#00684aea] rounded-lg py-1 sm:text-[0.8rem] lg:text-sm text-xs text-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-200 overflow-hidden w-max-md";
  const date = {
    startDate: "Date From",
    endDate: "Date Upto",
  };
  const [dateData, setDateData] = useState(date);
  const [dataChoose, setDataChoose] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      setTransactionDate({
        startDate:
          dateData?.startDate === "Date From" ? "" : dateData?.startDate,
        endDate: dateData?.endDate === "Date Upto" ? "" : dateData?.endDate,
      })
    );
  }, [dateData?.startDate, dateData?.endDate]);
  const ToFilterDate =
    window.innerWidth > 650 && window.innerWidth < 800
      ? ["", "Today"]
      : window.innerWidth > 800 && window.innerWidth < 900
      ? ["", "Today", "Last 30"]
      : ["", "Today", "Last 7", "Last 30"];
  const setFilterData = useCallback(
    (data) => {
      if (data === "") {
        setDateData(date);
      } else if (data === "Today") {
        setDateData({
          startDate: todayNepaliDate(new Date()),
          endDate: todayNepaliDate(new Date()),
        });
      } else if (data === "Last 7") {
        const today = new Date();
        const LastWeek = todayNepaliDate(
          new Date(today.setDate(today.getDate() - 7))
        );
        const todayDate = todayNepaliDate(new Date());
        setDateData({
          startDate: LastWeek,
          endDate: todayDate,
        });
      } else if (data === "Last 30") {
        const today = new Date();
        const lastMonth = todayNepaliDate(
          new Date(today.setDate(today.getDate() - 30))
        );
        const todayDate = todayNepaliDate(new Date());
        setDateData({
          startDate: lastMonth,
          endDate: todayDate,
        });
      }
      return data;
    },
    [setDateData]
  );
  return (
    <>
      <div className="w-full px-3 py-3 bg-[#00684b9f] overflow-hidden">
        {/* header */}
        <div className="flex flex-wrap justify-between items-center">
          <motion.button
            className="p-1 focus:outline-none rounded-md bg-[#fff] hover:bg-slate-100"
            onClick={() => {
              setViewReport(false);
            }}
            initial={{
              translateX: 0,
            }}
            animate={{
              color: "#00684b",
              rotate: "0deg",
            }}
            transition={{
              type: "spring",
              damping: 25,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </motion.button>
          <div className="flex-1 ml-8 font-medium text-lg text-white">
            {userDetail.name} Report
          </div>
          <DialogBoxPDF componentRef={componentRef} setOpenPdf={setOpenPdf} name={userDetail.name} />
        </div>
        <div className="lg:flex lg:items-center lg:justify-between">
          {/* search */}
          <div className="bg-white w-full rounded-lg px-1 py-2 mt-3 lg:mr-1">
            {/* <div className="font-title mb-2">Advanced Search</div> */}
            <div className="mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-9 w-9 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <TbUserSearch
                  className={`w-5 h-5 ${
                    searchBy !== "" ? "text-[#00684a96]" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                // value={searchBy.anything} //Bug fix for searching
                placeholder={`Search Bill, Remarks, Transaction Type`}
                className={
                  defaultSearchStyle +
                  "h-9 w-full rounded-lg text-xs sm:text-sm"
                }
                onChange={(event) => handlerSearchValue(event)}
              />
            </div>
          </div>
          {/* date */}
          <div className="hidden lg:flex justify-center items-center bg-white rounded-lg  px-3 py-3 mt-3">
            <div className="relative">
              <MdDateRange className="h-4 w-4 text-[#ffffff] absolute top-3 left-3 transform -translate-y-2" />
              <NepaliDatePicker
                className={dateStyle + " mr-4 lg:mr-2"}
                setData={setDateData}
                name="startDate"
                id={"nepali-datepicker-1"}
                data={dateData}
                value={dateData?.startDate}
                disabledBeforeDate={true}
              />
            </div>
            <div className="relative">
              <MdDateRange className="h-4 w-4 text-[#ffffff] absolute top-3 left-3 transform -translate-y-2" />
              <NepaliDatePicker
                className={dateStyle}
                setData={setDateData}
                name="endDate"
                id={"nepali-datepicker-2"}
                data={dateData}
                value={dateData?.endDate}
                disabledBeforeDate={true}
                disabledAfterDate={true}
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row mt-3 sm:justify-around lg:justify-start">
          <div className=" flex justify-start items-center mb-3 mx-1 sm:mb-0 lg:hidden">
            <div className="relative">
              <MdDateRange className="h-4 w-4 text-[#ffffff] absolute top-3 left-3 transform -translate-y-2" />
              <NepaliDatePicker
                className={dateStyle + " mr-4"}
                setData={setDateData}
                name="startDate"
                id={"nepali-datepicker-3"}
                data={dateData}
                value={dateData?.startDate}
                disabledBeforeDate={true}
              />
            </div>
            <div className="relative">
              <MdDateRange className="h-4 w-4 text-[#ffffff] absolute top-3 left-3 transform -translate-y-2" />
              <NepaliDatePicker
                className={dateStyle + ""}
                setData={setDateData}
                name="endDate"
                id={"nepali-datepicker-4"}
                data={dateData}
                value={dateData?.endDate}
                disabledBeforeDate={true}
                disabledAfterDate={true}
              />
            </div>
          </div>
          <div className="flex flex-row flex-wrap items-center justify-start">
            {ToFilterDate.map((data) => (
              <span
                key={data}
                onClick={() => {
                  setFilterData(data);
                  setDataChoose(data);
                }}
                className={
                  "px-2.5 py-[0.2rem] text-xs lg:text-sm mx-2 cursor-pointer rounded-lg " +
                  (dataChoose === data
                    ? " primary-background-color text-white "
                    : " bg-white hover:bg-gray-200 text-black")
                }
              >
                {data === "" ? "All" : data}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap justify-between my-2 px-3 font-bold text-base sm:text-lg">
        <div>Net Balance:</div>
        <div
          className={`
       ${merchant ? "text-green-700" : "text-rose-700"}
        `}
        >
          Rs.{userDetail?.totalAmountToPay}
        </div>
      </div>
    </>
  );
};

export default SearchFilter;
