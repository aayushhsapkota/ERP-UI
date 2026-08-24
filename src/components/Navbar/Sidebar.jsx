import React, { useCallback, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { HiOutlineHome } from "react-icons/hi";
import { BiImport } from "react-icons/bi";
import { CiImport } from "react-icons/ci";
import { RiExchangeLine } from "react-icons/ri";
import { AiOutlinePlus, AiOutlineDashboard, AiOutlineShop } from "react-icons/ai";
import ProductIcon from "../Icons/ProductIcon";
import InvoiceIcon from "../Icons/InvoiceIcon";
import ClientPlusIcon from "../Icons/ClientPlusIcon";
import SecurityIcon from "../Icons/SecurityIcon";
import { logout } from "../../stateManagement/slice/authSlice";
import { getCompanyData } from "../../stateManagement/slice/companySlice";
import {
  getShowNavbar,
  setNavbarFalse,
  setToggleNavbar,
} from "../../stateManagement/slice/InitialMode";

// Below this width the sidebar behaves as an overlay drawer rather than a
// persistent pinned nav — matches the `sm` breakpoint Container.jsx and
// Navbar.jsx use to decide whether page content shifts to make room for it.
const MOBILE_OVERLAY_BREAKPOINT = 640;

const NAV_DATA = [
  {
    title: "Dashboard",
    link: "dashboard",
    Icon: AiOutlineDashboard,
  },
  {
    title: "Transactions",
    link: "transactions",
    Icon: RiExchangeLine,
  },
  {
    title: "Customer",
    link: "customer",
    Icon: ClientPlusIcon,
  },
  {
    title: "Merchant",
    link: "merchant",
    Icon: ClientPlusIcon,
  },
  {
    title: "Products",
    link: "products",
    Icon: ProductIcon,
  },
  {
    title: "Import",
    link: "import",
    Icon: BiImport,
  },
  {
    title: "Expenses",
    link: "expenses",
    Icon: CiImport,
  },
  {
    title: "Business Profile",
    link: "settings/business-profile",
    Icon: AiOutlineShop,
  },
];

const navDefaultClasses =
  "fixed inset-0 duration-200 transform z-10 w-72 bg-white h-screen p-3 overflow-y-auto";

const navItemDefaultClasses = "block px-4 py-2 rounded-md flex flex-1";

function Sidebar() {
  const dispatch = useDispatch();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const navigate = useNavigate();
  const showNavbar = useSelector(getShowNavbar);
  const toggleNavbar = useCallback(() => {
    dispatch(setToggleNavbar());
  }, [dispatch]);
  const { pathname } = useLocation();
  const company = useSelector(getCompanyData);

  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure want to logout?')) {
      dispatch(logout())
        .then(() => {
          // After a successful logout, refresh the page
          window.location.reload();
        });
    }
  }, [dispatch, navigate]);
  

  const onClickNavbar = useCallback(() => {
    const isMobile = window.innerWidth < MOBILE_OVERLAY_BREAKPOINT;
    if (isMobile) {
      toggleNavbar();
    }
  }, [toggleNavbar]);

  const aboutRoute = useMemo(() => pathname === "/about", [pathname]);

  // Let Escape dismiss the drawer, but only in overlay mode — on a pinned
  // desktop sidebar, Escape is likely meant for something else (e.g. a modal).
  useEffect(() => {
    if (!showNavbar) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && window.innerWidth < MOBILE_OVERLAY_BREAKPOINT) {
        dispatch(setNavbarFalse());
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showNavbar, dispatch]);

  return (
    <>
      {showNavbar && (
        <div
          className="fixed inset-0 z-[9] bg-black/40 sm:hidden"
          onClick={toggleNavbar}
          aria-hidden="true"
        />
      )}
      <nav
        className={
          showNavbar
            ? navDefaultClasses + " translate-x-0 ease-in"
            : navDefaultClasses + " -translate-x-full ease-out"
        }
      >
        <div className="flex justify-between">
          <motion.span
            className="font-bold font-title text-base py-4 px-2.5 flex justify-center items-center tracking-wide cursor-pointer"
            initial={{
              translateX: -300,
            }}
            animate={{
              translateX: showNavbar ? -40 : -300,
              color: "#00684a",
            }}
            transition={{
              type: "spring",
              damping: 18,
            }}
            onClick={() => {
              navigate("/");
            }}
          >
            <span className="nav-loading">
              <HiOutlineHome className="h-5 w-6 mb-[0.4rem] ml-11" />
            </span>
            {company?.companyName || "Business Name"}
          </motion.span>
        </div>

        <ul className="mt-4">
          <NavLink to="/invoices/new">
            {({ isActive }) => {
              return (
                <li className="flex justify-center w-full">
                  <motion.button
                    className={
                      isActive
                        ? navItemDefaultClasses + " primary-self-text "
                        : navItemDefaultClasses + " text-default-color "
                    }
                    whileHover={{
                      color: "#00684a",
                      translateX: isActive ? 0 : 4,
                      transition: {
                        backgroundColor: {
                          type: "spring",
                          damping: 18,
                        },
                      },
                    }}
                    whileTap={{ scale: isActive ? 1 : 0.9 }}
                  >
                    <button
                      type="button"
                      className={`border ${
                        isActive
                          ? "border-[#00684a20] bg-[#00684a20]"
                          : "border-gray-300"
                      } flex items-center py-2 px-8 rounded-2xl hover:bg-[#00684a20]`}
                    >
                      <span>
                        <AiOutlinePlus />
                      </span>
                      <span className="px-2">New Invoice</span>
                    </button>
                  </motion.button>
                </li>
              );
            }}
          </NavLink>
          <div className="mt-4">
            {/* {NAV_DATA */}
            {NAV_DATA.filter(({ title }) => isAdmin || (!isAdmin && title !== "Dashboard" && title !== "Import" && title !== "Business Profile"))
            .map(({ title, link, Icon }) => (
              <li key={title} className="mb-2">
                <NavLink
                  to={link}
                  className={"rounded-md side-link"}
                  onClick={onClickNavbar}
                >
                  {({ isActive }) => (
                    <motion.span
                      key={`${title}_nav_item`}
                      className={
                        isActive
                          ? navItemDefaultClasses + " primary-self-text "
                          : navItemDefaultClasses + " text-default-color "
                      }
                      whileHover={{
                        color: "#00684a",
                        backgroundColor: "#00684a20",
                        translateX: isActive ? 0 : 4,
                        transition: {
                          backgroundColor: {
                            type: "spring",
                            damping: 18,
                          },
                        },
                      }}
                      whileTap={{ scale: isActive ? 1 : 0.9 }}
                    >
                      <Icon className="h-[1.4rem] w-[1.4rem] mr-4" />
                      {title}
                    </motion.span>
                  )}
                </NavLink>
              </li>
            ))}
          </div>
        </ul>

        <hr />

        <div className="my-4">
          <NavLink to={"about"} onClick={onClickNavbar}>
            <motion.span
              className="block px-4 py-2 rounded-md flex text-default-color"
              style={{
                color: aboutRoute ? "primary-self-text" : "#777",
              }}
              whileHover={{
                scale: [1.03, 1, 1.03, 1, 1.03, 1, 1.03, 1],
                color: "primary-self-text",
                textShadow: "0px 0px 3px #85FF66",
                transition: {
                  backgroundColor: {
                    type: "spring",
                    damping: 18,
                  },
                },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <SecurityIcon className="h-6 w-6 mr-4" />
              About Dev
            </motion.span>
          </NavLink>
        </div>

        <hr />
        <div className="w-full px-8 mt-5 mb-8">
          <button
            onClick={handleLogout}
            className="w-1/2 px-4 py-2 text-white text-center text-sm bg-red-500 rounded-md transition-colors duration-300 hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>
    </>
  );
}

export default Sidebar;
