import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageTitle from "../../components/Common/PageTitle";
import {
  getCompanyData,
  getCompanyStatus,
  updateCompanyData,
} from "../../stateManagement/slice/companySlice";
import { defaultInputStyle } from "../../constants/defaultStyles";
import { NotifyWarning } from "../../toastify";

const emptyForm = {
  companyName: "",
  billingAddress: "",
  companyEmail: "",
  companyPhone: "",
  companyMobile: "",
};

function BusinessProfileScreen() {
  const dispatch = useDispatch();
  const company = useSelector(getCompanyData);
  const status = useSelector(getCompanyStatus);

  const [form, setForm] = useState(emptyForm);
  const [savedForm, setSavedForm] = useState(emptyForm);

  useEffect(() => {
    const loadedForm = {
      companyName: company?.companyName || "",
      billingAddress: company?.billingAddress || "",
      companyEmail: company?.companyEmail || "",
      companyPhone: company?.companyPhone || "",
      companyMobile: company?.companyMobile || "",
    };
    setForm(loadedForm);
    setSavedForm(loadedForm);
  }, [company]);

  const isDirty = Object.keys(emptyForm).some(
    (key) => form[key] !== savedForm[key]
  );

  const handleChange = useCallback((key) => (event) => {
    const value = event.target.value;
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handleSave = useCallback(() => {
    if (!isDirty) return;
    if (!form.companyName) {
      NotifyWarning("Please enter a business name");
      return;
    }
    dispatch(updateCompanyData(form));
  }, [dispatch, form, isDirty]);

  return (
    <div>
      <div className="p-4 flex justify-center items-center w-full min-h-[88vh] sm:min-h-[85vh]">
        <div className="bg-white rounded-xl px-10 py-6 sm:px-16 sm:py-10 font-title w-full sm:w-[32rem]">
          <PageTitle title="Business Profile" />

          <div className="mt-4">
            <div className="font-title text-sm text-default-color">
              Business Name
            </div>
            <input
              placeholder="Business Name"
              className={defaultInputStyle}
              value={form.companyName}
              onChange={handleChange("companyName")}
            />
          </div>

          <div className="mt-4">
            <div className="font-title text-sm text-default-color">
              Billing Address
            </div>
            <input
              placeholder="Billing Address"
              className={defaultInputStyle}
              value={form.billingAddress}
              onChange={handleChange("billingAddress")}
            />
          </div>

          <div className="mt-4">
            <div className="font-title text-sm text-default-color">Email</div>
            <input
              placeholder="Email"
              className={defaultInputStyle}
              value={form.companyEmail}
              onChange={handleChange("companyEmail")}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <div className="flex-1">
              <div className="font-title text-sm text-default-color">
                Phone
              </div>
              <input
                placeholder="Phone"
                className={defaultInputStyle}
                value={form.companyPhone}
                onChange={handleChange("companyPhone")}
              />
            </div>
            <div className="flex-1">
              <div className="font-title text-sm text-default-color">
                Mobile
              </div>
              <input
                placeholder="Mobile"
                className={defaultInputStyle}
                value={form.companyMobile}
                onChange={handleChange("companyMobile")}
              />
            </div>
          </div>

          <button
            type="button"
            disabled={status === "loading" || !isDirty}
            onClick={handleSave}
            className="mt-6 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status === "loading" ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessProfileScreen;
