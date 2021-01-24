import React from "react";

export default class Calculator extends React.Component{
    constructor(props) {
        super(props);
        this.calculate = this.calculate.bind(this);
    }


    calculate = (state) => {
        // Extracted values from input form
        var age = parseInt(state.age);
        var investments = parseFloat(state.investments);
        var stocks = parseFloat(state.stocks.slice(0, -1)) / 100;
        var bonds = parseFloat(state.bonds.slice(0, -1)) / 100;
        var cash = parseFloat(state.cash.slice(0, -1)) / 100;
        var income = parseFloat(state.income);
        var spending = parseFloat(state.spending);
        var incomeGrowth = parseFloat(state.incomeGrowth.slice(0, -1)) / 100;
        var retirementSpending = parseFloat(state.retirementSpending);
        var withdrawalRate = parseFloat(state.withdrawalRate.slice(0, -1)) / 100;
        var retirementTaxRate = parseFloat(state.retirementTaxRate.slice(0, -1)) / 100;
        var stockReturns = parseFloat(state.stockReturns.slice(0, -1)) / 100;
        var bondReturns = parseFloat(state.bondReturns.slice(0, -1)) / 100;

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
        var nextYearIncome = (1 + incomeGrowth) * income;
        var nextYearSaved = nextYearIncome - spending;
        var endOfYearSavings = 0;

        var fireYear = null;


        var year;
        var i;
        var indexofFireYear = 0;
        for (year = age + 1, i=0; year <= 100; year++, i++) {

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
                // NOTE: This checks for strict greater than / eq to, but the reference calculator is ok with with 5%, consider changing
                indexofFireYear = i; 
                fireYear = year;
            }

            previousYearSavings = endOfYearSavings;
            nextYearIncome = (1 + incomeGrowth) * nextYearIncome;
            nextYearSaved = nextYearIncome - spending;

            
        }

        return {
            "fireYear" : fireYear,
            "data" : data.slice(0, indexofFireYear+6),
            "fireTarget" : fireTarget,
        };



    }



}