import React, { useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { HiOutlineHome } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getShowNavbar,
  setToggleNavbar,
} from "../../stateManagement/slice/InitialMode";
import { getCompanyData } from "../../stateManagement/slice/companySlice";

const PAGE_TITLES = {
  dashboard: "Dashboard",
  transactions: "Transactions",
  invoices: "Invoices",
  customer: "Customer",
  merchant: "Merchant",
  products: "Products",
  purchases: "Purchases",
  salesreturn: "Sales Return",
  purchasesreturn: "Purchase Return",
  import: "Import",
  expenses: "Expenses",
  settings: "Business Profile",
  about: "About Dev",
};

function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const showNavbar = useSelector(getShowNavbar);
  const company = useSelector(getCompanyData);
  const toggleNavbar = useCallback(() => {
    dispatch(setToggleNavbar());
  }, [dispatch]);

  const pageTitle = useMemo(() => {
    const segment = pathname.split("/").filter(Boolean)[0];
    return PAGE_TITLES[segment] || "";
  }, [pathname]);

  const classes = useMemo(() => {
    const defaultClasses =
      "bg-white flex items-center pr-3 fixed w-full z-10 border-b border-slate-50 transition-all";

    if (!showNavbar) {
      return defaultClasses + " pl-3 ";
    }
    // Only shift the header for the persistent sidebar at sm+; below that
    // the sidebar is an overlay drawer, so shifting the header would push
    // the toggle button almost off-screen (matches Container.jsx's pl-72 breakpoint).
    return defaultClasses + " pl-3 sm:pl-72 ";
  }, [showNavbar]);

  return (
    <header className={classes}>
      <motion.button
        className="p-2 focus:outline-none rounded-md"
        onClick={toggleNavbar}
        aria-label={showNavbar ? "Collapse navigation menu" : "Expand navigation menu"}
        aria-expanded={showNavbar}
        initial={{
          translateX: 0,
        }}
        animate={{
          color: showNavbar ? "#777" : "#00a35c",
          rotate: showNavbar ? "360deg" : "0deg",
        }}
        transition={{
          type: "spring",
          damping: 25,
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </motion.button>
      {showNavbar && pageTitle && (
        <span className="hidden sm:block ml-2 text-lg font-semibold text-[#444444] truncate">
          {pageTitle}
        </span>
      )}
      <motion.div
        className="flex flex-1 text-2xl sm:text-3xl font-bold p-4 relative justify-center items-center"
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
      >
        {!showNavbar && (
          <motion.div
            className="relative font-bold font-title text-lg px-2 flex flex-row justify-center items-center cursor-pointer"
            initial={{
              translateX: "10vw",
              opacity: 0.8,
            }}
            animate={{
              translateX: 0,
              opacity: 1,
              color: "#00684a",
            }}
            transition={{
              type: "spring",
              damping: 20,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            <HiOutlineHome className="h-5 w-6 mb-[0.3rem] mr-1" />
            {company?.companyName || "Business Name"}
          </motion.div>
        )}
      </motion.div>
    </header>
  );
}

export default Navbar;
