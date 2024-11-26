import React, { useState, useCallback, useMemo, useEffect } from "react";
import { todayNepaliDate } from "../Common/todayNepaliDate";


import Skeleton from "react-loading-skeleton";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import Button from "../Button/Button";
import ImageUpload from "../Common/ImageUpload";
import SectionTitle from "../Common/SectionTitle";
import {
  defaultInputStyle,
  defaultInputInvalidStyle,
  defaultInputLargeInvalidStyle,
  defaultInputLargeStyle,
  defaultSkeletonLargeStyle,
  defaultSkeletonNormalStyle,
} from "../../constants/defaultStyles";
import {
  createExpense,
  getExpenseNewForm,
  updateNewExpenseFormField,
  getExpenseStatus,
} from "../../stateManagement/slice/expenseSlice";
import { Dropdown } from "./dropdown";

const emptyForm = {
  title: "",
  image: "",
  category: "",
  amount: 0,
  remarks: "",
  // date:todayNepaliDate(new Date())
};

function QuickAddExpense() {
  const dispatch = useDispatch();
  const expenseNewForm = useSelector(getExpenseNewForm);
  const isInitLoading = useSelector(getExpenseStatus) === "loading";
  const [isTouched, setIsTouched] = useState(false);
  const [expenseForm, setExpenseForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const onChangeImage = useCallback(
    (str) => {
      setExpenseForm((prev) => ({ ...prev, image: str }));
      dispatch(updateNewExpenseFormField({ key: "image", value: str }));
    },
    [dispatch]
  );

  const handlerExpenseValue = useCallback(
    (event, keyName) => {
      if (
        keyName === "category" 
      ) {
        const value = event.target.textContent;
        if (value === "Choose Category") return;
        setExpenseForm((prev) => {
          return { ...prev, [keyName]: value };
        });
        dispatch(updateNewExpenseFormField({ key: keyName, value }));
        return;
      }
      const value = event.target.value;
      setExpenseForm((prev) => {
        return { ...prev, [keyName]: value };
      });

      dispatch(updateNewExpenseFormField({ key: keyName, value }));
    },
    [dispatch]
  );

  const submitHandler = useCallback(() => {
    setIsTouched(true);
    const isValid = Object.keys(validForm).every((key) => validForm[key]);

    if (!isValid) {
      toast.error("Invalid Expense Form!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      
      return;
    }
    console.log(expenseForm);
    dispatch(createExpense(expenseForm));
    setIsTouched(false);
  }, [expenseForm, dispatch, validForm]);

  const imageUploadClasses = useMemo(() => {
    const defaultStyle = "rounded-xl ";

    if (!expenseForm?.image) {
      return defaultStyle + " border-dashed border-2 border-indigo-400";
    }

    return defaultStyle;
  }, [expenseForm]);

  useEffect(() => {
    setValidForm((prev) => ({
      title: !!expenseForm.title,
      image: true,
      category: !!expenseForm.category,
      amount: !!expenseForm.amount,
      remarks: true,
    }));
  }, [expenseForm]);

  useEffect(() => {
    if (expenseNewForm) {
      setExpenseForm(expenseNewForm);
    }
  }, [expenseNewForm]);

  return (
    <div className="bg-white rounded-xl p-4">
      <SectionTitle> Quick Add Expense </SectionTitle>
      <div className="flex mt-2">
        {isInitLoading ? (
          <Skeleton className="skeleton-input-radius skeleton-image border-dashed border-2" />
        ) : (
          <ImageUpload
            keyName="QuickEditImageUpload"
            className={imageUploadClasses}
            url={expenseForm?.image}
            folder="expenses"
            onChangeImage={onChangeImage}
          />
        )}

        <div className="flex-1 pl-3 text-sm">
          {isInitLoading ? (
            <Skeleton className={defaultSkeletonLargeStyle} />
          ) : (
            <div>
              <input
                autoComplete="nope"
                value={expenseForm?.title}
                placeholder="Expense Title"
                className={!validForm["title"] && isTouched
                  ? defaultInputLargeInvalidStyle
                  : defaultInputLargeStyle}
                onChange={(e) => handlerExpenseValue(e, "title")}
                disabled={isInitLoading}
               
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-3 relative">
        <div className="font-title text-sm text-default-color">Category</div>
        <div className="flex">
          <div className="flex-1 text-sm">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <Dropdown
                name="category"
                handlerExpenseValue={handlerExpenseValue}
                expenseForm={expenseForm}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-3 relative">
        <div className="font-title text-sm text-default-color">Amount</div>
        <div className="flex">
          <div className="flex-1 text-sm">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <div>
              <input
                autoComplete="nope"
                value={expenseForm?.amount}
                placeholder="Amount"
                className={!validForm["amount"] && isTouched
                ? defaultInputInvalidStyle
                : defaultInputStyle}
                onChange={(e) => handlerExpenseValue(e, "amount")}
                disabled={isInitLoading}
              />
            </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-3 relative">
        <div className="font-title text-sm text-default-color">Remarks</div>
        <div className="flex">
          <div className="flex-1 text-sm">
            {isInitLoading ? (
              <Skeleton className={defaultSkeletonNormalStyle} />
            ) : (
              <div>
              <input
                autoComplete="nope"
                value={expenseForm?.remarks}
                placeholder="Expense Remarks"
                className={defaultInputLargeStyle}
                onChange={(e) => handlerExpenseValue(e, "remarks")}
                disabled={isInitLoading}
              />
            </div>
            )}
          </div>
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

export default QuickAddExpense;
