import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import Calculator from "../components/calculator";
import styles from '../styles/Form.module.css'
import ReactTooltip from 'react-tooltip';
import Image from 'next/image'
import ExtraElement from '../components/extra-element';


export default class InputsForm extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
      extraElements: []
    }

  }

  handleUpdate = () => {
    var unfolded = this.unfoldExtraElements();
    this.props.graph.current.handleUpdate(this.props.graph.current.calculator.calculate(this.props.defaults, unfolded.extraIncome, unfolded.extraExpenses));
  }

  handleChangeToInputForm = (event) => {
    this.props.defaults[event.target.name] = event.target.value;
    this.handleUpdate();
  }

  addExtraIncomeExpenseModule = (event) => {
    var newElement = new ExtraElement();
    var newElementReference = React.createRef();
    this.setState({
        extraElements: this.state.extraElements.concat(
          <ExtraElement
            graph={this.props.graph}
            parent={this}
            ref={newElementReference}
            index={this.state.extraElements.length}
           />
          )
    })
  }

  removeExtraIncomeExpenseModule = (index) => {
    // debugger;
    var array = [...this.state.extraElements];
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({extraElements: array},
        function() {
          this.handleUpdate();
        });
    }

  }

  unfoldExtraElements = () => {
    // turns extra elements into 2 extraincome and extraexpenses arrays
    var extraIncome = [];
    var extraExpenses = [];
    

    for (var i = 0; i < this.state.extraElements.length; i++) {
      var extraElement = this.state.extraElements[i].ref.current;
      if (extraElement.state.expenseOrIncome == "expense") {
        extraExpenses.push(extraElement.state);
      } else {
        extraIncome.push(extraElement.state);
      }
    }

    return {
      extraIncome: extraIncome, 
      extraExpenses: extraExpenses
    }

  }

  // addExtraIncomeExpenseToCalculation = () => {
  //   var unfolded = this.unfoldExtraElements();

  //   this.props.graph.current.handleUpdate(this.props.graph.current.calculator.calculate(this.props.defaults, unfolded.extraIncome, unfolded.extraExpenses));
    

  // }



  render() {
    return (
       <div className={styles.formContainer}>
        <form className={styles.testForm} onChange={(e) => this.handleChangeToInputForm(e)}>
          
          <div className={styles.formElement}>
            <label className={styles.formLabel}>Age</label>

            <div className={styles.clearfix}></div>
            <input className={styles.formInput} id="age" name="age" defaultValue={this.props.defaults.age}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel} 
          data-tip="Your current total net worth, including all <br>investments, retirement accounts, and cash">Initial Net Worth</label>
          <ReactTooltip backgroundColor="rgba(72, 64, 187, 1)"
          multiline="true"
          place="left"/>
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="investments"  defaultValue={this.props.defaults.investments}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in stocks">Stocks</label>

          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="stocks" defaultValue={this.props.defaults.stocks}/>
          </div>


          <div className={styles.formElement}> 
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in bonds">Bonds</label>
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="bonds" defaultValue={this.props.defaults.bonds}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="The percentage of your net worth allocated in cash">Cash</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="cash" defaultValue={this.props.defaults.cash}/>
          </div>


          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Your yearly income, including bonuses <br> and equity, with taxes subtracted out">Post-Tax Income</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="income" defaultValue={this.props.defaults.income}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Your yearly expenses, including things like groceries, <br>shopping, travel, gifts, and entertainment">Current Yearly Spending</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="spending" defaultValue={this.props.defaults.spending}/>
          </div>


          

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Your anticipated annual rate of growth in your income">Income Growth Rate</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="incomeGrowth" defaultValue={this.props.defaults.incomeGrowth}/>
          </div>


          <div className={styles.formElement}> 
          <label className={styles.formLabel}
          data-tip="How much you plan to spend each year during retirement, which should<br> factor in house payments, vacations, education, and healthcare costs.">Retirement Yearly Spending</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="retirementSpending" defaultValue={this.props.defaults.retirementSpending}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="The percentage of your savings you plan to liquidate each year. 4% is generally considered a safe amount.">Withdrawal Rate</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="withdrawalRate" defaultValue={this.props.defaults.withdrawalRate}/>
          </div>


          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Your expected average tax rate during retirement.">Average Retirement Tax Rate</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="retirementTaxRate" defaultValue={this.props.defaults.retirementTaxRate}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Expected average returns for your equity holdings. <br>8.1% is a conservative historical estimate.">Stock returns</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="stockReturns" defaultValue={this.props.defaults.stockReturns}/>
          </div>

          <div className={styles.formElement}>
          <label className={styles.formLabel}
          data-tip="Expected average returns for your bond holdings.<br>2.4% is an average historical estimate.">Bond returns</label> 
          <div className={styles.clearfix}></div>
          <input className={styles.formInput} name="bondReturns" defaultValue={this.props.defaults.bondReturns}/>
          </div>

          <div className={styles.formElementMore} onClick={this.addExtraIncomeExpenseModule}>
            
            <div className={styles.moreText}>Add extra income and expenses (children, home purchase, real estate revenue)</div>
            <div className={styles.moreAction}>
              <Image 
                src="/images/plus-icon-2.png"
                width="30px"
                height="30px"
              />
            </div>
            <div className={styles.clearfix}></div>
          </div>
          <div className={styles.clearfix}></div>

          {this.state.extraElements}

        </form>

        </div>
    );
  }
};

