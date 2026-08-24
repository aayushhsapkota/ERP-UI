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

const MAX_LOGO_SIZE_MB = 2;
const MAX_LOGO_SIZE_BYTES = MAX_LOGO_SIZE_MB * 1024 * 1024;

const emptyForm = {
  companyName: "",
  billingAddress: "",
  companyEmail: "",
  companyPhone: "",
  companyMobile: "",
  image: "",
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
      image: company?.image || "",
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

  const handleImageChange = useCallback((event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      NotifyWarning("Please choose an image file");
      return;
    }
    if (file.size > MAX_LOGO_SIZE_BYTES) {
      NotifyWarning(`Logo must be under ${MAX_LOGO_SIZE_MB}MB`);
      event.target.value = "";
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setForm((prev) => ({ ...prev, image: reader.result }));
    };
    reader.readAsDataURL(file);
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

          <div className="mt-4 flex flex-col items-center">
            <div className="h-20 w-20 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
              {form.image ? (
                <img
                  src={form.image}
                  alt="Business logo"
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs text-gray-400">No Logo</span>
              )}
            </div>
            <label className="mt-2 text-sm cursor-pointer primary-self-text underline">
              Upload Logo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

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
