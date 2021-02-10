


export const DEFAULTS = {
    age : {
        value: 25,
        userName: "Age",
        dataTip: "Your current age",
        name: "age"
      },
      investments: {
        value: "$50,000.00",
        userName: "Initial Net Worth",
        dataTip: "Your current total net worth, including all <br>investments, retirement accounts, and cash",
        name: 'investments',
        isCurrency: true

      },
      stocks: {
        value: "90%",
        userName: "Stocks",
        dataTip: "The percentage of your net worth allocated in stocks",
        name: "stocks",
      },
      bonds: {
        value: "7%",
        userName: "Bonds",
        dataTip: "The percentage of your net worth allocated in bonds",
        name: "bonds",
      },
      cash: {
        value: "3%",
        userName: "Cash",
        dataTip: "The percentage of your net worth allocated in cash",
        name: "cash",
      },
      income: {
        value: "$50,000.00",
        userName: "Income",
        dataTip: "Your yearly income, including bonuses, <br> equity, & employer matching (401k), with taxes subtracted out",
        name: "income",
        isCurrency: true
      },
      spending: {
        value: "$30,000.00",
        userName: "Current Yearly Spending",
        dataTip: "Your yearly expenses, including things like groceries, <br>shopping, travel, gifts, and entertainment",
        name: "spending",
        isCurrency: true
      },
      incomeGrowth: {
        value: "2%",
        userName: "Income Growth Rate",
        dataTip: "Your anticipated annual rate of growth in your income",
        name: "incomeGrowth",
      },
      retirementSpending: {
        value: "$100,000.00",
        userName: "Retirement Yearly Spending",
        dataTip: "How much you plan to spend each year during retirement, which should<br> factor in house payments, vacations, education, and healthcare costs.",
        name: "retirementSpending",
        isCurrency: true
      },
      withdrawalRate: {
        value: "4%",
        userName: "Withdrawal Rate",
        dataTip: "The percentage of your savings you plan to liquidate each year. 4% is generally considered a safe amount.",
        name: "withdrawalRate",
      },
      retirementTaxRate: {
        value: "7%",
        userName: "Average Retirement Tax Rate",
        dataTip: "Your expected average tax rate during retirement.",
        name: "retirementTaxRate",
      
      },
      stockReturns: {
        value: "8.1%",
        userName: "Stock Returns",
        dataTip: "Expected average returns for your equity holdings. <br>8.1% is a conservative historical estimate.",
        name: "stockReturns",
      },
      bondReturns: {
        value: "2.4%",
        userName: "Bond Returns",
        dataTip: "Expected average returns for your bond holdings.<br>2.4% is an average historical estimate.",
        name: "bondReturns",
      },
}


export const isInt = (n) => {
    return Number(n) === n && n % 1 === 0;
}

export const isFloat = (n) => {
    return Number(n) === n && n % 1 !== 0;
}


export const dealWithPercentage = (input) => {
    var result;
    if (input.includes("%")) {
        return parseFloat(input.slice(0, -1)) / 100;
    }
    return parseFloat(input) / 100;
}

export const parseCurrency = (input) => {
	if (isInt(input) || isFloat(input)) {
		return input;
	}
    return Number(input.replace(/[^0-9\.-]+/g,""));
}


export const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  });


export const dataToCSV = (newData) => {
	return newData;
};

