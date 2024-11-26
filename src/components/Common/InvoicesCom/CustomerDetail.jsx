import Button from "../../Button/Button";
import NepaliDatePicker from "../../Common/NepaliDatePicker";
import ClientPlusIcon from "../../Icons/ClientPlusIcon";
import { defaultInputSmStyle } from "../../../constants/defaultStyles";
import { useCallback, useState } from "react";
import { Fragment } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  getClientIsChoosed,
  setClientIsChoosed,
  getEditMode,
  setEditMode,
} from "../../../stateManagement/slice/editLogic";
import { useLocation } from "react-router-dom";

export const CustomerDetail = ({
  invoiceForm,
  setInvoiceForm,
  openChooseClient,
  isViewMode,
  isExporting,
  invoiceNumber,
  merchant,
  title,
}) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const editMode = useSelector(getEditMode);
  const clientIsChoosed = useSelector(getClientIsChoosed);
  const handlerInvoiceValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;

    setInvoiceForm((prev) => {
      return { ...prev, [keyName]: value };
    });
  }, []);

  const handlerInvoiceClientValue = useCallback((event, keyName) => {
    const value =
      typeof event === "string" ? new Date(event) : event?.target?.value;
    if (keyName === "name" && value.length >= 50) {
      return toast.warn("Name must be less than 50 characters", {
        position: "bottom-center",
        autoClose: 3000,
      });
    }

    setInvoiceForm((prev) => {
      return {
        ...prev,
        clientDetail: {
          ...prev.clientDetail,
          [keyName]: value,
        },
      };
    });
  }, []);

  useEffect(() => {
    const buttonToDisable = document.querySelectorAll(".btn-disable");
    if (
      location.pathname === "/invoices/new" ||
      location.pathname === "/purchases/new" ||
      location.pathname === "/purchasesreturn/new" ||
      location.pathname === "/salesreturn/new"
    ) {
      if (!clientIsChoosed && !editMode) {
        return;
      }
    }
    for (const button of buttonToDisable) {
      if (editMode || !clientIsChoosed) {
        button.removeAttribute("disabled", "");
      }
      if (!editMode || clientIsChoosed) {
        button.setAttribute("disabled", "");
      }
    }
    return () => {
      if (location.pathname === "/invoices/new") {
        if (clientIsChoosed) {
          dispatch(setClientIsChoosed(false));
        }
        dispatch(setEditMode(false));
      }
      if (location.pathname !== "/invoices/new") {
        if (editMode) {
          dispatch(setEditMode(false));
        }
        dispatch(setClientIsChoosed(false));
      }
    };
  }, [editMode, clientIsChoosed]);

  const editCustomerDetailHandler = () => {
    dispatch(setEditMode(true));
    dispatch(setClientIsChoosed(false));
    setInvoiceForm((prev) => {
      return {
        ...prev,
        clientDetail: {
          billingAddress: "",
          email: "",
          id: "",
          image: "",
          mobileNo: "",
          name: "",
        },
      };
    });
  };

  // console.log(invoiceForm);
  return (
    <Fragment>
      <div
        className={
          isExporting
            ? "flex flex-row pt-2 px-8"
            : "flex flex-col sm:flex-row pt-3 px-8"
        }
      >
        <div className="flex-1">
          <div className="flex flex-row">
            <div className="font-title font-bold">{title}</div>
            <div className="w-1/2 relative ml-3 flex" style={{ top: "-3px" }}>
              {!isViewMode && (
                <Button size="sm" outlined={1} onClick={openChooseClient}>
                  <ClientPlusIcon className="w-4 h-4" /> Exisiting
                </Button>
              )}
              {!isViewMode && (
                <div className="px-3">
                  <Button
                    size="sm"
                    outlined={1}
                    onClick={editCustomerDetailHandler}
                  >
                    <ClientPlusIcon className="w-4 h-4" /> Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-row w-full justify-between items-center mb-1 mt-3">
            <div className="font-title flex-1">
              {" "}
              {merchant === true ? "Merchant" : "Customer"} Name{" "}
            </div>
            <div className="font-title flex-1 text-right">
              <input
                autoComplete="nope"
                placeholder={`${
                  merchant === true ? "Merchant" : "Customer"
                } Name `}
                className={
                  defaultInputSmStyle +
                  " sm:text-left sm:w-11/12 md:w-3/4 text-right btn-disable"
                }
                value={
                  invoiceForm?.clientDetail?.name.slice(0, 1).toUpperCase() +
                  invoiceForm?.clientDetail?.name.slice(1, 50)
                }
                onChange={(e) => handlerInvoiceClientValue(e, "name")}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <div className="flex flex-row w-full justify-between items-center mb-1">
            <div className="font-title flex-1">
              {" "}
              {merchant === true ? "Merchant" : "Customer"} Number{" "}
            </div>
            <div className="font-title flex-1 text-right">
              <input
                autoComplete="nope"
                placeholder={`${
                  merchant === true ? "Merchant" : "Customer"
                } Number `}
                className={
                  defaultInputSmStyle +
                  " sm:text-left sm:w-11/12 md:w-3/4 text-right btn-disable"
                }
                value={invoiceForm?.clientDetail?.mobileNo}
                onChange={(e) => handlerInvoiceClientValue(e, "mobileNo")}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <div className="flex flex-row w-full justify-between items-center mb-1">
            <div className="font-title flex-1">
              {" "}
              {merchant === true ? "Merchant" : "Customer"} Address{" "}
            </div>
            <div className="font-title flex-1 text-right">
              <input
                autoComplete="nope"
                placeholder={`${
                  merchant === true ? "Merchant" : "Customer"
                } Address `}
                className={
                  defaultInputSmStyle +
                  " sm:text-left sm:w-11/12 md:w-3/4 text-right btn-disable"
                }
                value={invoiceForm?.clientDetail?.billingAddress}
                onChange={(e) => handlerInvoiceClientValue(e, "billingAddress")}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex flex-row justify-between items-center mb-1">
            <div className="font-title flex-1">
              {" "}
              {merchant === true ? "BILL No" : "INVOICE"} #{" "}
            </div>
            <div className="font-title flex-1 text-right">
              <input
                autoComplete="nope"
                placeholder={`${merchant === true ? "Bill No" : "INVOICE"}`}
                disabled={!merchant}
                className={defaultInputSmStyle + " text-right"}
                defaultValue={invoiceForm?.invoiceNo || invoiceNumber}
                onChange={(e) => handlerInvoiceValue(e, "invoiceNo")}
                onFocus={(e) => e.target.select()}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-1">
            <div className="font-title flex-1"> Creation Date </div>
            <div className="font-title flex-1 text-right">
              <NepaliDatePicker
                className={
                  !isViewMode
                    ? defaultInputSmStyle + " border-gray-300 text-right"
                    : " text-right bg-white"
                }
                disabled={true}
                setData={setInvoiceForm}
                name="createdDate"
                data={invoiceForm}
                value={invoiceForm?.createdDate}
                id={"nepali-datepicker-6"}
              />
            </div>
          </div>
          <div className="flex flex-row justify-between items-center mb-1">
            <div className="font-title flex-1"> Due Date </div>
            <div className="font-title flex-1 text-right">
              <NepaliDatePicker
                className={
                  !isViewMode
                    ? defaultInputSmStyle + " border-gray-300 text-right"
                    : " text-right bg-white"
                }
                id={"nepali-datepicker-7"}
                setData={setInvoiceForm}
                name="dueDate"
                data={invoiceForm}
                value={invoiceForm?.dueDate}
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
};
