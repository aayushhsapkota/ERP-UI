import React, { useCallback, useEffect, useRef, useState } from "react";
import SearchFilter from "./searchFilter";
import convertDate from "../../components/Common/ConvertEnglishDate";
import {
  getByTransactionIDAndReport,
  getTransactionDateSelector,
  getTransactionDetailByIDSelector,
  getTransactionPageNumberSelector,
  getTransactionSearchBySelector,
  setTransactionSearchBy,
} from "../../stateManagement/slice/transactionSlice";
import { useSelector, useDispatch } from "react-redux";
import Maintable from "./Maintable";
import PrintReport from "./printReport";

const ReportStatement = ({
  userDetail,
  setViewReport,
  viewReport,
  merchant = false,
  id,
}) => {
  const searchBy = useSelector(getTransactionSearchBySelector);
  const date = useSelector(getTransactionDateSelector);
  const data = useSelector(getTransactionDetailByIDSelector);
  const page = useSelector(getTransactionPageNumberSelector);
  const windowSize = window.innerWidth > 1000 ? true : false;
  const dispatch = useDispatch();
  const [openpdf, setOpenPdf] = useState(false);
  const [searchAnything, setSearchAnything] = useState(""); //Bug fix for searching
  const componentRef = useRef(null);
  const handlerSearchValue = useCallback(
    (event) => {
      const { value } = event.target;
      setSearchAnything(value); //Bug fix for seaching
      dispatch(
        setTransactionSearchBy({
          ...searchBy,
          anything: value,
        })
      );
    },
    [searchBy]
  );
  React.useEffect(() => {
    viewReport &&
      dispatch(
        getByTransactionIDAndReport({
          id: id,
          page: page,
          // searchBy: searchBy
          searchBy: { name: "", anything: searchAnything }, //Bug fix for searching
          date: date,
        })
      );
  }, [id, dispatch, viewReport, searchBy.anything, date]);

  const arr = data.map((item) =>
    item.transactionType === "Sale" ||
    item.transactionType === "PurchasesReturn" ||
    item.transactionType === "PaymentOut"
      ? merchant
        ? "Credit"
        : "Debit"
      : item.transactionType === "SalesReturn" ||
        item.transactionType === "Purchase" ||
        item.transactionType === "PaymentIn"
      ? merchant
        ? "Debit"
        : "Credit"
      : item.transactionType === "OpeningBalance" && merchant === true
      ? "Debit"
      : "Debit"
  );

  const data1 = data.map((item, index) => {
    return {
      ...item,
      amountRemainToPay:
        item.transactionType === "Sale" ||
        item.transactionType === "Purchase" ||
        item.transactionType === "SalesReturn" ||
        item.transactionType === "PurchasesReturn"
          ? item.amount - item.receviedAmount
          : item.amount,
    };
  });

  const newData = data1.map((item, index) => {
    return {
      ...item,
      accountType: arr[index],
    };
  });

  // calculate total amount of debit and credit using accountType
  const totalDebit = newData.reduce((acc, item) => {
    if (item.accountType === "Debit") {
      return acc + item.amountRemainToPay;
    }
    return acc;
  }, 0);
  const totalCredit = newData.reduce((acc, item) => {
    if (item.accountType === "Credit") {
      return acc + item.amountRemainToPay;
    }
    return acc;
  }, 0);

  return (
    <>
      {!openpdf ? (
        <>
          <SearchFilter
            userDetail={userDetail}
            setViewReport={setViewReport}
            handlerSearchValue={handlerSearchValue}
            searchBy={searchBy}
            date={date}
            merchant={merchant}
            componentRef={componentRef}
            setOpenPdf={setOpenPdf}
          />

          <Maintable
            newData={newData}
            windowSize={windowSize}
            totalCredit={totalCredit}
            totalDebit={totalDebit}
            convertDate={convertDate}
            merchant={merchant}
          />
        </>
      ) : (
        <PrintReport
          newData={newData}
          componentRef={componentRef}
          totalCredit={totalCredit}
          totalDebit={totalDebit}
          convertDate={convertDate}
          merchant={merchant}
          userDetail={userDetail}
        />
      )}
    </>
  );
};

export default ReportStatement;
