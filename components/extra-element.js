import React from "react";
import styles from '../styles/Form.module.css'
import extraElementStyles from '../styles/ExtraElement.module.css'
import Image from 'next/image'



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
			}, function() {
				this.handleChange(null);
			})
		} else {
			this.setState({
				oneTime: !this.state.oneTime,
				endAge: this.state.startAge
			}, function () {
				this.handleChange(null);
			})
		}
		
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
			var value;
			if (name == 'value') {
				value = parseFloat(e.target.value);
			} else if (name == "startAge" || name == "endAge") {
				value = parseInt(e.target.value);
			}
			this.state[name] = value;
		}
		this.props.parent.handleUpdate();
		
	}

	close = () => {
		this.props.parent.removeExtraIncomeExpenseModule(this.props.index);
	}

	


	render () {
		return <form className={styles.formElement} onChange={(e) => this.handleChange(e)}>
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
					<Image src="/../public/images/close-icon.png"
					width="10px"
					height="10px"/>
				</div>
				<div class={styles.clearfix}></div>
				<div class={extraElementStyles.inputContainer}>
					<div class={extraElementStyles.inputValueContainer}>
		           		Total amount: <input className={styles.formInput} name="value"/>
		           	</div>
		           	<div class={extraElementStyles.inputDurationContainer}>
		           		One-time?<input name="durationSelector" type="checkbox"
					           		onChange={(e) => this.toggleOneTime(e)}/>
		           	</div>
		           	<div class={extraElementStyles.inputStartAge}>
		           		{!this.state.oneTime ? 'Start ' : ''}Age: <input className={styles.formInput} name="startAge"/>
		           	</div>
		           	<div class={extraElementStyles.inputEndAge}
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