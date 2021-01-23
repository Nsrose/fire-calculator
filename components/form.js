import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import Calculator from "../components/calculator";
import styles from '../styles/Form.module.css'



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
       <div className={styles.formContainer}>
        <form className={styles.testForm} onChange={(e) => this.handleChange(e)}>
          
          <div class="form-element">
            <label className={styles.formLabel}>Age</label>
            <div class="clearfix"></div>
            <input className={styles.formInput} id="age" name="age" defaultValue={this.state.age}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Initial Net Worth</label>
          <div class="clearfix"></div>
          <input className={styles.formInput} name="investments"  defaultValue={this.state.investments}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Stocks</label>
          <div class="clearfix"></div>
          <input className={styles.formInput} name="stocks" defaultValue={this.state.stocks}/>
          </div>


          <div class="form-element"> 
          <label className={styles.formLabel}>Bonds</label>
          <div class="clearfix"></div>
          <input className={styles.formInput} name="bonds" defaultValue={this.state.bonds}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Cash</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="cash" defaultValue={this.state.cash}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Post-Tax Income</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="income" defaultValue={this.state.income}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Current Yearly Spending</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="spending" defaultValue={this.state.spending}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Income Growth</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="incomeGrowth" defaultValue={this.state.incomeGrowth}/>
          </div>


          <div class="form-element"> 
          <label className={styles.formLabel}>Retirement Yearly Spending</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="retirementSpending" defaultValue={this.state.retirementSpending}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Withdrawal Rate</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="withdrawalRate" defaultValue={this.state.withdrawalRate}/>
          </div>


          <div class="form-element">
          <label className={styles.formLabel}>Average Retirement Tax Rate</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="retirementTaxRate" defaultValue={this.state.retirementTaxRate}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Stock returns</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="stockReturns" defaultValue={this.state.stockReturns}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}>Bond returns</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="bondReturns" defaultValue={this.state.bondReturns}/>
          </div>

        </form>

        </div>
    );
  }
};

