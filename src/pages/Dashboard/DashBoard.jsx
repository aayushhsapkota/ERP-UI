import { useSelector } from "react-redux";
import Revenue from "../../components/Dashboard/Revenue";
import Purchase from "../../components/Dashboard/Purchase";
import Expenses from "../../components/Dashboard/Expenses";
import Category from "../../components/Dashboard/Category";
import Stock from "../../components/Dashboard/Stock";
import CashFlow from "../../components/Dashboard/CashFlow";
import RecAndPay from "../../components/Dashboard/RecAndPay";
import { getShowNavbar } from "../../stateManagement/slice/InitialMode";
import DayBook from './../../components/Dashboard/DayBook';

const DashBoard = () => {
  const showNavbar = useSelector(getShowNavbar);
  return (
    <div className={`${!showNavbar && "flex justify-center"}`}>
      <div
        className={`grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 ${
          !showNavbar ? "md:grid-cols-2 md:gap-6" : ""
        } xl:gap-10 lg:gap-6 gap-10 xl:px-12 md:px-6 px-2 mb-10`}
      >
        <Revenue />
        <Expenses />
        <Purchase />
        <CashFlow />
        <Category />
        {/* <Stock /> */}
        <RecAndPay />
        <DayBook />
      </div>
    </div>
  );
};

export default DashBoard;
