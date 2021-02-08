import React from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';
import styles from '../styles/Form.module.css'
import ReactTooltip from 'react-tooltip';
import CurrencyInput from 'react-currency-input';

const CURRENCY_FIELDS = new Set([
  "investments",
  "income",
  "spending",
  "retirementSpending"
])



export default class FormElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			name: this.props.name,
			userName: this.props.userName,
			dataTip: this.props.dataTip,
			ref: this.props.ref
		}
	}

	updateCache = (newValue) => {
		
		var newItem = {
	        value: newValue,
	        userName: this.state.userName,
	        dataTip: this.state.dataTip,
	        name: this.state.name
		}
		window.localStorage.setItem(this.state.name, JSON.stringify(newItem));
	}


	render() {
		return (

			<div>

			<ReactTooltip backgroundColor="rgba(72, 64, 187, 1)"
	          multiline={true}
	          place="left"/>

			 <div className={styles.formElement}>
	          	<label className={styles.formLabel}>{this.state.userName}</label>
		          <Image 
		          src="/images/info-icon.png"
		          width="15px"
		          height="15px"
		          data-tip={this.state.dataTip}
		          />
	          	<div className={styles.clearfix}></div>
	          	{CURRENCY_FIELDS.has(this.state.name)
        			? <CurrencyInput value={this.state.value} prefix="$" name={this.state.name} className={styles.formInput}/>
        			: <input className={styles.formInput} name={this.state.name} defaultValue={this.state.value}/>
      			}
	         </div>

	         </div>


		)

	}
}