import React from "react";
import styles from '../styles/Form.module.css'
import extraElementStyles from '../styles/ExtraElement.module.css'
import Image from 'next/image';
import NumberFormat from 'react-number-format';
import {parseCurrency} from '../components/util';



export default class ExtraElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			oneTime: false,
			expenseOrIncome: "expense",
			startAge : 0,
			endAge : 0,
			value: 0
		};
		this.endAgeRef = React.createRef();
	}

	toggleOneTime = (event) => {
		if (this.state.oneTime) {
			this.setState({
				oneTime: !this.state.oneTime,
				endAge: this.endAgeRef.current.value
			}, () => this.handleChange())
		} else if (!this.state.oneTime) {
			this.setState({
				oneTime: !this.state.oneTime,
				endAge: this.state.startAge
			}, () => this.handleChange())
		}
		
	}

	getValue = () => {
		return this.parseCurrency(this.state.value);
	}

	handleExpenseOrIncomeChange = (e) => {
		e.preventDefault();
		this.setState({
			expenseOrIncome: e.target.value
		}, function () {
			this.handleChange(null);
		})
	}

	handleChange = (e) => {
		if (e) {
			var name = e.target.name;
			if (name == 'value') {
				this.setState({
					value: parseCurrency(e.target.value)
				}, () => this.props.parent.handleUpdate());
			} else if (name == "startAge") {
				if (this.state.oneTime && this.state.endAge == 0) {
					this.setState({
						startAge: parseInt(e.target.value),
						endAge: parseInt(e.target.value)
					}, () => this.props.parent.handleUpdate(this.state));
				} else {
					this.setState({
						startAge: parseInt(e.target.value)
					}, ()  => this.props.parent.handleUpdate());
				}
				
				
			} else if (name == "endAge") {
				this.setState({
					endAge: parseInt(e.target.value)
				}, ()  => this.props.parent.handleUpdate());
			}
		} else {
			this.props.parent.handleUpdate();	
		}
		
		
	}

	close = () => {
		this.props.parent.removeExtraIncomeExpenseModule(this.props.index);
	}

	


	render () {
		return <form className={styles.formElement} onBlur={(e) => this.handleChange(e)}>
				<label className={styles.formLabel}>Extra</label> 
				<button className={extraElementStyles.button}
					onClick={this.handleExpenseOrIncomeChange}
					value="expense"
					style={{'background': this.state.expenseOrIncome === 'expense' ? 'grey' : ''}}
					>
					Expense
				</button>
				<button className={extraElementStyles.button}
					onClick={this.handleExpenseOrIncomeChange}
					style={{
						'background': this.state.expenseOrIncome === 'income' ? 'grey' : ''}}
					value="income">
					Income
				</button>
				<div className={extraElementStyles.close}
					onClick={this.close}>
					<Image src="/images/close-icon.png"
					width="10px"
					height="10px"/>
				</div>
				<div className={styles.clearfix}></div>
				<div className={extraElementStyles.inputContainer}>
					<div className={extraElementStyles.inputValueContainer}>
		           		Total amount: <NumberFormat thousandSeparator={true} prefix={"$"} name="value" value={this.state.value} className={styles.formInput}/>
		           	</div>
		           	<div className={extraElementStyles.inputDurationContainer}>
		           		One-time?<input name="durationSelector" type="checkbox"
					           		onChange={(e) => this.toggleOneTime(e)}/>
		           	</div>
		           	<div className={extraElementStyles.inputStartAge}>
		           		{!this.state.oneTime ? 'Start ' : ''}Age: <input className={styles.formInput} name="startAge"/>
		           	</div>
		           	<div className={extraElementStyles.inputEndAge}
		           		style={{
		           			display: !this.state.oneTime ? "block" : "none"
		           		}}
		           	>
		           	End Age: <input className={styles.formInput} name="endAge" ref={this.endAgeRef}/>
		           	</div>
				</div>
		    </form>
	}
}