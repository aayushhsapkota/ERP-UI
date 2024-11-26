import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  setFromClientByID,
  setPaymentData,
} from "../../../stateManagement/slice/paymentSlice";
import { setPageNumber } from "../../../stateManagement/slice/transactionSlice";
import convertDate from "../../Common/ConvertEnglishDate";
import EmptyBar from "../../Common/EmptyBar";
import Pagination from "../../Pagination";
const defaultTdContent =
  "w-full flex flex-wrap flex-row items-center justify-start text-default-color font-title text-[12px] sm:text-base my-1";

const defaultTdContentSecond =
  "w-full flex flex-wrap flex-row items-center justify-end text-default-color font-title text-[12px] sm:text-base my-1";
const TransactionByID = ({
  name,
  data,
  initLoading,
  merchant,
  pageCount,
  currentPage,
  pagination,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const goToDetail = useCallback(
    (data) => {
      if (
        data.transactionType === "Sale" ||
        data.transactionType === "Purchase" ||
        data.transactionType === "SalesReturn" ||
        data.transactionType === "PurchasesReturn"
      ) {
        if (data.transactionType === "Purchase") {
          navigate(`/purchases/${data.transactionNumber}`);
        } else if (data.transactionType === "Sale") {
          navigate(`/invoices/${data.transactionNumber}`);
        } else if (data.transactionType === "SalesReturn") {
          navigate(`/salesreturn/${data.transactionNumber}`);
        } else if (data.transactionType === "PurchasesReturn") {
          navigate(`/purchasesreturn/${data.transactionNumber}`);
        }
      } else if (
        data.transactionType === "PaymentIn" ||
        data.transactionType === "PaymentOut"
      ) {
        dispatch(setPaymentData(data));
        dispatch(setFromClientByID(name));
      }
    },
    [dispatch, navigate]
  );

  return (
    <>
      {initLoading !== "loading" &&
        data !== null &&
        data.length > 0 &&
        data
          .slice()
          .reverse()
          .map((client, index) => (
            <div
              className="bg-white rounded-xl px-3 py-1 mb-4 cursor-pointer hover:bg-[#fdfdfd] transition-all duration-200"
              style={name ? { marginTop: "1rem" } : {}}
              onClick={() => goToDetail(client)}
              key={index}
            >
              <div className="flex flex-wrap p-2">
                <div className="flex-col flex-1">
                  <div
                    className={
                      defaultTdContent + "font-bold text-[18px] sm:text-[20px]"
                    }
                  >
                    <button
                      className="whitespace-nowrap text-ellipsis overflow-hidden text-[#000] cursor-pointer"
                      onClick={() => goToDetail(client.transactionNumber)}
                    >
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
                        <span className="text-[12px] sm:text-[15px] text-gray-600">
                          {client.billNumber && " #" + client.billNumber}
                        </span>
                      )}
                    </button>
                  </div>
                  <div className={defaultTdContent}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden capitalize text-[13px] sm:text-[15px]">
                      {name === true
                        ? client?.partyDetails?.name
                        : client?.note?.match(/[a-z]/)
                        ? client?.note
                        : client?.note?.includes("Cash")
                        ? client?.note
                        : client?.note?.match(/[A-Z]/)
                        ? client?.note
                        : ""}
                    </span>
                  </div>
                  <div className={defaultTdContent}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                      {convertDate(client.createdDate,client.createdAt)}{" "}
                      {/* {convertDate(new Date(client.createdDate))}{" "} */}
                                                           
                    </span>
                  </div>
                  {name !== true && (
                    <div className={`${defaultTdContent} mt-2`}>
                      <span
                        className={`whitespace-nowrap text-ellipsis overflow-hidden ${
                          client.amountToPay < 0
                            ? merchant === true
                              ? "bg-green-100 text-green-500"
                              : "bg-rose-100 text-rose-500"
                            : merchant === true
                            ? "bg-rose-100 text-rose-500"
                            : "bg-green-100 text-green-500"
                        } px-2 py-1`}
                      >
                        Bal: Rs.{" "}
                        {client.amountToPay < 0
                          ? client.amountToPay * -1
                          : client.amountToPay}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-col flex-2">
                  <div className={defaultTdContentSecond}>
                    <span
                      className={
                        client.transactionType === "PaymentIn"
                          ? "whitespace-nowrap text-ellipsis overflow-hidden text-green-600"
                          : client.transactionType === "PaymentOut"
                          ? "whitespace-nowrap text-ellipsis overflow-hidden text-rose-600"
                          : "whitespace-nowrap text-ellipsis overflow-hidden"
                      }
                    >
                      Rs. {client.amount || 0}
                    </span>
                  </div>
                  <div className={defaultTdContentSecond}>
                    <span
                      className={
                        "whitespace-nowrap text-ellipsis overflow-hidden px-2 py-1 " +
                        (client.status === "Partial"
                          ? "bg-blue-200 text-blue-600"
                          : client.status === "Paid"
                          ? "bg-green-200 text-green-600"
                          : client.status === "Unpaid"
                          ? "bg-yellow-100 text-yellow-600"
                          : client.status === "To Give"
                          ? "bg-rose-100 text-rose-400"
                          : client.status === "To Receive"
                          ? "bg-green-100 text-green-500"
                          : client.status === "Draft"
                          ? "bg-gray-100 text-gray-500"
                          : "")
                      }
                    >
                      {client.status}
                    </span>
                  </div>
                  <div className={defaultTdContentSecond}>
                    <span className="whitespace-nowrap text-ellipsis overflow-hidden text-gray-600">
                      {(client.transactionType === "Sale" ||
                        client.transactionType === "Purchase" ||
                        client.transactionType === "SalesReturn" ||
                        client.transactionType === "PurchasesReturn") &&
                        `Rs. ${
                          client.amount - client.receviedAmount || 0
                        } Unpaid`}{" "}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
      {(data === null || data.length <= 0 || initLoading === "loading") && (
        <div className="my-4">
          <EmptyBar
            title={name === true ? "data" : "client detail"}
            initLoading={initLoading}
          />
        </div>
      )}
      {pagination === true && initLoading !== "loading" && data.length > 0 && (
        <Pagination
          pageCount={pageCount}
          currentPage={currentPage}
          setPageNumber={setPageNumber}
        />
      )}
    </>
  );
};

export default TransactionByID;
