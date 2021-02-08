import React from "react";
import {dealWithPercentage, parseCurrency} from '../components/util';



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


    

    getValueFromState = (element) => {
        if (element.ref.current) {
            return element.ref.current.state.value;
        }
        return element.props.value;
    }


    calculate = (state, extraIncome, extraExpenses) => {

        // Extracted values from input form
        var age = parseInt(this.getValueFromState(state.age));
        var investments = parseCurrency(this.getValueFromState(state.investments));
        var stocks = dealWithPercentage(this.getValueFromState(state.stocks));
        var bonds = dealWithPercentage(this.getValueFromState(state.bonds));
        var cash = dealWithPercentage(this.getValueFromState(state.cash));
        var income = parseCurrency(this.getValueFromState(state.income));
        var spending = parseCurrency(this.getValueFromState(state.spending));
        var incomeGrowth = dealWithPercentage(this.getValueFromState(state.incomeGrowth));
        var retirementSpending = parseCurrency(this.getValueFromState(state.retirementSpending));

        var withdrawalRate = dealWithPercentage(this.getValueFromState(state.withdrawalRate));

        var retirementTaxRate = dealWithPercentage(this.getValueFromState(state.retirementTaxRate));

        var stockReturns = dealWithPercentage(this.getValueFromState(state.stockReturns));
        var bondReturns = dealWithPercentage(this.getValueFromState(state.bondReturns));

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
        for (year = age + 1, i=1; year <= 100; year++, i++) {
            // Grow income according to yearly income growth rate

            nextYearIncome = (1 + incomeGrowth) * nextYearIncome;

            // Add income & subtract extra expenses if user provided them
            var nextYearExtraIncomeExpense = 0;
            if (extraItems[year]) { //this might be off by 1
                nextYearExtraIncomeExpense += extraItems[year].extraIncome - extraItems[year].extraExpense;
            }

            // This is how much the user saves this year now 
            nextYearSaved = nextYearIncome - spending + nextYearExtraIncomeExpense;
            // debugger;
            if (data[i-1].endOfYearSavings > 0) {
                endOfYearSavings = (previousYearSavings + nextYearSaved) * cash * 1 
                + (previousYearSavings)*bonds*(1+bondReturns) + nextYearSaved*bonds*(1+bondReturns)**0.5 
                + (previousYearSavings)*stocks*(1+stockReturns) + nextYearSaved*stocks*(1+stockReturns)**0.5;
            } else {
                endOfYearSavings = (data[i-1].endOfYearSavings+ nextYearSaved);
            }
            

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
