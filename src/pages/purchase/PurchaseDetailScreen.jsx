import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  getByIdInvoice,
  setDeleteId,
  setAllInvoiceDetailList,
} from "../../stateManagement/slice/invoiceSlice";
import {
  getSelectedMerchant,
  setOpenMerchantSelector,
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
import EmptyBar from "../../components/Common/EmptyBar";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import { ProductDetail } from "../../components/Common/InvoicesCom/ProductDetail";
import { CustomerDetail } from "../../components/Common/InvoicesCom/CustomerDetail";
import Print from "../../components/Common/InvoicesCom/print";
import { TitleInvoice } from "../../components/Common/InvoicesCom/title";
import { SubmitInvoice } from "../../components/Common/InvoicesCom/submit";

function PurchaseDetailScreen(props) {
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
  };

  const componentRef = useRef(null);

  const invoiceNewForm = useSelector(getInvoiceNewForm);
  const allInvoiceDetails = useSelector(getAllInvoiceDetailSelector);
  const initLoading = useSelector(getInvoiceStatusSelector);
  const company = useSelector(getCompanyData);
  const selectedMerchant = useSelector(getSelectedMerchant);
  const selectedProduct = useSelector(getSelectedProduct);
  const isConfirm = useSelector(getIsConfirm);

  const [invoiceForm, setInvoiceForm] = useState(null);
  const [isViewMode, setIsViewMode] = useState(false);
  const [activeUnit, setActiveUnit] = useState("");

  const handleDownloadImg = useCallback(async () => {
    if (showNavbar) {
      dispatch(toggleNavbar());
    }
    dispatch(setEscapeOverflow(true));
    setIsViewMode(true);

    // make componentRef.current margin to 0
    componentRef.current.style.margin = "0";
    componentRef.current.style.borderRadius = "0";
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
          dispatch(setEscapeOverflow(false));
        }
      });
  }, [setEscapeOverflow, showNavbar, toggleNavbar, dispatch]);

  const toggleViewMode = useCallback(() => {
    setIsViewMode((prev) => !prev);
  }, [invoiceForm, isViewMode]);

  const openChooseMerchant = useCallback(() => {
    dispatch(setOpenMerchantSelector(true));
  }, [dispatch]);

  const openChooseProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 30) {
      toast.warn("You can't add more than 30 products", {
        position: "bottom-center",
        autoClose: 3000,
      });
      return;
    }
    dispatch(setOpenProductSelector(true));
  }, [dispatch, invoiceForm]);

  const addEmptyProduct = useCallback(() => {
    if (invoiceForm?.products?.length >= 30) {
      toast.warn("You can't add more than 30 products", {
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
          return toast.warn("Discount amount must be between 0 to 100", {
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

        if (keyName === "value") {
          const subTotalAmount = sumProductTotal(prev.products);
          const amount = (value / 100) * subTotalAmount;
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
            amount:
              currentTax.type === "percentage"
                ? amount
                : currentTax.type === "VATpercentage"
                ? amount
                : value,
          };
          const totalAmount = minusTotalDiscountAmount(
            subTotalAmount,
            sumTotalTaxes(taxes)
          );
          return { ...prev, taxes: taxes, totalAmount: totalAmount };
        } else {
          taxes[isFindIndex] = {
            ...taxes[isFindIndex],
            [keyName]: value,
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
        return toast.warn("Paid amount can't be greater than total amount", {
          position: "bottom-center",
          autoClose: 2000,
        });
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
      dispatch(setIsConfirm(true));
    },
    [invoiceForm?.clientDetail?.name, invoiceForm?.statusName, dispatch]
  );

  useEffect(() => {
    if (isConfirm) {
      dispatch(setIsConfirm(false));
      if (params.id !== "new") {
        dispatch(updatedInvoice(invoiceForm));
      } else {
        dispatch(
          createNewInvoice({
            ...invoiceForm,
            invoiceType: "Purchase",
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
  }, [isConfirm, dispatch, invoiceForm, params.id, navigate]);

  useEffect(() => {
    if (params.id === "new" && invoiceForm !== null) {
      setIsViewMode(false);
      dispatch(updateNewInvoiceForm(invoiceNewForm));
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
    if (selectedMerchant !== null) {
      // If Choosen Exisiting Client And This form is news
      setInvoiceForm((prev) => {
        return {
          ...prev,
          clientDetail: { ...selectedMerchant },
        };
      });
    }
  }, [selectedMerchant]);
  useEffect(() => {
    if (selectedProduct !== null) {
      const {
        title: name,
        _id: productID,
        price: amount,
        quantity: maxQuantity,
        primaryUnit,
        lowQuantityAlert,
        secondaryUnit,
        conversionRatio,
      } = selectedProduct;
      const newProduct = {
        id: nanoid(),
        name,
        productID,
        amount,
        quantity: 1,
        maxQuantity,
        primaryUnit,
        lowQuantityAlert,
        secondaryUnit,
        prevAmount: amount,
        conversionRatio,
        isSecondaryUnitChecked: false,
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
      <TitleInvoice
        invoiceForm={invoiceForm}
        params={params}
        title={"Purchase"}
      />
      <div className="px-4 pb-3">
        <InvoiceTopBar
          viewMode={isViewMode}
          onClickViewAs={toggleViewMode}
          onClickDownloadImg={handleDownloadImg}
          subTotal={subTotal}
          merchant={true}
        />
      </div>

      {invoiceForm && (
        <>
          <div className="relative">
            <Print
              invoiceForm={invoiceForm}
              id="InvoiceWrapper"
              isExporting={false}
              isViewMode={isViewMode}
              componentRef={componentRef}
              sale={false}
            />
          </div>
          <div
            className={isViewMode ? "hidden" : "bg-white mx-4 rounded-xl mb-1"}
          >
            {/* Customer Billing Info */}
            <CustomerDetail
              invoiceForm={invoiceForm}
              setInvoiceForm={setInvoiceForm}
              openChooseClient={openChooseMerchant}
              isViewMode={isViewMode}
              isExporting={false}
              merchant={true}
              title={"Purchase From"}
            />
            {/* Customer Billing Info Finished */}

            {/* Products */}
            <ProductDetail
              invoiceForm={invoiceForm}
              setInvoiceForm={setInvoiceForm}
              openChooseProduct={openChooseProduct}
              addEmptyProduct={addEmptyProduct}
              isViewMode={isViewMode}
              isExporting={false}
              handlerProductValue={handlerProductValue}
              subTotal={subTotal}
              handlerTaxesValue={handlerTaxesValue}
              activeUnit={activeUnit}
              setActiveUnit={setActiveUnit}
              sale={false}
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
            onClickDownloadImg={handleDownloadImg}
            subTotal={subTotal}
            merchant={true}
          />
        </div>
      )}
    </div>
  );
}

export default PurchaseDetailScreen;