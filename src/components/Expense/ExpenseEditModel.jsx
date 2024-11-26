/* eslint-disable no-useless-escape */
import React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import {
  getExpenseByIdSelector,
  getEditedIdForm,
  setEditedId,
  setDeleteId,
  updateExpense,
} from "../../stateManagement/slice/expenseSlice";
import ImageUpload from "../Common/ImageUpload";
import {
  defaultInputInvalidStyle,
  defaultInputStyle,
} from "../../constants/defaultStyles";
import { EditDropdown } from "./dropdown";

function ExpenseEditModel() {
  const emptyForm = {
    title: "",
    image: "",
    category: "",
    amount: 0,
    remarks: "",
  };

  const dispatch = useDispatch();
  const editedID = useSelector(getEditedIdForm);
  const expense = useSelector(getExpenseByIdSelector);

  const [animate, setAnimate] = useState(true);
  const [isTouched, setIsTouched] = useState(false);

  const [expenseForm, setExpenseForm] = useState(emptyForm);
  const [validForm, setValidForm] = useState(
    Object.keys(emptyForm).reduce((a, b) => {
      return { ...a, [b]: false };
    }, {})
  );

  const onEditHandler = useCallback(() => {
    setIsTouched(true);
    const isValid = Object.keys(validForm).every((key) => validForm[key]);

    if (!isValid) {
      toast.error("Invalid Expense Form!", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    toast.success("Expense Updated Successfully!", {
      position: "bottom-center",
      autoClose: 2000,
    });
    dispatch(updateExpense(expenseForm));
    setIsTouched(false);
  }, [dispatch, validForm, expenseForm]);

  const handleDelete = useCallback(() => {
    dispatch(setDeleteId(editedID));
    dispatch(setEditedId(null));
  }, [dispatch, editedID]);

  const handlerExpenseValue = useCallback((event, keyName) => {
    let value;
    if (keyName === "title" || keyName === "amount" || keyName === "remarks") {
      value = event.target.value;
    } else {
      value = event.target.textContent;
    }
    if (value === "Choose Category") return;
    setExpenseForm((prev) => {
      return { ...prev, [keyName]: value };
    });
  }, []);

  const onChangeImage = useCallback((str) => {
    setExpenseForm((prev) => ({ ...prev, image: str }));
  }, []);

  const onCancelHandler = useCallback(() => {
    dispatch(setEditedId(null));
  }, [dispatch]);

  const imageUploadClasses = useMemo(() => {
    const defaultStyle = "rounded-xl ";
    if (!expenseForm.image) {
      return defaultStyle + " border-dashed border-2 border-indigo-400 ";
    }
    return defaultStyle;
  }, [expenseForm]);

  useEffect(() => {
    setValidForm((prev) => ({
      id: true,
      title: !!expenseForm.title,
      image: true,
      category: !!expenseForm.category,
      amount: !!expenseForm.amount,
      remarks: true,
    }));
  }, [expenseForm]);

  useEffect(() => {
    if (editedID !== null) {
      setAnimate(true);
      setExpenseForm({ ...expense });
    } else {
      setAnimate(false);
    }
  }, [editedID, expense]);

  return editedID !== null ? (
    <motion.div
      className="modal-container"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      initial={{
        opacity: 0,
      }}
      animate={{
        opacity: animate ? 1 : 0,
      }}
      transition={{
        type: "spring",
        damping: 18,
      }}
    >
      <div className="relative">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-full p-2 sm:p-0">
            <div className="relative bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-5 pb-4 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 sm:mt-0 sm:ml-4 text-left w-full">
                    <h3
                      className="text-lg  text-center leading-6 font-medium text-gray-900"
                      id="modal-title"
                    >
                      Edit Expense Form
                    </h3>
                    <div className="mt-2">
                      <div className="bg-white rounded-xl mt-4">
                        <div className="flex mt-2">
                          <ImageUpload
                            keyName="QuickEditImageUpload"
                            className={imageUploadClasses}
                            url={expenseForm.image}
                            onChangeImage={onChangeImage}
                          />

                          <div className="flex-1 pl-3">
                            <div>
                              <input
                                value={expenseForm.title}
                                placeholder="Expense title"
                                className={
                                  !validForm.title && isTouched
                                    ? defaultInputInvalidStyle
                                    : defaultInputStyle
                                }
                                onChange={(e) =>
                                  handlerExpenseValue(e, "title")
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="font-title text-sm text-default-color">
                            Amount
                          </div>
                          <div className="flex">
                            <div className="flex-1">
                              <input
                                placeholder="Amount"
                                className={
                                  !validForm.amount && isTouched
                                    ? defaultInputInvalidStyle
                                    : defaultInputStyle
                                }
                                value={expenseForm.amount}
                                onChange={(e) =>
                                  handlerExpenseValue(e, "amount")
                                }
                              />
                            </div>
                          </div>
                        </div>

                        <div className="mt-2">
                          <div className="font-title text-sm text-default-color">
                            Category
                          </div>
                          <div className="flex">
                            <div className="flex-1">
                              <EditDropdown
                                name="category"
                                handlerExpenseValue={handlerExpenseValue}
                                expenseForm={expenseForm}
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div className="font-title text-sm text-default-color">
                            Remarks
                          </div>
                          <div className="flex">
                            <div className="flex-1">
                              <input
                                placeholder="Remarks"
                                className={
                                  !validForm.remarks && isTouched
                                    ? defaultInputInvalidStyle
                                    : defaultInputStyle
                                }
                                value={expenseForm.remarks}
                                onChange={(e) =>
                                  handlerExpenseValue(e, "remarks")
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onEditHandler}
                >
                  Edit
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-rose-300 shadow-sm px-4 py-2 bg-rose-600 text-base font-medium text-white hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleDelete}
                >
                  Delete
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={onCancelHandler}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  ) : null;
}

export default ExpenseEditModel;
