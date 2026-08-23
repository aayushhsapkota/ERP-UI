import NepaliDate from "nepali-date-converter";

// Nepal Standard Time is a fixed UTC+5:45 offset (no DST). Shifting the UTC
// instant by this amount and reading it back with UTC getters gives Nepal's
// wall-clock date/time regardless of the viewer's own local timezone.
const NEPAL_OFFSET_MS = (5 * 60 + 45) * 60 * 1000;

function convertDate(engDate, dateOnly = false) {
  if (!engDate) return "";
  const utcInstant = new Date(engDate);
  if (isNaN(utcInstant.getTime())) return "";

  const nepaliLocal = new Date(utcInstant.getTime() + NEPAL_OFFSET_MS);
  const year = nepaliLocal.getUTCFullYear();
  const month = nepaliLocal.getUTCMonth();
  const date = nepaliLocal.getUTCDate();

  // new Date(year, month, date) here is just a carrier for these three
  // numbers: NepaliDate reads it back with the SAME (local) getters it was
  // written with, so the round trip is correct no matter what timezone this
  // code happens to run in.
  const nepaliDate = new NepaliDate(new Date(year, month, date));
  const formattedDate = nepaliDate.format("ddd DD, MMMM YYYY");
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
    firstDate[0];

  if (dateOnly) return finalDate;

  const hours24 = nepaliLocal.getUTCHours();
  const minutes = nepaliLocal.getUTCMinutes();
  const seconds = nepaliLocal.getUTCSeconds();
  let period = "AM";
  let hours12 = hours24;
  if (hours24 >= 12) {
    period = "PM";
    hours12 = hours24 - 12;
  }
  if (hours12 === 0) {
    hours12 = 12;
  }
  const nepaliTimeOnly12hr = `${hours12}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")} ${period}`;

  return `${finalDate} ${nepaliTimeOnly12hr}`;
}

// Pretty-prints a value that is ALREADY a BS "YYYY-MM-DD" string (e.g.
// Invoice.createdDate) as "Weekday DD, Month-YYYY". Unlike convertDate above,
// this does no UTC/timezone conversion at all — there's no instant to
// convert, just a calendar string to reformat.
export function formatBsDate(bsDateString) {
  if (!bsDateString) return "";
  const nepaliDate = new NepaliDate(bsDateString);
  const formattedDate = nepaliDate.format("ddd DD, MMMM YYYY");
  const splitDate = formattedDate.split(", ");
  const firstDate = splitDate[0].split(" ");
  const secondDate = splitDate[1].split(" ");
  return (
    secondDate[1] + ", " + secondDate[0] + "-" + firstDate[1] + " " + firstDate[0]
  );
}

// Plain BS "YYYY-MM-DD" (e.g. for pre-filling a NepaliDatePicker) derived
// from a UTC timestamp, using the same timezone-safe conversion as above.
export function bsDateOnly(engDate) {
  if (!engDate) return "";
  const utcInstant = new Date(engDate);
  if (isNaN(utcInstant.getTime())) return "";

  const nepaliLocal = new Date(utcInstant.getTime() + NEPAL_OFFSET_MS);
  const year = nepaliLocal.getUTCFullYear();
  const month = nepaliLocal.getUTCMonth();
  const date = nepaliLocal.getUTCDate();

  const nepaliDate = new NepaliDate(new Date(year, month, date));
  return nepaliDate.format("YYYY-MM-DD");
}

export default convertDate;
