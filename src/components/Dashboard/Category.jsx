import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import React, {useState, useEffect} from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import IdentifyTitle from "./IdentifyTask";
import { getRevenueByCategoryApi } from "../../stateManagement/API/DashApi";

const RADIAN = Math.PI / 180;

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

export const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  netRevenue,
  name,
  index,
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g key={`slice-${index}`}> {/* Unique key to make each label unique */}
    <text
      x={x}
      y={y}
      fill="black"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {netRevenue.toFixed(2)+"%"}
    </text>
    
    {/* <text
        x={x}
        y={y + 15}  // Add some vertical offset to put the name below the percentage
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={12}  // A different size for the name
      >
        {name}  
      </text> */}
      </g>
  );
};

const Category = () => {

  const [categoryData, setCategoryData] = useState([]);
  const [topCategory, setTopCategory] = useState([]);

  const [timeRange, setTimeRange] = useState(apiTimeRangeValues["This Week"]);

  const dropDownHandler = (event) => {
    setTimeRange(apiTimeRangeValues[event.value]);
  };
  
  useEffect(() => {
    getRevenueByCategoryApi({ timeRange })
      .then(response => {
        const totalRevenue=response.data.totalRevenue;
        const data= response.data.finalData;

        let modifiedData= data.map(item=>{
        const percentage = (item.netRevenue / totalRevenue) * 100;
        return { ...item, netRevenue: parseFloat(percentage.toFixed(2))};
        });

        //appending colors
        modifiedData.forEach(item => {
          // Assign color based on name
        switch (item.name) {
          case 'Barista':
            item.color = "rgb(125,211,252)";
            break;
          case 'Food':
            item.color = "rgb(3,105,161)";
            break;
          case 'Liquor':
            item.color = "rgb(2,132,199)";
            break;
          case 'Drinks':
            item.color="blue";
            break;
          default:
            item.color = "rgb(12,74,110)";  // Default color if none of the cases match
        }
      })

        let maxRevenueObject = modifiedData.reduce((maxObj, currentObj) => {
          // Extract the numeric part of the netRevenue string, which is a percentage
          let currentRevenue = parseFloat(currentObj.netRevenue);
          let maxRevenue = parseFloat(maxObj.netRevenue);
          
          // If the current item's netRevenue is greater than maxObj's netRevenue, return the current item;
          // otherwise, return maxObj
          return (currentRevenue > maxRevenue) ? currentObj : maxObj;
        }, modifiedData[0]); // Start with the first item of the array


        setCategoryData(modifiedData);
        setTopCategory(maxRevenueObject.name);
      })
      .catch(error => {
        console.error(error);
      });
  }, [timeRange]);
  

  return (
    <div className="w-full px-4 pt-3 pb-4 shadow-[0px_2px_10px] shadow-gray-300">
      <div className="flex justify-between items-center">
        <div className="font-semibold text-gray-700">
          <h3>Category</h3>
        </div>
        <div>
          <Dropdown options={options} value={options[0]} className="text-xs" onChange={dropDownHandler}/>
        </div>
      </div>
      <div className="mt-8">
        <div className="flex justify-center">
          <PieChart width={300} height={250}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              // label
              outerRadius={110}
              fill="#8884d8"
              dataKey="netRevenue"
            >
              {categoryData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </div>
        <div className="text-gray-700 text-sm">
          <span className="text-gray-600">Top Revenue:</span>
          <span className="text-black font-semibold px-2">{topCategory}</span>
        </div>
        <div className="grid grid-cols-2 gap-1 text-xs mt-6">
          <IdentifyTitle color="bg-[rgb(12,74,110)]" title="General" />
          <IdentifyTitle color="bg-[rgb(125,211,252)]" title="Barista" />
          <IdentifyTitle color="bg-[rgb(3,105,161)]" title="Food" />
          <IdentifyTitle color="bg-[rgb(2,132,199)]" title="Liquor" />
          <IdentifyTitle color="bg-[blue]" title="Drinks" />


        </div>
      </div>
    </div>
  );
};

export default Category;

