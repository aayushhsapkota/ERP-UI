import React, { useState } from "react";
import { Menu } from "@headlessui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";


export const Dropdown = ({ name, handlerExpenseValue, expenseForm }) => {
  const category = [
    "Choose Category",
    "General",
    "Rent",
    "Payroll",
    "Transportation",
    "Commissions",
    "Taxes",
    "Marketing"
  ];

  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="dropdown-btn w-full text-left"
      >
        <div>
          <div
            className={
              expenseForm[name] === "Choose Category" ||
              expenseForm[name] === ""
                ? "text-gray-400 text-[15px] leading-tight"
                : "text-[15px] leading-tight"
            }
          >
            {expenseForm[name] ||
              `Choose ${name === "category" ? "Category" : "Unit"}`}
          </div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}
      </Menu.Button>

      <Menu.Items className="dropdown-menu">
        {name === "category"
          ? category?.map((value, index) => {
              return (
                <Menu.Item
                  as="li"
                  onClick={(e) => handlerExpenseValue(e, name)}
                  key={index}
                  className={
                    index === 0
                      ? "cursor-pointer w-full text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                      : "cursor-pointer w-full text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                  }
                >
                  {value}
                </Menu.Item>
              );
            })
        
          : null}
      </Menu.Items>
    </Menu>
  );
};

export const EditDropdown = ({
  name,
  handlerExpenseValue,
  expenseForm,
  disabled = false,
}) => {
  const category = [
    "Choose Category",
    "General",
    "Rent",
    "Payroll",
    "Transportation",
    "Commissions",
    "Taxes",
    "Marketing"
  ];
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Menu as="div" className="dropdown relative">
      <Menu.Button
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="dropdown-btn w-full text-left"
      >
        <div>
          <div
            className={
              expenseForm[name] === "Choose Category" ||
              expenseForm[name] === "Choose Unit" ||
              expenseForm[name] === ""
                ? "text-gray-400 text-[15px] leading-tight"
                : "text-[15px] leading-tight"
            }
          >
            {expenseForm[name] ||
              `Choose ${name === "category" ? "Category" : "Unit"}`}
          </div>
        </div>
        {isOpen ? (
          <RiArrowUpSLine className="dropdown-icon-secondary" />
        ) : (
          <RiArrowDownSLine className="dropdown-icon-secondary" />
        )}
      </Menu.Button>
      {!disabled ? (
        <Menu.Items className="dropdown-menu">
          {name === "category"
            ? category?.map((value, index) => {
                return (
                  <Menu.Item
                    as="li"
                    onClick={(e) => handlerExpenseValue(e, name)}
                    key={index}
                    className={
                      index === 0
                        ? "cursor-pointer w-full text-gray-400 text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a60] transition"
                        : "cursor-pointer w-full text-[13px] px-10 py-1 hover:text-[#fff] hover:bg-[#00684a40] transition"
                    }
                  >
                    {value}
                  </Menu.Item>
                );
              })
            
            : null}
        </Menu.Items>
      ) : null}
    </Menu>
  );
};

