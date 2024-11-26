import NepaliDate from "nepali-date-converter";
function convertDate(date,engDate=null, noRequire = false) {
  // let dateObj = new Date(date);
  let nepaliTimeOnly12hr = '';
  if(engDate){
    const createdAt = new Date(engDate); 
  const nepaliTimeInMs = new Date(createdAt.getTime() + (5*60 + 45)*60*1000);
  const hours24 = nepaliTimeInMs.getUTCHours();
const minutes = nepaliTimeInMs.getUTCMinutes();
const seconds = nepaliTimeInMs.getUTCSeconds();
// Convert to 12-hour format
let period = 'AM';
let hours12 = hours24;
if (hours24 >= 12) {
  period = 'PM';
  hours12 = hours24 - 12;
}
if (hours12 === 0) {
  hours12 = 12;
}
// Format to 12-hour time string
nepaliTimeOnly12hr = `${hours12}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} ${period}`;
  }
  

  let dateObj = new NepaliDate(date);
  const formattedDate = dateObj.format("ddd DD, MMMM YYYY");
  const splitDate = formattedDate.split(", ");
  const firstDate = splitDate[0].split(" ");
  const secondDate = splitDate[1].split(" ");
  const finalDate =
    secondDate[1] +
    ", " +
    secondDate[0] +
    "-" +
    firstDate[1] +
    " " +
    firstDate[0]+" "+
    nepaliTimeOnly12hr;
  // let year = dateObj.getFullYear();
  // let month = NepaliFunctions.GetBsMonth(dateObj.getMonth());
  // let day = dateObj.getDate();
  // let time = dateObj.toLocaleTimeString();
  // time = time.slice(0, 4) + time.slice(7, 11);
  // let time = "";
  // return `${year}, ${month}-${day}${!noRequire ? ` ${time}` : ""}`;
  return finalDate;
}

export default convertDate;
