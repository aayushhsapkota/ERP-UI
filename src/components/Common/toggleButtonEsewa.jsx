import { useState } from "react";
import { Switch } from "@headlessui/react";

function EsewaToggleButton({ isEsewa, setInvoiceForm, invoiceForm }) {
  return (
    <div className="flex items-center space-x-2 justify-around bg-[#00684a] px-4 py-2 mr-1 mb-1 sm:mb-0 rounded-xl">
      <span className="text-sm text-white font-medium">Esewa</span>
      <Switch
        onChange={(e) => {
          if (e === true) {
            setInvoiceForm({
              ...invoiceForm,
              note: "esewa",
            });
          } else {
            setInvoiceForm({
              ...invoiceForm,
              note: "",
            });
          }
        }}
        checked={isEsewa}
        className={`${
          isEsewa ? "bg-[#11995a]" : "bg-gray-400"
        } relative inline-flex h-6 w-11 items-center rounded-full mx-1`}
      >
        <span
          className={`${
            isEsewa ? "translate-x-6" : "translate-x-1"
          } inline-block h-4 w-4 transform rounded-full bg-white transition`}
        />
      </Switch>
    </div>
  );
}

export default EsewaToggleButton;
