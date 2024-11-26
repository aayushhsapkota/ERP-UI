import React,{ useState,useEffect } from "react";
import { getShowNavbar } from "../../stateManagement/slice/InitialMode";
import { useSelector } from "react-redux";
import { getDayBook } from "../../stateManagement/API/DashApi";
import { data } from "autoprefixer";


const DayBook = () => {

  const showNavbar = useSelector(getShowNavbar); //why is this brought here==> for view adjustment.
  

  const [cashIn, setCashIn] = useState([]);
  const [esewaIn, setEsewaIn] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [expense, setExpense] = useState([]);
  const [paymentOutCash, setPaymentOutCash] = useState([]);
  const [paymentOutEsewa, setPaymentOutEsewa] = useState([]);
  // const [totalCount, setTotalCount]=useState([]);
  const [salesCounts, setSalesCounts]=useState([]);

  
  useEffect(() => {
    getDayBook()
      .then(response => {
        //modifying _id to name
        console.log(response.data);
      
        const cashIn=response.data.cashSalesToday+response.data.paymentInTodayCash;
        const esewaIn= response.data.esewaSalesToday+response.data.paymentInTodayEsewa;



        setCashIn(cashIn.toLocaleString('en-In',{currency:'INR'}));
        setEsewaIn(esewaIn.toLocaleString('en-In',{currency:'INR'}));
        setPurchase(response.data.purchaseToday.toLocaleString('en-In',{currency:'INR'}));
        setExpense(response.data.totalExpenseToday.toLocaleString('en-In',{currency:'INR'}));
        setPaymentOutCash(response.data.paymentOutTodayCash.toLocaleString('en-In',{currency:'INR'}));
        setPaymentOutEsewa(response.data.paymentOutTodayEsewa.toLocaleString('en-In',{currency:'INR'}));

        // setTotalCount(response.data.totalCount);
        setSalesCounts(response.data.salesCounts);
        
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const renderSalesCounts = (salesCounts) => {
    return (
      <div>
        {Object.entries(salesCounts).map(([key, value], index) => (
          <div key={index} className="my-1">
            <span className="font-light text-sm">{key}:</span> {value}
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <div className={`bg-transparent rounded-lg overflow-hidden shadow-lg p-6 space-y-4 ${!showNavbar ? 'md:mt-8' : 'lg:mt-8'}`}>
      <div className="flex justify-center items-center border-b border-cyan-600 pb-4">
        <h3 className="text-xl font-semibold text-gray-800">Day Book</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <DataCard title="Cash Received" value={cashIn} />
        <DataCard title="Amount received in Esewa" value={esewaIn} />
        <DataCard title="Purchase" value={purchase} />
        <DataCard title="Expense" value={expense} />
        <DataCard title="Payment Out Cash" value={paymentOutCash} />
        <DataCard title="Payment Out Esewa" value={paymentOutEsewa} />
        <DataCard title="Number of Invoices" value={renderSalesCounts(salesCounts)} />
      </div>
    </div>
  );
};

const DataCard = ({ title, value }) => (
  <div className="bg-gradient-to-tr from-gray-50 to-gray-100 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
    <h2 className="text-gray-700 mb-2">{title}</h2>
    <div className="text-lg font-semibold text-gray-800">{value}</div>
  </div>
);
  

export default DayBook;
