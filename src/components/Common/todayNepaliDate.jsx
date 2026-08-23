import NepaliDate from "nepali-date-converter";

export const todayNepaliDate = (date) => {
  return new NepaliDate(date).format("YYYY-MM-DD");
};
