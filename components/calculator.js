import React from "react";

export default class Calculator extends React.Component{
    constructor(props) {
        super(props);
        this.calculate = this.calculate.bind(this);
    }

    flattenExtraItems = (extraIncomes, extraExpenses) => {
        // flatten user input Extra Incomes and Expenses into a data structure for easy calculation
        var extraItems = {};
        for (var i = 0; i < extraIncomes.length; i++) {
            var incomeItem = extraIncomes[i];
            for (var year = incomeItem.startAge; year <= incomeItem.endAge; year++) {
                if (!extraItems[year]) {
                    extraItems[year] = {
                        extraIncome: 0,
                        extraExpense: 0,
                    }
                }

                extraItems[year].extraIncome += incomeItem.value;
            }
        }

        for (var i = 0; i < extraExpenses.length; i++) {
            var expenseItem = extraExpenses[i];
            for (var year = expenseItem.startAge; year <= expenseItem.endAge; year++) {
                if (!extraItems[year]) {
                    extraItems[year] = {
                        extraIncome: 0,
                        extraExpense: 0,
                    }
                }

                extraItems[year].extraExpense += expenseItem.value;
            }
        }

        return extraItems;
    }


    dealWithPercentage = (input) => {
        var result;
        if (input.includes("%")) {
            return parseFloat(input.slice(0, -1)) / 100;
        }
        return parseFloat(input) / 100;
    }



    calculate = (state, extraIncome, extraExpenses) => {
        // Extracted values from input form
        var age = parseInt(state.age);
        var investments = parseFloat(state.investments);
        var stocks = this.dealWithPercentage(state.stocks);
        var bonds = this.dealWithPercentage(state.bonds);
        var cash = this.dealWithPercentage(state.cash);
        var income = parseFloat(state.income);
        var spending = parseFloat(state.spending);
        var incomeGrowth = this.dealWithPercentage(state.incomeGrowth);
        var retirementSpending = parseFloat(state.retirementSpending);

        var withdrawalRate = this.dealWithPercentage(state.withdrawalRate);

        var retirementTaxRate = this.dealWithPercentage(state.retirementTaxRate);

        var stockReturns = this.dealWithPercentage(state.stockReturns);
        var bondReturns = this.dealWithPercentage(state.bondReturns);

        // Derived values from inputs
        var annualSavings = income - spending;
        var annualSavingsRate = annualSavings / income; 
        var fireTarget = (retirementSpending / withdrawalRate) + (retirementSpending / withdrawalRate) * retirementTaxRate;


        var initial = investments;
        var data = [{
            "year" : age,
            "endOfYearSavings" : investments,
            "initial" : initial,
            "saved" : 0,
            "returns" : 0
        }];
        var previousYearSavings = investments;
        var nextYearIncome = income;
        var nextYearSaved = nextYearIncome - spending;
        var endOfYearSavings = 0;

        var fireYear = null;


        var year;
        var i;
        var indexofFireYear = 0;

        var extraItems = this.flattenExtraItems(extraIncome, extraExpenses);
        for (year = age + 1, i=0; year <= 100; year++, i++) {
            // Grow income according to yearly income growth rate
            if (year == 28) {
                // debugger;
            }
            nextYearIncome = (1 + incomeGrowth) * nextYearIncome;

            // Add income & subtract extra expenses if user provided them
            var nextYearExtraIncomeExpense = 0;
            if (extraItems[year]) { //this might be off by 1
                nextYearExtraIncomeExpense += extraItems[year].extraIncome - extraItems[year].extraExpense;
            }

            // This is how much the user saves this year now 
            nextYearSaved = nextYearIncome - spending + nextYearExtraIncomeExpense;


            endOfYearSavings = (previousYearSavings + nextYearSaved) * cash * 1 
            + (previousYearSavings)*bonds*(1+bondReturns) + nextYearSaved*bonds*(1+bondReturns)**0.5 
            + (previousYearSavings)*stocks*(1+stockReturns) + nextYearSaved*stocks*(1+stockReturns)**0.5;

            data.push({
                "year" : year,
                "endOfYearSavings" : endOfYearSavings,
                "initial" : initial,
                "saved" : nextYearSaved + data[data.length - 1].saved,
                "returns" : (endOfYearSavings - (nextYearSaved + previousYearSavings)) + data[data.length - 1].returns
            });

            
            if (!fireYear && endOfYearSavings >= fireTarget) {
                // NOTE: This checks for strict greater than / eq to, but the reference calculator is ok with  5%, consider changing
                indexofFireYear = i; 
                fireYear = year;
            }

            previousYearSavings = endOfYearSavings;
            

            
        }

        return {
            "fireYear" : fireYear,
            "data" : data.slice(0, indexofFireYear+10),
            "fireTarget" : fireTarget,
        };



    }



}
