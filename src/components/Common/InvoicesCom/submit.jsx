import Button from "../../Button/Button";
import CheckCircleIcon from "../../Icons/CheckCircleIcon";
import DollarIcon from "../../Icons/DollarIcon";
import SecurityIcon from "../../Icons/SecurityIcon";

export const SubmitInvoice = ({
  invoiceForm,
  params,
  subTotal,
  saveAs,
  isViewMode,
  dispatch,
  setDeleteId,
}) => {
  return (
    subTotal > 0 && (
      <div className="px-4 pt-3">
        <div className="bg-white rounded-xl px-3 py-3">
          <div className="flex flex-col flex-wrap sm:flex-row">
            {params.id === "new" && (
              <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                <Button
                  outlined={1}
                  size="sm"
                  block={1}
                  secondary={1}
                  onClick={() => saveAs("Draft")}
                >
                  <CheckCircleIcon className="h-5 w-5 mr-1" /> Save As Draft
                </Button>
              </div>
            )}
            {(params.id !== "new" && isViewMode) ||
              ((invoiceForm.paidAmount === 0 ||
                invoiceForm.paidAmount === "0" ||
                invoiceForm.paidAmount === "") && (
                <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                  <Button
                    outlined={1}
                    size="sm"
                    block={1}
                    danger={1}
                    onClick={() => saveAs("Unpaid")}
                  >
                    <DollarIcon className="h-5 w-5 mr-1" />{" "}
                    {params.id === "new" ? "Save" : "Update"} As Unpaid
                  </Button>
                </div>
              ))}
            {params.id !== "new" && isViewMode && (
              <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                <Button
                  outlined={1}
                  size="sm"
                  block={1}
                  danger={1}
                  onClick={() => {
                    dispatch(setDeleteId(invoiceForm._id));
                  }}
                >
                  Delete Sales
                </Button>
              </div>
            )}
            {invoiceForm.paidAmount > 0 &&
              invoiceForm.paidAmount < invoiceForm.totalAmount && (
                <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                  <Button
                    outlined={1}
                    size="sm"
                    block={1}
                    danger={1}
                    onClick={() => saveAs("Partial")}
                  >
                    <DollarIcon className="h-5 w-5 mr-1" />{" "}
                    {params.id === "new" ? "Save" : "Update"} As Partial Paid
                  </Button>
                </div>
              )}
            {invoiceForm.paidAmount >= invoiceForm.totalAmount && (
              <div className="w-full flex-1 my-1 sm:my-1 md:my-0 px-1">
                <Button
                  size="sm"
                  block={1}
                  success={1}
                  onClick={() => saveAs("Paid")}
                >
                  <SecurityIcon className="h-5 w-5 mr-1" />{" "}
                  {params.id === "new" ? "Save" : "Update"} As Paid
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  );
};
