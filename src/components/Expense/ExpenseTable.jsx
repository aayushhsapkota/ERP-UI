import React, { useCallback, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  setExpenseSearchBy,
  setExpenseFilterBy,
  setExpenseSortBy,
  setEditedId,
  setExpenseById,

  getExpenseDateSelector,
  setExpenseDateFilterOpen,
  getExpenseDateFilterOpenSelector
} from "../../stateManagement/slice/expenseSlice";

import ProductIDIcon from "../Icons/ProductIDIcon";
import Pagination from "../Pagination";
import EmptyBar from "../Common/EmptyBar";

import { defaultSearchStyle } from "../../constants/defaultStyles";
import { BiFilter } from "react-icons/bi";
import Button from "../Button/Button";
import { todayNepaliDate } from "../Common/todayNepaliDate";

// import NepaliDateConverter from "../Common/nepaliDateConverter";


function ExpenseTable({
  showAdvanceSearch = false,

  allExpenses,
  searchBy,
  filterBy,
  sortBy,
  pageCount,
  currentPage,
  initLoading,
  setPageNumber,
  handleSelect,
  openModal = false,
  date,
}) {
  const dispatch = useDispatch();
  const [searchForm, setSearchForm] = useState(searchBy);
  const defaultTdContent =
    "w-full flex flex-wrap flex-row items-center justify-start text-[12px] sm:text-base my-1";
  const defaultTdContentSecond =
    "w-full flex flex-wrap flex-row items-center justify-end text-[12px] sm:text-base my-1";

  const handlerSearchValue = useCallback(
    (event, keyName) => {
      const { value } = event.target;
      setSearchForm((prev) => ({ ...prev, [keyName]: value }));
      dispatch(setExpenseSearchBy({ ...searchForm, [keyName]: value }));
    },
    [searchForm]
  );
  const handlerFilterValue = useCallback((value) => {
    dispatch(setExpenseFilterBy(value));
  });
  const handlerSortValue = useCallback((value) => {
    dispatch(setExpenseSortBy(value));
  });

  const handleAction = useCallback(
    (item) => {
      console.log(item);
      dispatch(setEditedId(item._id));
      dispatch(setExpenseById(item));
    },
    []
    // [dispatch, id]
    // [dispatch]
  );
 
  const expenseFIlterOpen=useSelector(getExpenseDateFilterOpenSelector);

  const yoo = () => {
    try {
      dispatch(setExpenseDateFilterOpen(true));
    } catch (error) {
      console.error('Error occurred while dispatching action:', error);
    }
  };

  // useEffect(() => {
  //   console.log('expenseFIlterOpen:', expenseFIlterOpen);
  // }, [expenseFIlterOpen]);

  // useEffect(() => {
  //   console.log(date.startDate);
  // }, [date]);


  return (
    <>
      {showAdvanceSearch === true && (
        <div className="bg-white rounded-xl px-3 py-3 mb-3">
          <div className="font-title mb-2">Advanced Search</div>
          <div className="flex w-full flex-col sm:flex-row">
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <ProductIDIcon
                  className={`w-6 h-6 ${
                    searchBy.name !== "" ? "text-[#00684a96]" : "text-gray-400"
                  }`}
                />
              </div>
              <input
                autoComplete="nope"
                value={searchForm.name}
                placeholder="Search by expense name"
                className={defaultSearchStyle}
                onChange={(event) => handlerSearchValue(event, "name")}
              />
            </div>
            <div className="mb-2 sm:mb-0 sm:text-left text-default-color flex flex-row font-title flex-1 px-2">
              {/* <div className="h-12 w-12 rounded-2xl bg-gray-100 mr-2 flex justify-center items-center text-gray-400">
                <TbListSearch
                  className={`w-6 h-6 ${
                    searchBy.anything !== ""
                      ? "text-[#00684a96]"
                      : "text-gray-400"
                  }`}
                />
              </div> */}
              {/* <input
                autoComplete="nope"
                value={searchForm.anything}
                placeholder="Search anything"
                className={defaultSearchStyle}
                onChange={(event) => handlerSearchValue(event, "anything")}
                title="Ex: product code, brand name etc."
              /> */}

              <div
                type="button"
                className={`h-12 w-12 rounded-2xl bg-gray-100 ml-2 flex justify-center items-center cursor-pointer
                `}
                onClick={() => {
                  yoo();
                  console.log(filterBy);
                  console.log(sortBy);
                  console.log(date.startDate);
                  console.log(date.endDate);
                  
                  // yeta herr
                }}
                title={filterBy !== "" || sortBy !== 1 ? "Filtering" : "Filter"}
              >
                <BiFilter
                  className={`h-7 w-7                 ${
                    filterBy !== "" ||
                    sortBy !== 1 ||
                    date.startDate !== "" ||
                    date.endDate !== todayNepaliDate(new Date())
                      ? "text-[#f5101096] animate-pulse"
                      : "text-gray-400"
                  }`}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        {initLoading !== "loading" &&
          allExpenses.length > 0 &&
          allExpenses?.map((expense, index) => (
            <div
              className={
                `bg-white rounded-xl py-1 cursor-pointer` +
                (openModal ? " mb-2 px-1" : " mb-4 px-3")
              }
              key={index}
              // onClick={() => !openModal && goToProductDetail(product)}
              onClick={() => handleAction(expense)}
            >
              {openModal ? (
                <div className="flex flex-wrap justify-between items-center p-2">
                  <div className={" font-semibold"}>{expense.title}</div>
                  <div className={" hidden sm:block font-semibold"}>
                    {expense.category}{" "}
                    <span
                    // className={`font-normal text-sm ${
                    //   product.quantity <= product.lowQuantityAlert
                    //     ? " text-red-500 "
                    //     : ""
                    // }`}
                    >
                      ( {expense.quantity?.toFixed(2)}{" "}
                      <span className="font-normal text-xs">
                        {/* "{product.primaryUnit}" */}
                      </span>{" "}
                      )
                    </span>
                  </div>
                  <div className={""}>
                    <Button roundedSmall onClick={() => handleSelect(expense)}>
                      select
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-4 p-2">
                  <div className="flex-col flex-1">
                    <div
                      className={
                        defaultTdContent +
                        "font-bold text-[18px] sm:text-[20px]"
                      }
                    >
                      <button
                        className="whitespace-nowrap text-ellipsis mb-0.5 overflow-hidden text-[#000] cursor-pointer"
                        onClick={() => {}}
                      >
                        {expense.title}
                      </button>
                    </div>
                    <div className={defaultTdContent + " text-gray-500 "}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Price
                      </span>
                    </div>
                    <div className={defaultTdContent}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                        {/* Rs. {product.price}/{product.primaryUnit} */}
                        Rs. {expense.amount}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col flex-1 flex items-center justify-end">
                    <div
                      className={
                        "pb-1 flex items-center justify-center w-full flex-wrap" +
                        " text-gray-500 "
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Created At:
                      </span>
                    </div>
                    <div
                      className={
                        "pb-1 flex items-center justify-center w-full flex-wrap text-[12px] sm:text-base"
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                      
                      

                        <span className="whitespace-nowrap text-ellipsis overflow-hidden">
                          {expense.createdDate}
                           
                        </span>

                        {/* {(
                          <NepaliDateConverter
                            date={new Date(
                              expense.createdAt
                            ).toLocaleDateString()}
                          />
                        ) || "n/a"} */}
                      </span>
                    </div>
                  </div>
                  <div className="flex-col flex-1">
                    <div
                      className={
                        defaultTdContentSecond +
                        "font-bold text-[12px] text-gray-500 mb-[0.8rem] sm:mb-0 sm:text-[13px]"
                      }
                    >
                      <span className="whitespace-nowrap text-ellipsis mb-0.5 overflow-hidden cursor-pointer">
                        {expense.category}
                      </span>
                    </div>
                    <div className={defaultTdContentSecond + " text-gray-500 "}>
                      <span className="whitespace-nowrap text-ellipsis overflow-hidden text-[11px] sm:text-[15px]">
                        Remarks
                      </span>
                    </div>
                    <div className={defaultTdContentSecond}>
                      <span
                      // className={`whitespace-nowrap text-ellipsis overflow-hidden  ${
                      //   product.quantity <= product.lowQuantityAlert
                      //     ? " text-red-500 "
                      //     : ""
                      // }`}
                      >
                        {expense?.remarks}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        {(allExpenses.length <= 0 || initLoading === "loading") && (
          <EmptyBar initLoading={initLoading} />
        )}
        {allExpenses.length > 0 && initLoading !== "loading" && (
          <Pagination
            pageCount={pageCount}
            currentPage={currentPage}
            setPageNumber={setPageNumber}
          />
        )}
      </div>
    </>
  );
}

export default ExpenseTable;
