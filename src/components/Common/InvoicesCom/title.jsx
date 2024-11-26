import PageTitle from "../PageTitle";

export const TitleInvoice = ({ invoiceForm, params, title }) => {
  return (
    <div className="p-4 mt-4">
      <PageTitle
        title={
          <>
            {params.id === "new"
              ? title === "Sale" || title === "Purchase"
                ? `New ${title}`
                : title
              : `${invoiceForm?.statusName || ""} - ${title} Detail`}
          </>
        }
      />
    </div>
  );
};
