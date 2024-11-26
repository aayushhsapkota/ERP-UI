import React from "react";

const Maintable = ({
  newData,
  windowSize,
  totalCredit,
  totalDebit,
  convertDate,
  merchant,
}) => {
  return (
    <table className="w-full table-auto mt-2 bg-white">
      <thead className="border-b text-[#000] font-semibold">
        <tr>
          <th className="font-medium px-4 py-2 text-left w-[40%] sm:w-[40%] text-sm md:text-base lg:text-lg">
            Details
          </th>
          {windowSize && (
            <th className="text-right font-medium px-4 py-2 w-[20%] sm:w-[20%] text-xs md:text-base lg:text-lg">
              Remarks
            </th>
          )}
          <th className="text-right px-4 py-2 w-[20%] sm:w-[20%] font-medium text-xs md:text-base lg:text-lg">
            Debit (Rs.)
          </th>
          <th className="text-right px-4 py-2 w-[20%] sm:w-[20%] font-medium text-xs md:text-base lg:text-lg">
            Credit (Rs.)
          </th>
        </tr>
      </thead>
      <tbody>
        {newData !== null &&
          newData.length > 0 &&
          newData.map((client, index) => (
            <tr key={index}>
              <td className="px-4 py-2 text-sm sm:text-base border-b bg-gray-50 ">
                <div className="font-semibold">
                  <button>
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
                    {(client.transactionType === "Sale" ||
                      client.transactionType === "Purchase" ||
                      client.transactionType === "SalesReturn" ||
                      client.transactionType === "PurchasesReturn") && (
                      <span className=" text-[10px] sm:text-[12px] text-gray-600">
                        {client.billNumber ? " #" + client.billNumber : null}
                      </span>
                    )}
                  </button>
                </div>
                <div>
                  <span className=" text-sm text-gray-700">
                    {convertDate(client.createdDate,client.createdAt)}
                    {/* {convertDate(new Date(client.createdDate))} */}
                  </span>
                </div>
                <div>
                  <span
                    className={`text-sm ${
                      client.amountToPay < 0
                        ? merchant === true
                          ? " text-green-500"
                          : " text-red-500"
                        : merchant === true
                        ? "text-red-500"
                        : " text-green-500"
                    }`}
                  >
                    Bal: Rs.{" "}
                    {client.amountToPay < 0
                      ? client.amountToPay * -1
                      : client.amountToPay}
                  </span>
                </div>
              </td>
              {windowSize && (
                <td className="text-right px-4 py-2 text-xs sm:text-sm border-l border-b bg-green-50">
                  <span className={"overflow-hidden text-gray-600"}>
                    {/* {client?.note ? (
                      <div className="flex flex-col">
                        {!client?.note?.includes("Cash") ? (
                          <>
                            <div>{client?.note?.split("/")[0]}</div>
                            <div>{client?.note?.split("/")[1]}</div>
                          </>
                        ) : (
                          <div>{client?.note}</div>
                        )}
                      </div>
                    ) : (
                      "-"
                    )} */}
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
              )}
              <td className="text-right px-4 py-2 text-xs sm:text-sm border-l border-b bg-rose-50">
                <span
                  className={
                    client.accountType === "Debit"
                      ? "overflow-hidden text-rose-600"
                      : ""
                  }
                >
                  {client.accountType === "Debit"
                    ? client.amountRemainToPay !== 0
                      ? `Rs. ${client.amountRemainToPay}`
                      : "-"
                    : ""}
                </span>
              </td>
              <td className="text-right px-4 py-2  text-xs sm:text-sm border-l border-b bg-green-50">
                <span
                  className={
                    client.accountType === "Credit"
                      ? "overflow-hidden text-green-600"
                      : ""
                  }
                >
                  {client.accountType === "Credit"
                    ? client.amountRemainToPay !== 0
                      ? `Rs. ${client.amountRemainToPay}`
                      : "Paid"
                    : ""}
                </span>
              </td>
            </tr>
          ))}
        <tr className="shadow-xl border-t">
          <td className="px-4 py-2 text-xs sm:text-base bg-gray-50 ">
            <div className="flex flex-col sm:text-[14px] text-gray-700">
              Total
              <div className="font-semibold text-black">
                {" "}
                {newData.length} Entries
              </div>
            </div>
          </td>
          {windowSize && (
            <td className="text-right px-4 py-2 text-xs sm:text-sm bg-gray-50"></td>
          )}
          <td className="px-4 py-2 text-xs sm:text-base bg-rose-50 text-right">
            <div className="flex flex-col sm:text-[14px] text-gray-600">
              Total Debit
              <div className="font-semibold text-rose-700">
                {" "}
                Rs.{totalDebit}
              </div>
            </div>
          </td>
          <td className="px-4 py-2 text-xs sm:text-base bg-green-50 text-right">
            <div className="flex flex-col sm:text-[14px] text-gray-600">
              Total Credit
              <div className="font-semibold text-green-700">
                {" "}
                Rs.{totalCredit}
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Maintable;
