import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import domtoimage from "dom-to-image";
import InvoiceTopBar from "../../components/Invoice/InvoiceTopBar";
import {
  getAllInvoiceDetailSelector,
  getInvoiceStatusSelector,
  getInvoiceNewForm,
  getIsConfirm,
  setIsConfirm,
  createNewInvoice,
  updatedInvoice,
  updateNewInvoiceForm,
  getInvocieNo,
  getByIdInvoice,
  setDeleteId,
  setAllInvoiceDetailList,
  getInvoiceNumber,
} from "../../stateManagement/slice/invoiceSlice";
import {
  getSelectedClient,
  setOpenClientSelector,
} from "../../stateManagement/slice/clientSlice";
import {
  getSelectedProduct,
  setOpenProductSelector,
} from "../../stateManagement/slice/productSlice";
import {
  setToggleNavbar as toggleNavbar,
  setEscapeOverflow,
  getShowNavbar,
} from "../../stateManagement/slice/InitialMode";
import { getCompanyData } from "../../stateManagement/slice/companySlice";
import { nanoid } from "nanoid";
import {
  getTotalTaxesWithPercent,
  minusTotalDiscountAmount,
  sumProductTotal,
  sumTotalTaxes,
} from "../../utils/match";
import PrintInvoice from "../../components/Common/InvoicesCom/print";
import EmptyBar from "../../components/Common/EmptyBar";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { CustomerDetail } from "../../components/Common/InvoicesCom/CustomerDetail";
import { ProductDetail } from "../../components/Common/InvoicesCom/ProductDetail";
import { TitleInvoice } from "../../components/Common/InvoicesCom/title";
import { SubmitInvoice } from "../../components/Common/InvoicesCom/submit";
import { setClientIsChoosed } from "../../stateManagement/slice/editLogic";

function InvoiceDetailScreen() {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const showNavbar = useSelector(getShowNavbar);
  const myNewForm = {
    id: nanoid(),
    invoiceNo: "",
    statusIndex: "1",
    statusName: "Draft",
    totalAmount: 0,
    paidAmount: 0,
    dueDate: "",
    invoiceType: "Sale",
    createdDate: todayNepaliDate(new Date()),
    currencyUnit: "Rs.",
    clientDetail: {
      id: "",
      name: "",
      mobileNo: "",
      email: "",
      image: "",
      billingAddress: "",
    },
    products: [],
    taxes: [],
    note: "",
    discount: {},
  };

  const componentRef = useRef(null);
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);

  const invoiceNewForm = useSelector(getInvoiceNewForm);
  const invoiceNumber = useSelector(getInvocieNo);
  const allInvoiceDetails = useSelector(getAllInvoiceDetailSelector);
  const initLoading = useSelector(getInvoiceStatusSelector);
  const company = useSelector(getCompanyData);
  const selectedClient = useSelector(getSelectedClient);
  const selectedProduct = useSelector(getSelectedProduct);
  const isConfirm = useSelector(getIsConfirm);

  const [invoiceForm, setInvoiceForm] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [isQuotation, setIsQuotation] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeUnit, setActiveUnit] = useState("");

  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Paradise Cafe",
    onBeforeGetContent: useCallback(() => {
      dispatch(setEscapeOverflow(true));
      setIsViewMode(true);
    }, [setEscapeOverflow, dispatch]),
    onAfterPrint: useCallback(() => {
      dispatch(setEscapeOverflow(false));
      dispatch(setIsConfirm(true));
    }, [setEscapeOverflow, dispatch, setIsConfirm]),
    removeAfterPrint: true,
  });

  const GenerateQuotationPrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Paradise Cafe",
    onBeforeGetContent: useCallback(() => {
      dispatch(setEscapeOverflow(true));
      setIsViewMode(true);
    }, [setEscapeOverflow, dispatch]),
    onAfterPrint: useCallback(() => {
      dispatch(setEscapeOverflow(false));
      setIsQuotation(false);
      setIsExporting(false);
    }, [setEscapeOverflow, dispatch]),
    removeAfterPrint: true,
  });

  const handleQuotation = useCallback(() => {
    if (showNavbar) {
      dispatch(toggleNavbar());
    }
    setIsQuotation(true);
    setIsExporting(true);
    setTimeout(() => {
      GenerateQuotationPrint();
      setIsExporting(false);
    }, 1);
  }, [dispatch, GenerateQuotationPrint, showNavbar, toggleNavbar]);

  const handleExport = useCallback(() => {
    if (showNavbar) {
      dispatch(toggleNavbar());
    }
    setIsExporting(true);
    setTimeout(() => {
      handlePrint();
      setIsExporting(false);
    }, 1);
  }, [handlePrint, showNavbar, toggleNavbar, dispatch]);

  const handleDownloadImg = useCallback(async () => {
    if (showNavbar) {
      dispatch(toggleNavbar());
    }
    dispatch(setEscapeOverflow(true));
    setIsViewMode(true);

    // make componentRef.current margin to 0
    componentRef.current.style.margin = "0";
    componentRef.current.style.borderRadius = "0";
    componentRef.current.style.width =
      window.innerWidth < 600 ? "300px" : "500px";
    domtoimage
      .toJpeg(componentRef.current, { quality: 1 })
      .then(async (dataUrl) => {
        try {
          const res = await fetch(dataUrl);
          const blob = await res.blob();
          let a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = "invoice.jpeg";
          a.hidden = true;
          document.body.appendChild(a);
          a.click();
          a.remove();
        } finally {
          componentRef.current.style.margin = "auto";
          componentRef.current.style.borderRadius = "0.5rem";
          componentRef.current.style.width =
            window.innerWidth < 600 ? "300px" : "950px";
          dispatch(setEscapeOverflow(false));
        }
      });
  }, [setEscapeOverflow, showNavbar, toggleNavbar, dispatch]);

  const toggleViewMode = useCallback(() => {
    setIsViewMode((prev) => !prev);
  }, [invoiceForm, isViewMode]);

  const openChooseClient = useCallback(() => {
    dispatch(setOpenClientSelector(true));
  }, [dispatch]);

  const openChooseProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 60) {
      toast.warn("You can't add more than 60 products", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(setOpenProductSelector(true));
  }, [dispatch, invoiceForm]);

  const addEmptyProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 60) {
      toast.warn("You can't add more than 60 products", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    const emptyProduct = {
      id: nanoid(),
      name: "Empty Product",
      productID: "",
      amount: 100,
      quantity: 1,
      isSecondaryUnitChecked: false,
      primaryUnit: "",
    };

    setInvoiceForm((prev) => {
      let updatedData = { ...prev };
      const updateProducts = [...prev.products, emptyProduct];
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
  }, [invoiceForm]);

  const handlerProductValue = useCallback(
    (event, keyName, productID, maxValue) => {
      const value = event.target.value;
      if ((keyName === "quantity" || keyName === "amount") && value <= -1) {
        return;
      }
      if (keyName === "quantity") {
        const isFindIndex = invoiceForm.products.findIndex(
          (prod) => prod.id === productID
        );
        const product = invoiceForm.products[isFindIndex];
        if (product.isSecondaryUnitChecked) {
          const secondaryMaxValue =
            product.maxQuantity * product.conversionRatio;
          if (value > secondaryMaxValue) {
            toast.warn("Stock is not enough", {
              position: "bottom-center",
              autoClose: 3000,
            });
            return;
          }
        } else {
          if (value > maxValue) {
            toast.warn("Stock is not enough", {
              position: "bottom-center",
              autoClose: 3000,
            });
            return;
          }
        }
      }
      let updatedData = { ...invoiceForm };
      let updateProducts = [...invoiceForm.products];

      const isFindIndex = updateProducts.findIndex(
        (prod) => prod.id === productID
      );

      if (isFindIndex !== -1) {
        updateProducts[isFindIndex] = {
          ...updateProducts[isFindIndex],
          [keyName]: value,
        };

        updatedData.products = [...updateProducts];
      }

      if (keyName === "quantity" || keyName === "amount") {
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          invoiceForm.taxes,
          subTotalAmount
        );
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = minusTotalDiscountAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
      }
      setInvoiceForm(updatedData);
    },
    [invoiceForm]
  );

  const handlerTaxesValue = useCallback(
    (event, keyName, taxID) => {
      const value = event.target.value;
      let updateTaxes = [...invoiceForm.taxes];
      const isFindIndex = updateTaxes.findIndex((prod) => prod.id === taxID);
      const currentTax = updateTaxes[isFindIndex];
      if (currentTax.type === "percentage" && keyName === "value") {
        if (value <= -1 || value > 100) {
          return toast.warn("Discount percentage must be between 0 to 100", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      }
      if (currentTax.type === "VATpercentage" && keyName === "value") {
        if (value <= -1 || value > 100) {
          return toast.warn("VAT amount must be between 0 to 100", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      }

      if (currentTax.type === "flat" && keyName === "value") {
        if (value <= -1 || value > 100000) {
          return toast.warn("Amount must be between 0 to 100000", {
            position: "bottom-center",
            autoClose: 3000,
          });
        }
      }

      setInvoiceForm((prev) => {
        let taxes = [...prev.taxes];
        let discount;
        if (currentTax.type === "percentage" && keyName === "value") {
          discount = { percent: parseFloat(event.target.value) }; // Converts to a floating-point number
        } else if (currentTax.type === "flat" && keyName === "value") {
          discount = { amount: parseFloat(event.target.value) }; // Converts to a floating-point number
        }

        if (keyName === "value") {
          const subTotalAmount = sumProductTotal(prev.products);
          const amount = (value / 100) * subTotalAmount;
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value === "" ? 0 : value,
            amount:
              currentTax.type === "percentage"
                ? amount
                : currentTax.type === "VATpercentage"
                ? amount
                : value === ""
                ? 0
                : value,
          };
          const totalAmount = minusTotalDiscountAmount(
            subTotalAmount,
            sumTotalTaxes(taxes)
          );
          return { ...prev, taxes: taxes, totalAmount: totalAmount, discount };
        } else {
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value === "" ? 0 : value,
          };
          return { ...prev, taxes: taxes };
        }
      });
    },
    [invoiceForm]
  );

  // Calculation for Showing
  const subTotal = useMemo(() => {
    if (!invoiceForm) {
      return 0;
    }

    if (!invoiceForm?.products) {
      return 0;
    }
    return sumProductTotal(invoiceForm.products);
  }, [invoiceForm]);

  const saveAs = useCallback(
    (status) => {
      if (invoiceForm?.clientDetail?._id) {
        if (!invoiceForm?.clientDetail?.name) {
          return toast.error("Client name is required", {
            position: "bottom-center",
            autoClose: 2000,
          });
        }
      }
      if (invoiceForm?.paidAmount > invoiceForm?.totalAmount) {
        return toast.warn(
          "Received amount can't be greater than total amount",
          {
            position: "bottom-center",
            autoClose: 2000,
          }
        );
      }

      setInvoiceForm((prev) => {
        return {
          ...prev,
          statusName: status,
          statusIndex:
            status === "Draft"
              ? "1"
              : status === "Unpaid"
              ? "2"
              : status === "Paid"
              ? "3"
              : "4",
        };
      });
      handleExport();
    },
    [handleExport, invoiceForm?.clientDetail?.name, invoiceForm?.statusName]
  );

  useEffect(() => {
    if (isConfirm) {
      console.log("Hello");
      dispatch(setIsConfirm(false));
      if (params.id !== "new") {
        dispatch(updatedInvoice(invoiceForm));
        console.log(invoiceForm);
      } else {
        dispatch(
          createNewInvoice({
            ...invoiceForm,
            invoiceNo: invoiceNumber,
            invoiceType: "Sale",
          })
        );

        setInvoiceForm({
          ...invoiceForm,
          products: [],
          taxes: [],
          totalAmount: 0,
        });
      }
      setTimeout(() => {
        navigate("/transactions");
      }, 1000);
    }
  }, [isConfirm, dispatch, invoiceForm, params.id, navigate, invoiceNumber]);
  useEffect(() => {
    if (params.id === "new" && invoiceForm !== null) {
      setIsViewMode(false);
      dispatch(updateNewInvoiceForm(invoiceNewForm));
      dispatch(getInvoiceNumber("Sale"));
      setInvoiceForm({
        ...invoiceNewForm,
        companyDetail: { ...company },
        dueDate: "",
        createdDate: todayNepaliDate(new Date()),
      });
    }
  }, [dispatch, params]);
  useEffect(() => {
    if (params.id === "new" && invoiceForm === null) {
      dispatch(getInvoiceNumber("Sale"));
      dispatch(updateNewInvoiceForm(myNewForm));
      setInvoiceForm({
        ...invoiceNewForm,
        companyDetail: { ...company },
        dueDate: "",
        createdDate: todayNepaliDate(new Date()),
      });
    }
    if (params.id !== "new" && invoiceForm === null) {
      dispatch(getByIdInvoice(params.id));
      if (allInvoiceDetails !== null) {
        setInvoiceForm({
          ...allInvoiceDetails,
          companyDetail: { ...allInvoiceDetails?.companyDetail },
          dueDate:
            allInvoiceDetails?.dueDate !== null
              ? allInvoiceDetails?.dueDate.split("T")[0]
              : "",
          createdDate: allInvoiceDetails?.createdDate.split("T")[0],
        });
      }
      setIsViewMode(true);
    }
    return () => {
      dispatch(setAllInvoiceDetailList(null));
    };
  }, [
    params,
    // invoiceForm,
    // invoiceNewForm,
    company,
    dispatch,
    allInvoiceDetails,
  ]);
  useEffect(() => {
    if (selectedClient !== null) {
      // If Choosen Exisiting Client And This form is news
      setInvoiceForm((prev) => {
        return {
          ...prev,
          clientDetail: { ...selectedClient },
        };
      });
    }
  }, [selectedClient]);

  useEffect(() => {
    if (selectedProduct !== null) {
      const {
        title: name,
        _id: productID,
        price: amount,
        quantity: maxQuantity,
        primaryUnit,
        category,
        lowQuantityAlert,
        secondaryUnit,
        conversionRatio,
        purchasePrice,
      } = selectedProduct;
      const newProduct = {
        id: nanoid(),
        name,
        productID,
        amount,
        category,
        quantity: 1,
        maxQuantity,
        lowQuantityAlert,
        primaryUnit,
        secondaryUnit,
        prevAmount: amount,
        conversionRatio,
        isSecondaryUnitChecked: false,
        purchasePrice,
      };
      // if the productID is already exist in the invoiceForm.products
      // then we will update the quantity
      const isProductExist = invoiceForm.products.some(
        (prod) => prod.productID === productID
      );
      if (isProductExist) {
        toast.error("Product Already Exist", {
          position: "bottom-center",
          autoClose: 2000,
        });
        return;
      }
      if (maxQuantity <= 0) {
        toast.error("Product is out of stock", {
          position: "bottom-center",
          autoClose: 2000,
        });
        return;
      }
      if (maxQuantity <= lowQuantityAlert) {
        const remainingQuantity = lowQuantityAlert - maxQuantity;
        toast.warn(
          `Stock is low, only ${lowQuantityAlert - remainingQuantity} left`,
          {
            position: "bottom-center",
            autoClose: 2000,
          }
        );
      }
      setInvoiceForm((prev) => {
        let updatedData = { ...prev };
        const updateProducts = [...prev.products, newProduct];
        const subTotalAmount = sumProductTotal(updateProducts);
        const updateTaxes = getTotalTaxesWithPercent(
          prev.taxes,
          subTotalAmount
        );
        updatedData.products = updateProducts;
        updatedData.taxes = updateTaxes;
        updatedData.totalAmount = minusTotalDiscountAmount(
          subTotalAmount,
          sumTotalTaxes(updateTaxes)
        );
        return updatedData;
      });
    }
  }, [selectedProduct]);

  if (invoiceForm === null || initLoading === "loading")
    return (
      <div className="p-4">
        <EmptyBar title={"invoice detail"} initLoading={initLoading} />
      </div>
    );

  return (
    <div>
      <TitleInvoice invoiceForm={invoiceForm} params={params} title={"Sale"} />
      <div className="px-4 pb-3">
        <InvoiceTopBar
          viewMode={isViewMode}
          onClickViewAs={toggleViewMode}
          onHandleQuotation={handleQuotation}
          onClickDownloadImg={handleDownloadImg}
          subTotal={subTotal}
        />
      </div>

      {invoiceForm && (
        <>
          <div className="relative">
            <PrintInvoice
              invoiceForm={invoiceForm}
              id="InvoiceWrapper"
              isQuotation={isQuotation}
              isExporting={isExporting}
              isViewMode={isViewMode}
              componentRef={componentRef}
              invoiceNumber={invoiceNumber}
              sale={true}
            />
          </div>
          <div
            className={isViewMode ? "hidden" : "bg-white mx-4 rounded-xl mb-1"}
          >
            {/* Customer Billing Info */}
            <CustomerDetail
              invoiceForm={invoiceForm}
              setInvoiceForm={setInvoiceForm}
              openChooseClient={openChooseClient}
              isViewMode={isViewMode}
              isExporting={isExporting}
              invoiceNumber={invoiceNumber}
              merchant={false}
              title={"Bill To"}
            />
            {/* Customer Billing Info Finished */}

            {/* Products */}
            <ProductDetail
              invoiceForm={invoiceForm}
              setInvoiceForm={setInvoiceForm}
              openChooseProduct={openChooseProduct}
              addEmptyProduct={addEmptyProduct}
              isViewMode={isViewMode}
              isExporting={isExporting}
              handlerProductValue={handlerProductValue}
              subTotal={subTotal}
              handlerTaxesValue={handlerTaxesValue}
              activeUnit={activeUnit}
              setActiveUnit={setActiveUnit}
              sale={true}
            />
            {/* Products Finished */}
          </div>
        </>
      )}
      <SubmitInvoice
        invoiceForm={invoiceForm}
        setInvoiceForm={setInvoiceForm}
        params={params}
        subTotal={subTotal}
        saveAs={saveAs}
        isViewMode={isViewMode}
        dispatch={dispatch}
        setDeleteId={setDeleteId}
      />
      {invoiceForm && (
        <div className="p-4">
          <InvoiceTopBar
            viewMode={isViewMode}
            onClickViewAs={toggleViewMode}
            onHandleQuotation={handleQuotation}
            onClickDownloadImg={handleDownloadImg}
            subTotal={subTotal}
          />
        </div>
      )}
    </div>
  );
}

export default InvoiceDetailScreen;