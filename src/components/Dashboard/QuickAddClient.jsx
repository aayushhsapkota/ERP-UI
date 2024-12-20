/* eslint-disable no-useless-escape */
import React, { useState, useCallback, useMemo, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import ImageUpload from "../Common/ImageUpload";
import SectionTitle from "../Common/SectionTitle";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeStyle,
  defaultInputLargeInvalidStyle,
  defaultSkeletonLargeStyle,
  defaultSkeletonNormalStyle,
} from "../../constants/defaultStyles";
import {
  getClientNewForm,
  updateNewClientFormField,
  getClientStatus,
  createClient,
} from "../../stateManagement/slice/clientSlice";
import { todayNepaliDate } from "../Common/todayNepaliDate";
import { NotifySuccess } from "../../toastify";

const emptyForm = {
  id: "",
  image: "",
  name: "",
  email: "",
  billingAddress: "",
  mobileNo: "",
  secmobileNo: "",
  vatNumber: "",
  openingBalance: "",
  clientType: "",
};

function QuickAddClient({ merchant }) {
  const dispatch = useDispatch();
  const clientNewForm = useSelector(getClientNewForm);
  const isInitLoading = useSelector(getClientStatus) === "loading";

  const [isTouched, setIsTouched] = useState(false);
  const [clientForm, setClientForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const onChangeImage = useCallback(
    (str) => {
      setClientForm((prev) => ({ ...prev, image: str }));
      dispatch(updateNewClientFormField({ key: "image", value: str }));
    },
    [dispatch]
  );

  const handlerClientValue = useCallback(
    (event, keyName) => {
      const value = event.target.value;

      setClientForm((prev) => {
        return { ...prev, [keyName]: value };
      });

      dispatch(updateNewClientFormField({ key: keyName, value }));
    },
    [dispatch]
  );

  const submitHandler = useCallback(() => {
    setIsTouched(true);

    const isValid = Object.keys(validForm).every((key) => validForm[key]);

    if (!isValid) {
      toast.error("Invalid Client Form!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    dispatch(
      createClient({
        ...clientForm,
        clientType: merchant === true ? "Merchant" : "Customer",
        createdDate: todayNepaliDate(new Date()),
      })
    );
    console.log(clientForm);
    setIsTouched(false);
  }, [clientForm, dispatch, validForm]);

  const imageUploadClasses = useMemo(() => {
    const defaultStyle = "rounded-xl ";

    if (!clientForm.image) {
      return defaultStyle + " border-dashed border-2 border-indigo-400 ";
    }

    return defaultStyle;
  }, [clientForm]);

  useEffect(() => {
    setValidForm(() => ({
      id: true,
      image: true,
      name: clientForm?.name?.trim() ? true : false,
      email: true,
      billingAddress: merchant
        ? true
        : clientForm?.billingAddress?.trim()
        ? true
        : false,
      mobileNo: merchant ? true : clientForm?.mobileNo?.trim() ? true : false,
      secmobileNo: true,
      vatNumber: true,
      openingBalance: true,
    }));
  }, [clientForm]);

  useEffect(() => {
    if (clientNewForm) {
      setClientForm(clientNewForm);
    }
  }, [clientNewForm]);

  // console.log(clientForm);

  return (
    <div className="bg-white rounded-xl p-4">
      <SectionTitle>
        {" "}
        Add New {merchant === true ? "Merchant" : "Customer"}{" "}
      </SectionTitle>
      <div className="flex mt-2">
        {isInitLoading ? (
          <Skeleton className="skeleton-input-radius skeleton-image border-dashed border-2" />
        ) : (
          <ImageUpload
            keyName="QuickEditImageUpload"
            className={imageUploadClasses}
            url={!clientForm?.image ? "" : clientForm?.image}
            folder="clients"
            onChangeImage={onChangeImage}
          />
        )}

        <div className="flex-1 pl-3">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonLargeStyle} />
          ) : (
            <div>
              <input
                autoComplete="nope"
                value={clientForm.name}
                placeholder="User Name"
                className={
                  !validForm.name && isTouched
                    ? defaultInputLargeInvalidStyle
                    : defaultInputLargeStyle
                }
                onChange={(e) => handlerClientValue(e, "name")}
                disabled={isInitLoading}
              />
            </div>
          )}
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonNormalStyle} />
          ) : (
            <input
              autoComplete="nope"
              placeholder="Email Address"
              className={
                !validForm.email && isTouched
                  ? defaultInputInvalidStyle
                  : defaultInputStyle
              }
              disabled={isInitLoading}
              value={clientForm.email}
              onChange={(e) => handlerClientValue(e, "email")}
            />
          )}
        </div>
      </div>
      <div className="flex mt-2">
        <div className="flex-1">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonNormalStyle} />
          ) : (
            <input
              autoComplete="nope"
              placeholder="Mobile No"
              className={
                !validForm.mobileNo && isTouched
                  ? defaultInputInvalidStyle
                  : defaultInputStyle
              }
              disabled={isInitLoading}
              value={clientForm.mobileNo}
              onChange={(e) => handlerClientValue(e, "mobileNo")}
            />
          )}
        </div>
      </div>
      {merchant !== true ? (
        <div className="flex mt-2">
          <div className="flex-1">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <input
                autoComplete="nope"
                placeholder="Secondary Mobile No"
                className={
                  !validForm.secmobileNo && isTouched
                    ? defaultInputInvalidStyle
                    : defaultInputStyle
                }
                disabled={isInitLoading}
                value={clientForm.secmobileNo}
                onChange={(e) => handlerClientValue(e, "secmobileNo")}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="flex mt-2">
          <div className="flex-1">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <input
                autoComplete="nope"
                placeholder="VAT or PAN Number"
                className={
                  !validForm.vatNumber && isTouched
                    ? defaultInputInvalidStyle
                    : defaultInputStyle
                }
                disabled={isInitLoading}
                value={clientForm.vatNumber}
                onChange={(e) => handlerClientValue(e, "vatNumber")}
              />
            )}
          </div>
        </div>
      )}
      <div className="flex mt-2">
        <div className="flex-1">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonNormalStyle} />
          ) : (
            <input
              autoComplete="nope"
              placeholder="Billing Address"
              className={
                !validForm.billingAddress && isTouched
                  ? defaultInputInvalidStyle
                  : defaultInputStyle
              }
              disabled={isInitLoading}
              value={clientForm.billingAddress}
              onChange={(e) => handlerClientValue(e, "billingAddress")}
            />
          )}
        </div>
      </div>

      <div className="flex mt-2">
        <div className="flex-1">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonNormalStyle} />
          ) : (
            <input
              autoComplete="nope"
              placeholder="Opening Balance"
              type={"number"}
              className={
                !validForm.openingBalance && isTouched
                  ? defaultInputInvalidStyle
                  : defaultInputStyle
              }
              disabled={isInitLoading}
              value={clientForm.openingBalance}
              onChange={(e) => handlerClientValue(e, "openingBalance")}
            />
          )}
        </div>
      </div>

      <div className="mt-3">
        <Button onClick={submitHandler} block={1}>
          <span className="inline-block ml-2"> Submit </span>
        </Button>
      </div>
    </div>
  );
}

export default QuickAddClient;
