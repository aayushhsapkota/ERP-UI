import React from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Common/PageTitle";
import ExpenseTable from "../../components/Expense/ExpenseTable";
import QuickAddExpense from "../../components/Expense/QuickAddExpense";
// import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";

import {
  getAllExpenses,
  getAllExpenseSelector,
  getExpensePageCountSelector,
  getExpensePageNumberSelector,
  setExpensePageNumber,
  getExpenseStatus,
  getExpenseSearchBySelector,
  getExpenseFilterBySelector,
  getExpenseSortBySelector,
  getExpenseDateSelector,

} from "../../stateManagement/slice/expenseSlice";

function ExpenseListScreen() {
  const dispatch = useDispatch();
  const allExpenses = useSelector(getAllExpenseSelector);
  const initLoading = useSelector(getExpenseStatus);
  const page = useSelector(getExpensePageNumberSelector);
  const pageCount = useSelector(getExpensePageCountSelector);
  const searchBy = useSelector(getExpenseSearchBySelector);
  const filterBy = useSelector(getExpenseFilterBySelector);
  const sortBy = useSelector(getExpenseSortBySelector);
  const [pageNumber, setPageNumber] = React.useState(page);
  const date= useSelector(getExpenseDateSelector);

  React.useEffect(() => {
    if (allExpenses.length === 0 || page || page !== pageNumber) {
      setPageNumber(page);
      dispatch(
        getAllExpenses({
          page: page,
          searchBy: searchBy,
          filterBy: filterBy,
          sortBy: sortBy,
          date:date
        })
      );
    }
  }, [dispatch, allExpenses.length, page, searchBy, filterBy, sortBy, date]);
  return (
    <div className="overflow-hidden">
      {/* <div className="p-4">
        <PageTitle title="Expenses" />
      </div> */}
      <div className="py-4 px-6 sm:pl-6 sm:pr-2 capitalize flex justify-between items-center">
        <PageTitle title="Expenses" />
        {/* <Menu
          menuButton={
            <MenuButton>
              <div className="bg-gray-50 px-2 rounded-xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#00684a9c]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </div>
            </MenuButton>
          }
          transition
        >
          <MenuItem onClick={() => handleAction(expenseDetails)}>
            Action
          </MenuItem>
        </Menu> */}
      </div>

      <div className="flex flex-wrap">
        <div className="w-full lg:w-4/6 px-4 mb-2 sm:mb-2">
          <ExpenseTable
            showAdvanceSearch
            allExpenses={allExpenses}
            initLoading={initLoading}
            pageCount={pageCount}
            currentPage={page}
            setPageNumber={setExpensePageNumber}
            searchBy={searchBy}
            filterBy={filterBy}
            sortBy={sortBy}
            date={date}
          />
        </div>
        <div className="w-full lg:w-2/6 px-4 mb-4 sm:mb-2">
          <QuickAddExpense />
        </div>
      </div>
    </div>
  );
}

export default ExpenseListScreen;
