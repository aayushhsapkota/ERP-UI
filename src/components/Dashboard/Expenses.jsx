import React,{ useState,useEffect } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import IdentifyTitle from "./IdentifyTask";
import { getShowNavbar } from "../../stateManagement/slice/InitialMode";
import { useSelector } from "react-redux";
import { getExpenseApi } from "../../stateManagement/API/DashApi";


const Expenses = () => {

  const showNavbar = useSelector(getShowNavbar); //why is this brought here==> for view adjustment.
  const options = [
    "This Week",
    "Last Week",
    "This Month",
    "Last Month",
    "This Year",
    "Last Year",
  ];
  
  const apiTimeRangeValues = {
    "This Week": "thisWeek",
    "Last Week": "lastWeek",
    "This Month": "thisMonth",
    "Last Month": "lastMonth",
    "This Year": "thisYear",
    "Last Year": "lastYear",
  };

  const [expenseData, setExpenseData] = useState([]);
  const [totalExpense, setTotalExpense] = useState([]);

  const [timeRange, setTimeRange] = useState(apiTimeRangeValues["This Week"]);

  const dropDownHandler = (event) => {
    setTimeRange(apiTimeRangeValues[event.value]);
  };

  useEffect(() => {
    getExpenseApi({ timeRange })
      .then(response => {
        //modifying _id to name
        let data=response.data.data;
        data.forEach(item => {
          item.name = item._id;
          delete item._id;

          // Assign color based on name
        switch (item.name) {
          case 'General':
            item.color = 'rgb(245, 230, 83)';
            break;
          case 'Marketing':
            item.color = 'rgba(0,0,0,0.5)';
            break;
          case 'Transportation':
            item.color = 'rgba(0,0,0,0.7)';
            break;
          case 'Commissions':
            item.color = 'rgb(14,165,233)';
            break;
          case 'Taxes':
            item.color = 'red';
            break;
          case 'Payroll':
            item.color = 'blue';
            break;
          case 'Rent':
            item.color = 'green';
            break;
          default:
            item.color = 'grey';  // Default color if none of the cases match
        }
        });
        

        setExpenseData(data);
        setTotalExpense(response.data.totalExpenseData.toLocaleString('en-In',{currency:'INR'})
        );
      })
      .catch(error => {
        console.error(error);
      });
  }, [timeRange]);
  

  
  return (
    <div className={`w-full px-4 pt-3 pb-4 ${!showNavbar ? 'md:mt-8' : 'lg:mt-8'} shadow-[0px_2px_10px] shadow-gray-300`}>
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-700">
          <h3>Expenses</h3>
        </div>
        <div>
          <Dropdown options={options} value={options[0]} className="text-xs" onChange={dropDownHandler} />
        </div>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-700">
          <h2>{totalExpense}</h2>
        </div>
        <div className="text-sm flex justify-center">
          <PieChart width={350} height={300}>
            <Pie
              data={expenseData}
              cx={170}
              cy={140}
              innerRadius={50}
              outerRadius={100}
              // fill="#8884d8"
              paddingAngle={0}
              dataKey="totalExpense"
              label
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs">
          <IdentifyTitle color="bg-[rgb(245,230,83)]" title="General" />
          <IdentifyTitle color="bg-[rgba(0,0,0,0.5)]" title="Marketing" />
          <IdentifyTitle color="bg-[rgba(0,0,0,0.7)]" title="Transportation" />
          <IdentifyTitle color="bg-[rgb(14,165,233)]" title="Commissions" />
          <IdentifyTitle color="bg-[red]" title="Taxes" />
          <IdentifyTitle color="bg-[blue]" title="Payroll" />
          <IdentifyTitle color="bg-[green]" title="Rent" />
        </div>
      </div>
    </div>
  );
};

export default Expenses;
