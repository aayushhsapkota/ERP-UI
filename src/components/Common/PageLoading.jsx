import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  getEscapeOverflow,
  getShowNavbar,
} from "../../stateManagement/slice/InitialMode";
import FoxAnimateIcon from "../Icons/FoxAnimateIcon";

function PageLoading({ firstRender }) {
  const escapeOverflow = useSelector(getEscapeOverflow);
  const showNavbar = useSelector(getShowNavbar);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setSeconds((prevSeconds) => prevSeconds + 1);
    }, 500);
    return () => clearInterval(intervalId);
  }, []);

  const dots = Array.from({ length: seconds % 4 }, (_, i) => i);
  return escapeOverflow || firstRender ? (
    <div
      className={
        escapeOverflow
          ? "w-full h-full fixed top-0 left-0 z-50 flex flex-col justify-center items-center"
          : `w-full h-full fixed left-0 z-50 flex flex-col justify-center items-center ${
              showNavbar ? " top-80 " : " top-80 lg:top-0 "
            }`
      }
    >
      <div className="w-full h-full absolute inset-0 lg:bg-[#dddddd79] opacity-50"></div>
      <div className="bg-white inline-block py-4 px-6 w-40 rounded-xl relative font-title text-center">
        <FoxAnimateIcon className="w-20 h-20 block" />
        <div className="pt-4 text-lg flex items-center mx-4">
          Loading{" "}
          {dots.map((dot) => (
            <span key={dot} className="font-medium mx-0.5">
              .
            </span>
          ))}{" "}
        </div>
      </div>
    </div>
  ) : null;
}

export default PageLoading;

