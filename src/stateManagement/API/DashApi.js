import API from "./index";

export const getRevenueApi = ({ timeRange }) => {
  return API.get(`/dashData/revenueData`, {
    params: {
      timeRange,
    },
  });
};

export const getPurchaseApi = ({ timeRange }) => {
  return API.get(`/dashData/purchaseData`, {
    params: {
      timeRange,
    },
  });
};

export const getExpenseApi = ({ timeRange }) => {
  return API.get(`/dashData/expenseData`, {
    params: {
      timeRange,
    },
  });
};

export const getRevenueByCategoryApi = ({ timeRange }) => {
  return API.get(`/dashData/revenueByCategory`, {
    params: {
      timeRange,
    },
  });
};

export const getStock = () => {
  return API.get(`/dashData/stockData`);
};

export const getFinancials = () => {
  return API.get(`/dashData/financialData`);
};

export const getCashFlow = () => {
    return API.get(`/dashData/cashFlowData`);
  };

  export const getDayBook = () => {
    return API.get(`/dashData/dayBookData`);
  };

  export const getMonthProfit = () => {
    return API.get(`/dashData/getMonthlyProfit`);
  };
  
  
