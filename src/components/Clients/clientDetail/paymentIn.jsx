/* eslint-disable no-useless-escape */
import React, { useState, useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../Button/Button";
import SectionTitle from "../../Common/SectionTitle";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeStyle,
  defaultInputLargeInvalidStyle,
} from "../../../constants/defaultStyles";

import {
  createPayment,
  getFromClientByID,
} from "../../../stateManagement/slice/paymentSlice";
import { getClientDetailsSelector } from "../../../stateManagement/slice/clientSlice";
import { todayNepaliDate } from "../../Common/todayNepaliDate";
import NepaliDatePicker from "../../Common/NepaliDatePicker";

function PaymentIn({ merchant }) {
  const clientDetail = useSelector(getClientDetailsSelector);
  const emptyForm = {
    paymentType: merchant ? "PaymentOut" : "PaymentIn",
    paymentDate: todayNepaliDate(new Date()),
    amount: "",
    bankName: "",
    chequeNo: "",
  };
  const dispatch = useDispatch();
  const fromClientByID = useSelector(getFromClientByID);
  const [isTouched, setIsTouched] = useState(false);
  const [clientForm, setClientForm] = useState(emptyForm);
  const [isPaidInCash, setIsPaidInCash] = useState(true);
  const [isPaidInCheque, setIsPaidInCheque] = useState(false);
  const [isPaidInEsewa, setIsPaidInEsewa] = useState(false);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const handlerClientValue = useCallback(
    (event, keyName) => {
      let value = event.target.value;
      setClientForm((prev) => ({
        ...prev,
        partyDetails: {
          _id: clientDetail._id,
          name: clientDetail.name,
          email: clientDetail.email,
          totalAmountToPay: clientDetail.totalAmountToPay,
          clientType: clientDetail.clientType,
        },
      }));
      setClientForm((prev) => {
        return { ...prev, [keyName]: value };
      });
    },
    [clientDetail]
  );

  const submitHandler = useCallback(() => {
    setIsTouched(true);
    if (clientDetail.totalAmountToPay === 0) {
      toast.error(`${merchant ? "You" : "Client"} have paid all amount!`, {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    if (clientForm.amount > clientDetail.totalAmountToPay) {
      toast.error(
        `${merchant ? "You" : "Client"} can't pay more than ${
          clientDetail.totalAmountToPay
        }!`,
        {
          position: "bottom-center",
          autoClose: 2000,
        }
      );
      return;
    }
    const isValid = Object.keys(validForm).every((key) => validForm[key]); //If any key in validForm has a value of false), then isValid will be false.
    setClientForm(emptyForm);
    if (!isValid) {
      toast.error("Amount is required!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    const payload = {
      ...clientForm,
      note: isPaidInCash
        ? "Cash"
        : isPaidInEsewa
        ? "Esewa"
        : `${clientForm.bankName} / ${clientForm.chequeNo}`
    }; 
    dispatch(createPayment({ payload, fromClientByID, clientDetail }));
    setIsTouched(false);
    console.log(clientForm);
  }, [clientForm, validForm, dispatch, clientDetail, isPaidInCash, isPaidInEsewa, isPaidInCheque]);

  useEffect(() => {
    setValidForm(() => ({
      paymentDate: true,
      amount:
        clientForm?.amount > 0 &&
        clientForm?.amount < clientDetail.totalAmountToPay + 1,
      note: true,
    }));
  }, [clientForm]);

  return (
    <div className="bg-white rounded-xl p-4">
      <SectionTitle> Add Payment {merchant ? "Out" : "In"} </SectionTitle>
      <div className="flex mt-2">
        <div className="flex-1">
          <div>
            <NepaliDatePicker
              className={
                !validForm.paymentDate && isTouched
                  ? defaultInputLargeInvalidStyle
                  : defaultInputLargeStyle
              }
              id={"nepali-datepicker-3"}
              setData={setClientForm}
              data={clientForm}
              name="paymentDate"
              value={clientForm.paymentDate}
              disabledBeforeDate={true}
            />
          </div>
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          <input
            autoComplete="nope"
            placeholder="Client Name"
            className={defaultInputStyle}
            defaultValue={clientDetail?.name}
          />
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          <input
            autoComplete="nope"
            placeholder={
              clientDetail?.totalAmountToPay === 0
                ? "Settle"
                : merchant
                ? "Paid Amount"
                : "Received Amount"
            }
            type={"number"}
            className={
              !validForm.amount && isTouched
                ? defaultInputInvalidStyle
                : defaultInputStyle
            }
            value={clientForm.amount}
            disabled={clientDetail?.totalAmountToPay === 0}
            onChange={(e) => handlerClientValue(e, "amount")}
          />
        </div>
      </div>
      <div className="flex mt-2">
        <Button
          size="lg"
          onClick={() => {
            setIsPaidInCash(true);
            setIsPaidInEsewa(false);
            setIsPaidInCheque(false);
        }}
          active={isPaidInCash}
          inActive={!isPaidInCash}
          half={true}
          roundedSmall={true}
        >
          Cash
        </Button>
        <Button
          size="lg"
          inActive={!isPaidInCheque}
          active={isPaidInCheque}
          onClick={() => {
            setIsPaidInCash(false);
            setIsPaidInEsewa(false);
            setIsPaidInCheque(true);
        }}
          half={true}
          roundedSmall={true}
        >
          Cheque
        </Button>
        <Button
          size="lg"
          inActive={!isPaidInEsewa}
          active={isPaidInEsewa}
          onClick={() => {
            setIsPaidInCash(false);
            setIsPaidInEsewa(true);
            setIsPaidInCheque(false);
        }}
          half={true}
          roundedSmall={true}
        >
          Esewa
        </Button>
      </div>
      {
        isPaidInCheque && (
          <>
            <div className="flex mt-2">
              <div className="flex-1">
                <input
                  autoComplete="nope"
                  placeholder="Bank Name"
                  className={defaultInputStyle}
                  value={clientForm.bankName}
                  onChange={(e) => handlerClientValue(e, "bankName")}
                />
              </div>
            </div>
            <div className="flex mt-2">
              <div className="flex-1">
                <input
                  autoComplete="nope"
                  placeholder="Cheque Number"
                  className={defaultInputStyle}
                  value={clientForm.chequeNo}
                  onChange={(e) => handlerClientValue(e, "chequeNo")}
                />
              </div>
            </div>
          </>
        ) 
      }

      <div className="mt-3">
        <Button onClick={submitHandler} block={1}>
          <span className="inline-block ml-2">
            {" "}
            {merchant ? "Give Payment" : "Receive Payment"}{" "}
          </span>
        </Button>
      </div>
    </div>
  );
}

export default PaymentIn;
