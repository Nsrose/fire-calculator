import React, {useEffect,useState} from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import Calculator from "../components/calculator";
import styles from '../styles/Form.module.css'
import ReactTooltip from 'react-tooltip';



export default class InputsForm extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = this.props.defaults;
    this.calculator = new Calculator();

  }

  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    window.localStorage.setItem(event.target.name, event.target.value)
    window.localStorage.getItem(event.target.name)

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
          <label className={styles.formLabel} 
          data-tip="Your current total net worth, including all <br>investments, retirement accounts, and cash">Initial Net Worth</label>
          <ReactTooltip backgroundColor="rgba(72, 64, 187, 1)"
          multiline="true"
          place="left"/>
          <div class="clearfix"></div>
          <input className={styles.formInput} name="investments"  defaultValue={this.state.investments}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in stocks">Stocks</label>

          <div class="clearfix"></div>
          <input className={styles.formInput} name="stocks" defaultValue={this.state.stocks}/>
          </div>


          <div class="form-element"> 
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in bonds">Bonds</label>
          <div class="clearfix"></div>
          <input className={styles.formInput} name="bonds" defaultValue={this.state.bonds}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in cash">Cash</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="cash" defaultValue={this.state.cash}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Your yearly income, including bonuses <br> and equity, with taxes subtracted out">Post-Tax Income</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="income" defaultValue={this.state.income}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Your yearly expenses, including things like groceries, <br>shopping, travel, gifts, and entertainment">Current Yearly Spending</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="spending" defaultValue={this.state.spending}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Your anticipated annual rate of growth in your income">Income Growth Rate</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="incomeGrowth" defaultValue={this.state.incomeGrowth}/>
          </div>


          <div class="form-element"> 
          <label className={styles.formLabel}
          data-tip="How much you plan to spend each year during retirement, which should<br> factor in house payments, vacations, education, and healthcare costs.">Retirement Yearly Spending</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="retirementSpending" defaultValue={this.state.retirementSpending}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="The percentage of your savings you plan to liquidate each year. 4% is generally considered a safe amount.">Withdrawal Rate</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="withdrawalRate" defaultValue={this.state.withdrawalRate}/>
          </div>


          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Your expected average tax rate during retirement.">Average Retirement Tax Rate</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="retirementTaxRate" defaultValue={this.state.retirementTaxRate}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Expected average returns for your equity holdings. <br>8.1% is a conservative historical estimate.">Stock returns</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="stockReturns" defaultValue={this.state.stockReturns}/>
          </div>

          <div class="form-element">
          <label className={styles.formLabel}
          data-tip="Expected average returns for your bond holdings.<br>2.4% is an average historical estimate.">Bond returns</label> 
          <div class="clearfix"></div>
          <input className={styles.formInput} name="bondReturns" defaultValue={this.state.bondReturns}/>
          </div>

        </form>

        </div>
    );
  }
};

