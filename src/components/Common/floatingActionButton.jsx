import { Menu, Transition } from "@headlessui/react";
import React, { Fragment, useState, useRef } from "react";
import { AiOutlinePlus, AiOutlineMinus } from "react-icons/ai";
import { BsPerson as Person } from "react-icons/bs";
import { MdAssignmentReturn as Return } from "react-icons/md";
import { TbFileInvoice as Invoice } from "react-icons/tb";
import { IoCartOutline as Purchase } from "react-icons/io5";
import { BiBox as Products } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setNavbarFalse } from "../../stateManagement/slice/InitialMode";
import { useEffect } from "react";

export default function FloatingActionButton({ containerRef }) {
  // const [open, setOpen] = useState(false);;
  const [isFloatOpen, setIsFloatOpen] = useState(false);
  const dispatch = useDispatch();
  const [display, setDisplay] = useState("none");
  const navigate = useNavigate();
  const handleNavigate = (path) => {
    navigate(path);
    const isMobile = window.innerWidth < 767;
    if (isMobile) {
      dispatch(setNavbarFalse());
    }
    setIsFloatOpen(false);
    // setOpen(false);
    if (
      path === "/invoices/new" ||
      path === "/purchases/new" ||
      path === "/salesreturn/new" ||
      path === "/purchasesreturn/new"
    ) {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth",
      });
    } else {
      setTimeout(() => {
        window.scrollTo({
          top: document.body.scrollHeight,
          left: 0,
          behavior: "smooth",
        });
      }, 1500);
    }
  };
  const md = window.matchMedia("(max-width: 1024px)");

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      if (md.matches) {
        setDisplay("hidden");
      } else {
        setDisplay("none");
      }
    } else {
      setDisplay("none");
    }
  };

  React.useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFloatOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && containerRef.current.contains(event.target)) {
        setIsFloatOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isFloatOpen]);

  return (
    <div className={`fixed bottom-4 right-6 z-50 ${display}`}>
      <Menu as="div" className="relative inline-block text-left">
        <div title={isFloatOpen ? "Close" : "Quick Actions"}>
          <button
            className="rounded-full bg-slate-700 px-3 py-3 transition-all duration-1000 ease-in-out hover:shadow-2xl hover:scale-110"
            onClick={() => {
              setIsFloatOpen(!isFloatOpen);
            }}
          >
            {!isFloatOpen ? (
              <AiOutlinePlus
                className="h-6 w-6 text-white svg-brain"
                aria-hidden="true"
              />
            ) : (
              <AiOutlineMinus
                className="h-6 w-6 text-white svg-brain"
                aria-hidden="true"
              />
            )}
          </button>
        </div>
        <Transition
          as={Fragment}
          show={isFloatOpen}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className={`absolute -right-2.5 -mt-[26.5rem]
            p-2 w-56 origin-bottom-right divide-y divide-gray-100 rounded-xl bg-white shadow-2xl focus:outline-none ring-1
          ring-black ring-opacity-5`}
          >
            <div className="px-1 py-0.5">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/customer")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Person
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>
                    New Customer
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/merchant")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Person
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    New Merchant
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-0.5">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/invoices/new")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Invoice
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    Sale Invoice
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/salesreturn/new")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Return
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    Sale Return
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-0.5">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/purchases/new")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Purchase
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    Purchase
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/purchasesreturn/new")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Return
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    Purchase Return
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-0.5">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active
                        ? "text-[#00684a] scale-x-105 transition-all duration-300 ease-in-out"
                        : "text-gray-900"
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={() => handleNavigate("/products")}
                  >
                    <span
                      className={`h-8 w-8 rounded-full mr-4 ${
                        active ? "bg-[#00684a]" : "bg-gray-100"
                      } flex justify-center items-center`}
                    >
                      <Products
                        className={`${
                          active
                            ? "text-white h-5 w-5"
                            : "text-gray-800 h-5 w-5"
                        }`}
                      />
                    </span>{" "}
                    New Product
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
