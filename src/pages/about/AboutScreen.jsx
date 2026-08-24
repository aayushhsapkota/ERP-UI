import React from "react";
import PageTitle from "../../components/Common/PageTitle";

function AboutScreen() {
  return (
    <div>
      <div className="p-4 flex justify-center items-center w-full min-h-[88vh] sm:min-h-[85vh]">
        <div className="bg-white rounded-xl px-10 py-6 sm:px-16 sm:py-10 font-title">
          <PageTitle title="Quartz Technology Pvt Ltd." />

          <PageTitle title="Billing Management System" />
          <div className="mt-2 pl-4 text-sm">
            <ul class="list-disc">
              <li> Can Easily Pre-Manage Your Products</li>
              <li> Can Easily Pre-Manage Your Clients</li>
              <li> Can Export PDF </li>
              <li> Can Export Image </li>
            </ul>
          </div>

          <PageTitle title="Build By" />
          <div className="mt-2 mb-5 pl-4 text-sm">
            <ul class="list-disc">
              <li> Framer Motion For each component Animation</li>
              <li> Lottiefiles For Dashboard Widgets Icons</li>
              <li> Redux For State Management</li>
              <li> ReactJS </li>
            </ul>
          </div>

          <PageTitle title="Contact" />
          <div className="mt-2 pl-1 text-sm">
            <a
              href="tel:+61420223902"
              className="underline cursor-pointer"
              target={"_blank"}
              rel="noreferrer"
            >
              {" "}
              +61420223902
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AboutScreen;
