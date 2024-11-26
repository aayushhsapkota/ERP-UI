import React from "react";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { useSelector } from "react-redux";
import { getCompanyData } from "../../stateManagement/slice/companySlice";
import NepaliDate from "nepali-date-converter";

const PrintReport = ({
  isExporting = false,
  componentRef,
  newData,
  userDetail,
  totalCredit,
  totalDebit,
  convertDate,
  merchant,
}) => {
  // get date of first and last newDate
  const firstDate = newData[0]?.createdDate.split("T")[0];
  const lastDate = newData[newData.length - 1]?.createdDate.split("T")[0];
  const windowSize = window.innerWidth < 500 ? false : true;
  // const windowSize = true;
  const textSize = windowSize ? "text-sm" : "text-[0.61rem]";
  const textSizeBanner = windowSize ? "text-base" : "text-[0.8rem]";
  const insideTableTextSize = windowSize ? "text-sm" : "text-[0.55rem]";
  const companyDetail = useSelector(getCompanyData);
  const nepaliDate= new NepaliDate();
  const formattedDate = nepaliDate.format('YYYY-MM-DD');
  return (
    <div
      className={`w-[18cm] non-scalable`}
      ref={componentRef}
      style={
        !isExporting
          ? {
              height: "100% !important",
              width: "100% !important",
              backgroundColor: "white",
            }
          : {
              display: "none",
            }
      }
    >
      <section className="py-4 px-1 bg-[#00684A] shadow-lg text-white">
        <div className="font-semibold text-xl">
          {companyDetail?.companyName}
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className={`${textSizeBanner}`}>
              {companyDetail?.billingAddress}
            </div>
            <div className={`${textSizeBanner}`}>
              {companyDetail?.companyEmail}
            </div>
          </div>
          <div>
            <div className={`${textSizeBanner} text-right`}>
              Mobile No: {companyDetail?.companyMobile}
            </div>
            <div className={`${textSizeBanner} text-right`}>
              Phone No: {companyDetail?.companyPhone}
            </div>
          </div>
        </div>
      </section>

      <section className="flex py-2 items-center justify-between">
        <div className="flex flex-col">
          <div className="font-semibold">{userDetail?.name}'s Statement</div>
          <div className={`${textSize}`}>
            {!windowSize ? "Phone No" : "Phone Number"}: {userDetail?.mobileNo}
          </div>
          <div className={`${textSize}`}>
            {" "}
            ( {convertDate(firstDate)} - {convertDate(lastDate)})
          </div>
        </div>
        <div className={`flex flex-row ${textSize}`}>
          <div className="flex flex-col">
            Total Debit
            <div className=" text-rose-700">Rs.{totalDebit}</div>
          </div>
          <div
            className={`flex flex-col text-right ${
              !windowSize ? " mx-2" : " mx-4"
            }`}
          >
            Total Credit
            <div className=" text-green-700">Rs.{totalCredit}</div>
          </div>
          <div className="flex flex-col text-right">
            {merchant? "To Give":"To Receive"}
            <div
              className="text-rose-700"
            >
              Rs.{userDetail?.totalAmountToPay}
            </div>
          </div>
        </div>
      </section>
      <div className={textSize}>TOTAL {newData.length} ENTRIES</div>
      <table className="w-full table-auto mt-2 bg-white">
        <thead className="border-b text-[#000] uppercase">
          <tr className="bg-gray-300">
            <th
              className={` px-2 py-1 text-left w-[15%] ${insideTableTextSize}`}
            >
              Date <span className="text-[0.3rem] sm:text-[0.6rem]">(BS)</span>
            </th>
            <th
              className={`text-left border-l border-b  px-2 py-1 sm:w-[20%] ${insideTableTextSize}`}
            >
              Particular
            </th>
            <th
              className={`text-left border-l border-b  px-2 py-1 w-[15%] sm:w-[20%] ${insideTableTextSize}`}
            >
              Remarks
            </th>
            <th
              className={`text-left border-l border-b px-2 py-1 w-[15%]  ${insideTableTextSize}`}
            >
              Debit
            </th>
            <th
              className={`text-left border-l border-b px-2 py-1 w-[15%]  ${insideTableTextSize}`}
            >
              Credit
            </th>
            <th
              className={`text-left border-l border-b px-2 py-1 w-[15%]  ${insideTableTextSize}`}
            >
              Balance
            </th>
          </tr>
        </thead>
        <tbody>
          {newData !== null &&
            newData.length > 0 &&
            newData.map((client, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0
                    ? insideTableTextSize
                    : `${insideTableTextSize} bg-gray-100`
                }
              >
                <td className="border-b px-2 py-1">
                  {client.createdDate.split("T")[0]}
                </td>
                <td className="text-left px-2 py-1 border-l border-b">
                  <span>
                    {client.transactionType === "PaymentIn"
                      ? "Payment In"
                      : client.transactionType === "Sale"
                      ? "Sale"
                      : client.transactionType === "SalesReturn"
                      ? "Sales Return"
                      : client.transactionType === "PurchasesReturn"
                      ? "Purchase Return"
                      : client.transactionType === "PaymentOut"
                      ? "Payment Out"
                      : client.transactionType === "Purchase"
                      ? "Purchase"
                      : client.transactionType === "OpeningBalance"
                      ? "Opening Balance"
                      : client.transactionType}
                  </span>
                </td>
                <td className="text-left px-2 py-1 border-l border-b">
                  <span>
                    {" "}
                    {client?.transactionType === "PaymentIn" ||
                    client?.transactionType === "PaymentOut" ? (
                      <div className="flex flex-col">
                        {!client?.note?.includes("Cash") ||
                        !client?.note?.includes("Esewa") ? (
                          <>
                            <div>{client?.note?.split("and")[0]}</div>
                            <div>{client?.note?.split("and")[1]}</div>
                          </>
                        ) : (
                          <div>{client?.note}</div>
                        )}
                      </div>
                    ) : (
                      <div>
                        {client?.status}
                        {client?.note ? `(${client?.note})` : ""}
                      </div>
                    )}
                  </span>
                </td>
                <td className="text-left px-2 py-1 border-l border-b">
                  <span>
                    {client.accountType === "Debit"
                      ? client.amountRemainToPay !== 0
                        ? `${client.amountRemainToPay}`
                        : "-"
                      : ""}
                  </span>
                </td>
                <td className="text-left px-2 py-1 border-l border-b">
                  <span>
                    {client.accountType === "Credit"
                      ? client.amountRemainToPay !== 0
                        ? `${client.amountRemainToPay}`
                        : "Paid"
                      : ""}
                  </span>
                </td>
                <td className="text-left px-2 py-1 border-l border-b-2">
                  <div>
                    {" "}
                    {client.amountToPay < 0
                      ? client.amountToPay * -1
                      : client.amountToPay}{" "}
                    <span>{"Dr."}</span>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <div className={`mt-4 ${textSize}`}>
        Report Generated on: {convertDate(formattedDate)}
        {/* {convertDate(todayNepaliDate(new Date())).split(" ")[1]} */}|{" "}
        {new Date().toLocaleTimeString("en-US", { hour12: true })}
      </div>
    </div>
  );
};

export default PrintReport;
