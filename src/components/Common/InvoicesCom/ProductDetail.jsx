import { NumericFormat } from "react-number-format";
import { ChooseUnit } from "../../Product/dropdown";
import {
  IconStyle,
  defaultInputSmStyle,
} from "../../../constants/defaultStyles";
import DeleteIcon from "../../Icons/DeleteIcon";
import Button from "../../Button/Button";
import InvoiceIcon from "../../Icons/InvoiceIcon";
import PlusCircleIcon from "../../Icons/PlusCircleIcon";
import TaxesIcon from "../../Icons/TaxesIcon";
import DollarIcon from "../../Icons/DollarIcon";
import MyToggleButton from "../toggleButton";
import EsewaToggleButton from "../toggleButtonEsewa";
import { useCallback, useMemo } from "react";
import {
  getTotalTaxesWithPercent,
  minusTotalDiscountAmount,
  sumProductTotal,
  sumTotalTaxes,
} from "../../../utils/match";
import { nanoid } from "nanoid";
import { toast } from "react-toastify";
export const ProductDetail = ({
  invoiceForm,
  setInvoiceForm,
  isExporting,
  isViewMode,
  handlerProductValue,
  openChooseProduct,
  subTotal,
  addEmptyProduct,
  handlerTaxesValue,
  activeUnit,
  setActiveUnit,
  sale,
}) => {
  const totalPercentTax = useMemo(() => {
    const isSomeTax = invoiceForm?.taxes?.some(
      (tax) => tax.type === "percentage"
    );
    if (!isSomeTax) {
      return 0;
    }

    const findIndex = invoiceForm?.taxes?.findIndex(
      (tax) => tax.type === "percentage"
    );
    const amount = parseInt(invoiceForm.taxes[findIndex].amount);
    return findIndex !== -1
      ? Number.isInteger(amount)
        ? amount
        : amount.toFixed(4).toString().slice(0, -2)
      : 0;
  }, [invoiceForm]);

  const totalVATPercent = useMemo(() => {
    const isSomeVAT = invoiceForm?.taxes?.some(
      (tax) => tax.type === "VATpercentage"
    );
    if (!isSomeVAT) {
      return 0;
    }

    const findIndex = invoiceForm?.taxes?.findIndex(
      (tax) => tax.type === "VATpercentage"
    );

    const amount = parseInt(invoiceForm.taxes[findIndex].amount);
    return findIndex !== -1
      ? Number.isInteger(amount)
        ? amount
        : amount.toFixed(4).toString().slice(0, -2)
      : 0;
  }, [invoiceForm]);

  const addEmptyTax = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) =>
        form.uniqueTitle === "Discount By Amount" || form.type === "percentage"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Added Discount", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const emptyTax = {
        id: nanoid(),
        uniqueTitle: "Discount By Amount",
        title: "Discount (AMT)",
        type: "flat",
        value: 1,
        amount: 1,
      };
      const updateTaxes = [...prev.taxes, emptyTax];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return { ...prev, taxes: updateTaxes, totalAmount, discount:{amount:1} };
    });
  }, [invoiceForm]);


  const addPercentageTax = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) =>
        form.uniqueTitle === "Discount By Amount" || form.type === "percentage"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Added Discount", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const amount = (10 / 100) * subTotalAmount;
      const percentageTax = {
        id: nanoid(),
        uniqueTitle: "Discount %",
        title: "Discount %",
        type: "percentage",
        value: 10,
        amount,
      };
      const updateTaxes = [...prev.taxes, percentageTax];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );

      return {
        ...prev,
        taxes: updateTaxes,
        totalAmount,
        discount: {percent:10},
      };
    });
  }, [invoiceForm]);

  const addPercentageVAT = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) => form.uniqueTitle === "VAT %"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Added VAT", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }

    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const amount = (13 / 100) * subTotalAmount;
      const percentageVAT = {
        id: nanoid(),
        uniqueTitle: "VAT %",
        title: "VAT %",
        type: "VATpercentage",
        value: 13,
        amount,
      };
      const updateTaxes = [percentageVAT, ...prev.taxes];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );

      return {
        ...prev,
        taxes: updateTaxes,
        totalAmount: totalAmount,
      };
    });
  }, [invoiceForm]);

  const addExtraFee = useCallback(() => {
    const isSomeTaxes = invoiceForm.taxes.some(
      (form) => form.uniqueTitle === "Extra Fee"
    );
    if (isSomeTaxes) {
      toast.error("Already Have Added Extra Fee", {
        position: "bottom-center",
        autoClose: 2000,
      });
      return;
    }
    setInvoiceForm((prev) => {
      const subTotalAmount = sumProductTotal(prev.products);
      const extraFree = {
        id: nanoid(),
        uniqueTitle: "Extra Fee",
        title: "Extra Fee",
        type: "flat",
        value: 1,
        amount: 1,
      };
      const updateTaxes = [...prev.taxes, extraFree];
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return { ...prev, taxes: updateTaxes, totalAmount };
    });
  }, [invoiceForm]);

  const onDeleteTax = useCallback((taxID) => {
    setInvoiceForm((prev) => {
      const updateTaxes = prev.taxes.filter((prod) => prod.id !== taxID);
      let updatedData = { ...prev, taxes: updateTaxes,discount:{}};
      const subTotalAmount = sumProductTotal(prev.products);
      const totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      updatedData.totalAmount = totalAmount;
      return updatedData;
    });
  }, []);
  const onDeleteProduct = useCallback((prodID) => {
    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = prev.products.filter((prod) => prod.id !== prodID);
      const subTotalAmount = sumProductTotal(updateProducts);
      const updateTaxes = getTotalTaxesWithPercent(prev.taxes, subTotalAmount);
      updatedData.products = updateProducts;
      updatedData.taxes = updateTaxes;
      updatedData.totalAmount = minusTotalDiscountAmount(
        subTotalAmount,
        sumTotalTaxes(updateTaxes)
      );
      return updatedData;
    });
  }, []);
  console.log(invoiceForm);
  return (
    <div className="py-2 px-4">
      <div className="font-title font-bold mx-3 sm:hidden">Products</div>
      <div className="hidden sm:flex rounded-lg invisible sm:visible w-full flex-col sm:flex-row px-4 py-2 text-white bg-[#00684a]">
        <div
          className={
            "font-title " +
            (isExporting
              ? " text-sm w-1/4 text-right pr-10"
              : " w-full sm:w-1/4 text-right sm:pr-10")
          }
        >
          <span className="inline-block">Description</span>
        </div>
        <div
          className={
            "font-title " +
            (isExporting
              ? " text-sm  w-1/4 text-right pr-10"
              : " w-full sm:w-1/4 text-right sm:pr-10")
          }
        >
          Price
        </div>
        <div
          className={
            "font-title " +
            (isExporting
              ? " text-sm  w-1/4 text-right pr-10"
              : " w-full sm:w-1/4 text-right sm:pr-10")
          }
        >
          Qty
        </div>
        <div
          className={
            "font-title" +
            (isExporting
              ? " text-sm w-1/4 text-right pr-10"
              : "  w-full sm:w-1/4 text-right sm:pr-10")
          }
        >
          Total
        </div>
      </div>
      {invoiceForm?.products?.map((product, index) => (
        <div
          key={`${index}_${product.id}`}
          className={
            (isExporting
              ? "flex flex-row rounded-lg w-full px-4 py-1 items-center relative text-sm"
              : "flex flex-col sm:flex-row rounded-lg sm:visible w-full px-4 py-2 items-center relative") +
            (index % 2 !== 0 ? " bg-gray-50 " : "")
          }
        >
          <div
            className={
              isExporting
                ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
            }
          >
            {!isExporting && (
              <span className="sm:hidden w-1/2 flex flex-row items-center">
                Description
              </span>
            )}
            <span
              className={
                isExporting
                  ? "inline-block w-full mb-0"
                  : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
              }
            >
              {!isViewMode ? (
                <input
                  autoComplete="nope"
                  value={product.name}
                  placeholder="Product Name"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) =>
                    handlerProductValue(
                      e,
                      "name",
                      product.id,
                      product?.maxQuantity
                    )
                  }
                  onFocus={(e) => e.target.select()}
                />
              ) : (
                <span className="pr-3">{product.name}</span>
              )}
            </span>
          </div>
          <div
            className={
              isExporting
                ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
            }
          >
            {!isExporting && (
              <span className="sm:hidden w-1/2 flex flex-row items-center">
                Price
              </span>
            )}
            <span
              className={
                isExporting
                  ? "inline-block w-full mb-0"
                  : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
              }
            >
              {!isViewMode ? (
                <input
                  autoComplete="nope"
                  value={product.amount}
                  placeholder="Price"
                  type={"number"}
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) =>
                    handlerProductValue(
                      e,
                      "amount",
                      product.id,
                      product?.maxQuantity
                    )
                  }
                  onFocus={(e) => e.target.select()}
                />
              ) : (
                <span className="pr-3">
                  <NumericFormat
                    value={product.amount}
                    className=""
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => (
                      <span {...props}>{value}</span>
                    )}
                  />
                </span>
              )}
            </span>
          </div>
          <div
            className={
              isExporting
                ? "font-title w-1/4 text-right pr-8 flex flex-row block"
                : "font-title w-full sm:w-1/4 text-right sm:pr-8 flex flex-row sm:block"
            }
          >
            {!isExporting && (
              <span className="sm:hidden w-1/2 flex flex-row items-center">
                Quantity
              </span>
            )}
            <span
              className={
                isExporting
                  ? "inline-block w-full mb-0"
                  : "inline-block w-1/2 sm:w-full mb-1 sm:mb-0"
              }
            >
              {!isViewMode ? (
                <div className="relative">
                  <input
                    autoComplete="nope"
                    value={product.quantity}
                    type={"number"}
                    disabled={product?.quality >= product?.maxQuantity}
                    placeholder="Quantity"
                    className={
                      product?.secondaryUnit
                        ? defaultInputSmStyle + " text-left pr-16"
                        : defaultInputSmStyle + " text-left"
                    }
                    onChange={(e) =>
                      handlerProductValue(
                        e,
                        "quantity",
                        product.id,
                        product?.maxQuantity
                      )
                    }
                    onFocus={(e) => e.target.select()}
                  />
                  {(product?.secondaryUnit || product?.primaryUnit) && (
                    <span
                      className={
                        activeUnit === product?.id
                          ? `absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl text-default-color text-[11px] cursor-pointer
                         hover:bg-gray-100 hover:text-default-color z-[1000]`
                          : `absolute right-1 top-1/2 transform -translate-y-1/2 rounded-xl text-default-color text-[11px] cursor-pointer
                         hover:bg-gray-100 hover:text-default-color`
                      }
                    >
                      <ChooseUnit
                        primaryUnit={product?.primaryUnit}
                        secondaryUnit={product?.secondaryUnit}
                        setInvoiceForm={setInvoiceForm}
                        invoiceForm={invoiceForm}
                        setActiveUnit={setActiveUnit}
                        productID={product.id}
                        subTotal={subTotal}
                      />
                    </span>
                  )}
                </div>
              ) : (
                <span className="pr-3">
                  <NumericFormat
                    value={product.quantity}
                    className=""
                    displayType={"number"}
                    thousandSeparator={true}
                    renderText={(value, props) => (
                      <span {...props}>{value}</span>
                    )}
                  />
                </span>
              )}
            </span>
          </div>
          <div className="font-title w-full sm:w-1/4 text-right sm:pr-9 flex flex-row sm:block">
            {!isExporting && (
              <span className="sm:hidden w-1/2 flex flex-row items-center">
                Total
              </span>
            )}

            <span className="inline-block w-1/2 sm:w-full">
              <NumericFormat
                value={
                  Number.isInteger(product.quantity * product.amount)
                    ? product.quantity * product.amount
                    : (product.quantity * product.amount)
                        .toFixed(4)
                        .toString()
                        .slice(0, -2)
                }
                className=""
                displayType={"text"}
                thousandSeparator={true}
                renderText={(value, props) => (
                  <span {...props}>
                    {invoiceForm?.currencyUnit} {value}
                  </span>
                )}
              />
            </span>
          </div>
          {!isViewMode && (
            <div
              className="w-full sm:w-10 sm:absolute sm:right-0"
              onClick={() => onDeleteProduct(product.id)}
            >
              <div className="w-full text-red-500 font-title h-8 sm:h-8 sm:w-8 cursor-pointer rounded-2xl bg-red-200 mr-2 flex justify-center items-center">
                <DeleteIcon className="h-4 w-4" style={IconStyle} />
                <span className="block sm:hidden">Delete Product</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {invoiceForm?.products?.length === 0 && (
        <div className="text-center my-2 text-gray-600">
          Click on the add product button to add a product
        </div>
      )}
      {/* Add Product Actions */}
      {!isViewMode && (
        <div className="flex flex-col md:flex-row rounded-lg md:visible w-full py-2 items-center md:justify-end">
          <div className="font-title w-full md:w-1/2 lg:w-1/4 text-right md:pr-8 flex flex-row md:block mb-1">
            <Button
              size="sm"
              block={1}
              onClick={openChooseProduct}
              changeColor={"#00684a"}
            >
              <InvoiceIcon style={IconStyle} className="w-5 h-5" />
              Add Existing Product
            </Button>
          </div>
          <div className="font-title w-full md:w-1/2 lg:w-1/4 text-right flex flex-row md:block mb-1">
            <Button
              size="sm"
              block={1}
              onClick={addEmptyProduct}
              changeColor={"#00684a"}
            >
              <PlusCircleIcon style={IconStyle} className="h-5 w-5" />
              Add Empty Product
            </Button>
          </div>
        </div>
      )}
      {/* Add Product Actions Finished*/}
      {/* Subtotal Start */}
      {subTotal > 0 && (
        <div
          className={
            "flex flex-row sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center "
          }
        >
          <div className={"font-title flex flex-row sm:block mb-1"}>
            Subtotal
          </div>
          <div
            className={
              "font-title w-full sm:w-1/4 text-right sm:pr-7 flex flex-row justify-end sm:block mb-1"
            }
          >
            <NumericFormat
              value={subTotal}
              className="inline-block"
              displayType={"text"}
              thousandSeparator={true}
              renderText={(value, props) => (
                <span {...props}>
                  {invoiceForm?.currencyUnit} {value}
                </span>
              )}
            />
          </div>
        </div>
      )}
      {/* Subtotal Finished */}
      {/* Taxes */}
      {invoiceForm?.taxes?.map((tax, index) => (
        <div
          key={`${index}_${tax.id}`}
          className={
            "flex flex-col sm:flex-row sm:justify-end rounded-lg sm:visible w-full px-4 py-1 items-center relative"
          }
        >
          <div
            className={
              "font-title w-full sm:w-3/5 text-right flex flex-row sm:block"
            }
          >
            <div className="sm:hidden w-1/3 flex flex-row items-center">
              {tax.title}
            </div>
            <div
              className={
                "w-2/3 sm:w-full mb-1 sm:mb-0 flex flex-row items-center sm:justify-end"
              }
            >
              <div className={"w-1/2 hidden sm:block sm:w-1/2 lg:w-1/3 pr-1"}>
                {/* discount input fields --value is set to title at first */}
                <input
                  autoComplete="nope"
                  value={tax.title}
                  type={"text"}
                  readOnly={
                    tax.type === "VATpercentage" || tax.type === "percentage"
                  }
                  placeholder="Discount Type"
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handlerTaxesValue(e, "title", tax.id)}
                  onFocus={(e) => {
                    tax.type === "VATpercentage" || tax.type === "percentage"
                      ? e.target.blur()
                      : e.target.select();
                  }}
                />
              </div>
              <div
                className={
                  "w-9/12 sm:w-1/2 lg:w-1/3 ml-auto sm:ml-2 flex flex-row items-center sm:justify-end"
                }
              >
                {/* and value is set here */}
                <input
                  autoComplete="nope"
                  value={tax.value}
                  type={"number"}
                  placeholder={`${tax.title} Value`}
                  className={defaultInputSmStyle + " text-right"}
                  onChange={(e) => handlerTaxesValue(e, "value", tax.id)}
                  onFocus={(e) => e.target.select()}
                />
                <span className="ml-1">
                  {tax.type === "percentage" || tax.type === "VATpercentage"
                    ? "%"
                    : "/-"}
                </span>
              </div>
            </div>
          </div>
          <div
            className={
              "font-title w-full sm:w-1/4 lg:w-1/4 text-right sm:pr-9 my-1 flex flex-row sm:block"
            }
          >
            {!isExporting && (
              <span className="sm:hidden w-1/2 flex flex-row items-center">
                {tax?.title?.split(" ")[0]} Amount
              </span>
            )}
            <span
              className={
                isExporting
                  ? "inline-block w-full"
                  : "inline-block w-1/2 sm:w-full"
              }
            >
              <>
                <div className="w-full">
                  <NumericFormat
                    value={
                      tax.type === "percentage"
                        ? totalPercentTax
                        : tax.type === "VATpercentage"
                        ? totalVATPercent
                        : tax.amount
                    }
                    className=""
                    displayType={"text"}
                    thousandSeparator={true}
                    renderText={(value, props) => (
                      <span {...props}>
                        {invoiceForm?.currencyUnit} {value}
                      </span>
                    )}
                  />
                </div>
              </>
            </span>
          </div>
          {!isViewMode && (
            <div
              className="w-full sm:w-10 sm:absolute sm:right-0"
              onClick={() => onDeleteTax(tax.id)}
            >
              <div className="w-full text-red-500 font-title h-8 sm:h-8 sm:w-8 cursor-pointer rounded-2xl bg-red-200 mr-2 flex justify-center items-center">
                <DeleteIcon className="h-4 w-4" style={IconStyle} />
                <span className="block sm:hidden">Delete</span>
              </div>
            </div>
          )}
        </div>
      ))}
      {/* Taxes Finished*/}
      {subTotal > 0 && (
        <>
          {/* Add Tax Action */}
          <div className="flex flex-col md:flex-row rounded-lg md:visible w-full py-1 items-center md:justify-end">
            <div className="font-title w-full md:w-1/2 lg:w-1/3 text-right md:pr-8 flex flex-row md:block mb-1">
              <Button
                size="sm"
                block={1}
                onClick={addPercentageTax}
                changeColor={"#00684a"}
              >
                <TaxesIcon style={IconStyle} className="h-5 w-5" />
                Add Discount (%)
              </Button>
            </div>
            <div className="font-title w-full md:w-1/2 lg:w-1/3 text-right flex flex-row md:block mb-1">
              <Button
                size="sm"
                block={1}
                onClick={addEmptyTax}
                changeColor={"#00684a"}
              >
                <DollarIcon style={IconStyle} className="w-5 h-5" />
                Add Discount (Amount)
              </Button>
            </div>
          </div>
          <div className="flex flex-col md:flex-row rounded-lg md:visible w-full pb-1 items-center md:justify-end">
            <div className="font-title w-full md:w-1/2 lg:w-1/3 text-right md:pr-8 flex flex-row md:block mb-1">
              <Button
                size="sm"
                block={1}
                onClick={addPercentageVAT}
                changeColor={"#00684a"}
              >
                <TaxesIcon style={IconStyle} className="h-5 w-5" />
                Add VAT (%)
              </Button>
            </div>
            <div className="font-title w-full md:w-1/2 lg:w-1/3 text-right flex flex-row md:block mb-1">
              <Button
                size="sm"
                block={1}
                onClick={addExtraFee}
                changeColor={"#00684a"}
              >
                <DollarIcon style={IconStyle} className="w-5 h-5" />
                Add Extra Fee (Amount)
              </Button>
            </div>
          </div>

          {/* Add Tax Action Finished*/}

          {/* Subtotal Start and received Amount */}
          <div className="flex flex-row sm:flex-row sm:justify-end w-full items-center text-white">
            <div className="w-full sm:w-10/12 md:w-8/12 px-4 py-1 flex flex-row rounded-xl items-center text-white bg-[#00684a]">
              <div className="font-title text-lg w-1/2 text-right sm:text-left sm:pr-9 flex flex-row sm:block items-center">
                Total
              </div>
              <div className="font-title text-lg w-1/2 text-right sm:pr-4 flex flex-row justify-end sm:block items-center">
                <NumericFormat
                  value={invoiceForm?.totalAmount}
                  className=""
                  displayType={"text"}
                  thousandSeparator={true}
                  renderText={(value, props) => (
                    <span {...props}>
                      <span className={"text-base"}>
                        {invoiceForm?.currencyUnit}
                      </span>{" "}
                      {value}
                    </span>
                  )}
                />
              </div>
            </div>
          </div>

          <div className="flex sm:justify-end items-center text-[#00684a] font-bold mt-2">
            <div className="w-full font-medium sm:w-10/12 md:w-8/12 flex rounded-xl sm:flex-row flex-col items-center justify-between">
              <MyToggleButton
                fullPayment={
                  invoiceForm?.paidAmount === invoiceForm?.totalAmount
                    ? true
                    : false
                }
                invoiceForm={invoiceForm}
                setInvoiceForm={setInvoiceForm}
              />
              <div className=" w-full sm:w-9/12 lg:w-1/2 px-[0.15rem] py-[0.15rem] mx-auto mb-2 sm:mb-0 rounded-xl bg-[#00684a]">
                <div className="flex">
                  <span className="inline-flex items-center px-3 text-sm rounded-l-xl border border-r-0 bg-[#fff]">
                    Rs.
                  </span>
                  <input
                    autoComplete="nope"
                    value={invoiceForm?.paidAmount || ""}
                    type="number"
                    placeholder={`${
                      sale === true ? "Received" : "Paid"
                    } Amount`}
                    className={
                      defaultInputSmStyle +
                      " rounded-none rounded-r-xl bg-white border text-black focus:border-l-0 block flex-1 min-w-0 w-full text-sm"
                    }
                    onChange={(e) => {
                      setInvoiceForm({
                        ...invoiceForm,
                        paidAmount:
                          invoiceForm?.totalAmount < e.target.value
                            ? invoiceForm?.totalAmount
                            : e.target.value,
                      });
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div>
              {/* <div className="w-full px-[0.15rem] py-[0.15rem] rounded-xl text-white bg-[#00684a]">
                <div className="text-lg w-full flex flex-row justify-end sm:block items-center">
                  <input
                    autoComplete="nope"
                    value={invoiceForm?.note}
                    type={"text"}
                    placeholder="Add Note"
                    className={defaultInputSmStyle + " text-black"}
                    onChange={(e) => {
                      setInvoiceForm({
                        ...invoiceForm,
                        note: e.target.value,
                      });
                    }}
                    onFocus={(e) => e.target.select()}
                  />
                </div>
              </div> */}
              <EsewaToggleButton
                isEsewa={invoiceForm?.note === "esewa" ? true : false}
                invoiceForm={invoiceForm}
                setInvoiceForm={setInvoiceForm}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};
