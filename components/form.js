import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import Calculator from "../components/calculator";
// import FixedPercentageGraph from "./graph";



export default class InputsForm extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = this.props.defaults;
    this.calculator = new Calculator();

  }

  handleChange = (event) => {
    this.state[event.target.name] = event.target.value;
    this.calculationResult = this.calculator.calculate(this.state);
    this.props.graph.current.handleUpdate(this.calculationResult);
  }


  render() {
    return (
      <form className="App" onChange={(e) => this.handleChange(e)}>
        <label>Age:</label>
        <input id="age" name="age" type="number" defaultValue={this.state.age}/>

        <label>Investments</label>
        <input name="investments" type="number" min="0.01" step="0.01" defaultValue={this.state.investments}/>

        <label>Stocks</label>
        <input name="stocks" defaultValue={this.state.stocks}/>

        <label>Bonds</label>
        <input name="bonds" defaultValue={this.state.bonds}/>

        <label>Cash</label> 
        <input name="cash" defaultValue={this.state.cash}/>

        <label>Post-Tax Income</label> 
        <input name="income" defaultValue={this.state.income}/>

        <label>Current Yearly Spending</label> 
        <input name="spending" defaultValue={this.state.spending}/>

        <label>Income Growth</label> 
        <input name="incomeGrowth" defaultValue={this.state.incomeGrowth}/>
        
        <label>Retirement Yearly Spending</label> 
        <input name="retirementSpending" defaultValue={this.state.retirementSpending}/>

        <label>Withdrawal Rate</label> 
        <input name="withdrawalRate" defaultValue={this.state.withdrawalRate}/>

        <label>Average Retirement Tax Rate</label> 
        <input name="retirementTaxRate" defaultValue={this.state.retirementTaxRate}/>

        <label>Stock returns</label> 
        <input name="stockReturns" defaultValue={this.state.stockReturns}/>

        <label>Bond returns</label> 
        <input name="bondReturns" defaultValue={this.state.bondReturns}/>

      </form>
    );
  }
};

