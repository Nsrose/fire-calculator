import React from "react";
import ReactDOM from "react-dom";
import Image from 'next/image';
import styles from '../styles/Form.module.css'
import ReactTooltip from 'react-tooltip';





export default class FormElement extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			value: this.props.value,
			name: this.props.name,
			userName: this.props.userName,
			dataTip: this.props.dataTip
		}
	}


	render() {
		return (

			 <div className={styles.formElement}>
	          <label className={styles.formLabel}
	          >{this.state.userName}</label>
	          <Image 
	          src="/images/info-icon.png"
	          width="15px"
	          height="15px"
	          data-tip={this.state.dataTip}
	          />
	          <div className={styles.clearfix}></div>
	          <input className={styles.formInput} name={this.state.name} defaultValue={this.state.value}/>
	          </div>


		)

	}
}