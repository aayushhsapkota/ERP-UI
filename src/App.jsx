import { Route, Routes, Navigate, BrowserRouter } from "react-router-dom";
import React, { lazy, Suspense, useEffect } from "react";
import Container from "./components/Container/Container";
import { useSelector } from "react-redux";
//container
import ProductEditModal from "./components/Product/ProductEditModal";
import ProductDeleteConfirm from "./components/Product/ProductDeleteConfirm";
import ProductChoosenModal from "./components/Product/ProductChoosenModal";
// product end
import ClientEditModal from "./components/Clients/ClientEditModal";
import ClientDeleteConfirm from "./components/Clients/ClientDeleteConfirm";
import MerchantDeleteConfirm from "./components/Clients/MerchantDeleteConfirm";
import ClientChoosenModal from "./components/Clients/ClientChooseModal";
import MerchantChoosenModel from "./components/Clients/MerchantChooseModel";
import ClientEditPayment from "./components/Clients/clientDetail/editPayment";
// client end
import InvoiceConfirmModal from "./components/Invoice/InvoiceConfirmModal";
import InvoiceDeleteConfirm from "./components/Invoice/InvoiceDeleteConfirm";
// invoice end
import PageLoading from "./components/Common/PageLoading";
import FloatingActionButton from "./components/Common/floatingActionButton";
// page loading and floating action
import TransactionFilter from "./components/Filtering/transactionFilter";

import ExpenseFilter from "./components/Filtering/expenseFilter";
import ExpenseEditModel from "./components/Expense/ExpenseEditModel";
import ExpenseDeleteConfirm from "./components/Expense/ExpenseDeleteConfirm";

import {
  SecureClient,
  handleContextMenu as SecureClientKeyType,
  handleKeydown as SecureClientRight,
} from "./components/Common/Secure";

import { useRef } from "react";
import Login from "./pages/Login/login";

const ExpenseLazy = lazy(() =>
  wait(1000).then(() => import("./pages/expenses/ExpenseListScreen"))
);
//expenses page loading

const DashBoardLazy = lazy(() =>
  wait(1000).then(() => import("./pages/Dashboard/DashBoard"))
);
//dashboard page loading

const ProductLazy = lazy(() =>
  wait(1500).then(() => import("./pages/products/ProductListScreen"))
);
const ProductDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/products/ProductDetailScreen"))
);
//product
const ClientDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/clients/clientDetailScreen"))
);
const ClientLazy = lazy(() =>
  wait(1500).then(() => import("./pages/clients/ClientListScreen"))
);
//client

const MerchantDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/merchants/merchantDetailScreen"))
);
const MerchantLazy = lazy(() =>
  wait(1500).then(() => import("./pages/merchants/merchantListScreen"))
);
//merchant
const InvoiceLazy = lazy(() =>
  wait(1000).then(() => import("./pages/invoices/InvoiceListScreen"))
);
const InvoiceDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/invoices/InvoiceDetailScreen"))
);
const PurchaseDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/purchase/PurchaseDetailScreen"))
);
const SaleReturnDetailLazy = lazy(() =>
  wait(1000).then(() => import("./pages/saleReturn/saleReturnDetailScreen"))
);

const PurchaseReturnDetailLazy = lazy(() =>
  wait(1000).then(() =>
    import("./pages/purchaseReturn/purchaseReturnDetailScreen")
  )
);
const ImportFileLazy = lazy(() =>
  wait(500).then(() => import("./pages/import/ImportFile"))
);
const AboutLazy = lazy(() =>
  wait(500).then(() => import("./pages/about/AboutScreen"))
);

const App = () => {
  const isAuthorized = useSelector((state) => state.auth.isAuthorized);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const containerRef = useRef(null);
  useEffect(() => {
    if (process.env.NODE_ENV === "production") {
      SecureClient();
    }
  }, [SecureClientKeyType, SecureClientRight]);

  return (
    <BrowserRouter>
      {isAuthorized ? (
        <div ref={containerRef}>
          <Container>
       
            <Suspense fallback={<PageLoading firstRender={true} />}>
              <Routes>
                
              {isAdmin && <Route path="dashboard" element={<DashBoardLazy />}></Route>}
                <Route path="products">
                  <Route path="" element={<ProductLazy />} exact />
                  <Route path=":id" element={<ProductDetailLazy />} />
                </Route>
                <Route path="customer">
                  <Route path="" element={<ClientLazy />} exact />
                  <Route path=":id" element={<ClientDetailLazy />} />
                </Route>
                <Route path="merchant">
                  <Route path="" element={<MerchantLazy />} exact />
                  <Route path=":id" element={<MerchantDetailLazy />} />
                </Route>
                <Route path="invoices">
                  <Route path=":id" element={<InvoiceDetailLazy />} />
                </Route>
                <Route path="transactions">
                  <Route path="" element={<InvoiceLazy />} />
                </Route>
                <Route path="purchases">
                  <Route path=":id" element={<PurchaseDetailLazy />} />
                </Route>
                <Route path="salesreturn">
                  <Route path=":id" element={<SaleReturnDetailLazy />} />
                </Route>
                <Route path="purchasesreturn">
                  <Route path=":id" element={<PurchaseReturnDetailLazy />} />
                </Route>
                {isAdmin && <Route path="import" element={<ImportFileLazy />} />}
                <Route
                  path="about"
                  element={<AboutLazy />}
                />
                <Route path="expenses">
                  <Route path="" element={<ExpenseLazy />} exact />
                </Route>
                <Route path="*" element={<Navigate to={isAdmin ? "/dashboard" : "/invoices/new"} replace />} />
              </Routes>
            </Suspense>
            
          </Container>
          {/* this is pop up model for expenses */}
          <ExpenseEditModel />
            <ExpenseDeleteConfirm />
            <ExpenseFilter />
  
            {/* this is pop up model for product */}
            <ProductEditModal />
            <ProductDeleteConfirm />
            <ProductChoosenModal />
            {/* model close */}
            {/* this is pop up model for client */}
            <ClientEditModal />
            <ClientEditPayment />
            <ClientDeleteConfirm />
            <MerchantDeleteConfirm />
            <ClientChoosenModal />
            <MerchantChoosenModel />
            {/* model close */}
            {/* this is pop up model for invoice */}
            <InvoiceConfirmModal />
            <InvoiceDeleteConfirm />
            {/* transaction start  */}
            <TransactionFilter />
            {/* end */}
            {/* model close */}
          <FloatingActionButton containerRef={containerRef} />
        </div>
      ) : (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
      <PageLoading />
    </BrowserRouter>
  );
};

export default App;

function wait(ms = 0) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}
