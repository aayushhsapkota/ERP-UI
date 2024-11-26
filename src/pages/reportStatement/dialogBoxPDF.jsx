import { Menu, Transition } from "@headlessui/react";
import { Fragment, useCallback } from "react";
import { MdPictureAsPdf } from "react-icons/md";
import { jsPDF } from 'jspdf';
import {
  setToggleNavbar as toggleNavbar,
  getShowNavbar,
  setEscapeOverflow,
} from "../../stateManagement/slice/InitialMode";
import { useDispatch, useSelector } from "react-redux";
import html2canvas from 'html2canvas';
import { useReactToPrint } from "react-to-print";
import convertDate from "../../components/Common/ConvertEnglishDate";
import { todayNepaliDate } from "../../components/Common/todayNepaliDate";
import NepaliDate from "nepali-date-converter";

export default function DialogBoxPDF({ componentRef, setOpenPdf, name }) {
  const nepaliDate= new NepaliDate();
  const formattedDate = nepaliDate.format('YYYY-MM-DD');
  const dispatch = useDispatch();
  const showNavbar = useSelector(getShowNavbar);
  const reactToPrintContent = useCallback(() => {
    return componentRef.current;
  }, []);
  // const windowSize =
  //   window.innerWidth < 600 && window.innerWidth > 300
  //     ? "sm"
  //     : window.innerWidth > 600 && window.innerWidth < 1000
  //     ? "md"
  //     : window.innerWidth > 1000 && window.innerWidth < 1600
  //     ? "lg"
  //     : "lg";
  const handlePrint = useReactToPrint({
    content: reactToPrintContent,
    documentTitle: "Paradise Cafe",
    onBeforeGetContent: useCallback(() => {
      dispatch(setEscapeOverflow(true));
      setOpenPdf(true);
    }, [setEscapeOverflow, dispatch, setOpenPdf]),
    onAfterPrint: useCallback(() => {
      dispatch(setEscapeOverflow(false));
      setOpenPdf(false);
    }, [setEscapeOverflow, dispatch]),
    removeAfterPrint: true,
  });

const handleDownloadPdf = useCallback(async () => {
  const clonedElement = componentRef.current.cloneNode(true);
  clonedElement.style.padding = "1rem";
  document.body.appendChild(clonedElement);
  dispatch(setEscapeOverflow(true));
  const scale = 4; // adjust the scale as you see fit

  html2canvas(clonedElement, { scale: scale })
    .then(async (canvas) => {
      // Convert the canvas to image data
      const imgData = canvas.toDataURL('image/jpeg');

      const originalWidth = canvas.width;
      const originalHeight = canvas.height;

      const targetPdfWidth = 210; // A4 width in mm

      const scaleFactor = targetPdfWidth / originalWidth;

      let pdfWidth = originalWidth * scaleFactor;
      let pdfHeight = originalHeight * scaleFactor;

      const minPdfHeight = 297; // A4 height in mm
      const finalPdfHeight = Math.max(minPdfHeight, pdfHeight);

      const pdf = new jsPDF('p', 'mm', [pdfWidth, finalPdfHeight]);

      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);

      const fileName = "Statement_" + (name?.split(" ")[0]) + "_" + todayNepaliDate(new Date()) + ".pdf";

      pdf.save(fileName);
    })
    .catch((err) => {
      console.error(err);
      document.body.removeChild(clonedElement);
      setOpenPdf(false);
      dispatch(setEscapeOverflow(false));
    })
    .finally(() => {
      document.body.removeChild(clonedElement);
      setOpenPdf(false);
      dispatch(setEscapeOverflow(false));
    });
}, [dispatch, setEscapeOverflow]);
  
  return (
    <Menu as="div">
      <div>
        <Menu.Button>
  <MdPictureAsPdf className="h-7 w-7 text-white cursor-pointer hover:text-gray-100" />
</Menu.Button>

      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute z-50 right-2 w-24 divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <Menu.Item>
            <button
              className={`text-gray-700 hover:bg-gray-100
                 group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              onClick={() => {
                setOpenPdf(true);
                // if (showNavbar) {
                //   dispatch(toggleNavbar());
                // }
                setTimeout(() => {
                  handleDownloadPdf();
                }, 500);
              }}
            >
              Download
            </button>
          </Menu.Item>
          <Menu.Item>
            <button
              className={`text-gray-700 hover:bg-gray-100
                 group flex w-full items-center rounded-md px-3 py-2 text-sm`}
              onClick={() => {
                setOpenPdf(true);
                setTimeout(() => {
                  handlePrint();
                }, 1);
              }}
            >
              Print
            </button>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
