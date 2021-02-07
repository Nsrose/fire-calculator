import React from "react";
import ReactDOM from "react-dom";
import { useForm } from "react-hook-form";
import Calculator from "../components/calculator";
import styles from '../styles/Form.module.css'
import ReactTooltip from 'react-tooltip';
import Image from 'next/image';
import FormElement from "../components/form-element";
import ExtraElement from '../components/extra-element';


const CURRENCY_FIELDS = new Set([
  "investments",
  "income",
  "spending",
  "retirementSpending"
])

export default class InputsForm extends React.Component {
  

  constructor(props) {
    super(props);
    this.state = {
      extraElements: [],
      formElements: []
    }
  }

  handleUpdate = () => {
    var unfolded = this.unfoldExtraElements();
    this.props.graph.current.handleUpdate(this.props.graph.current.calculator.calculate(this.props.defaults, unfolded.extraIncome, unfolded.extraExpenses));
  }

  handleChangeToInputForm = (event) => {
    if (this.props.defaults[event.target.name]) {
      var newValue = event.target.value;
      var formElement = this.props.defaults[event.target.name].ref.current;
      formElement.updateCache(newValue);
      formElement.setState({
        value: newValue
      }, () => this.handleUpdate());
    } else {
      this.handleUpdate();  
    }
    
  }

  addExtraIncomeExpenseModule = (event) => {
    // var newElement = new ExtraElement();
    var newElementReference = React.createRef();
    this.setState({
        extraElements: this.state.extraElements.concat(
          <ExtraElement
            graph={this.props.graph}
            parent={this}
            ref={newElementReference}
            index={this.state.extraElements.length}
            key={this.state.extraElements.length}
           />
          )
    })
  }

  removeExtraIncomeExpenseModule = (index) => {
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



  render() {
    return (
       <div className={styles.formContainer}>
        <form className={styles.testForm} onBlur={(e) => this.handleChangeToInputForm(e)}>
          

        

          {this.state.formElements}

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


