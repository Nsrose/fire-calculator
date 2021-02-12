import React from "react";
import styles from '../styles/Home.module.css'
import { Button } from 'react-bootstrap';


export default class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<footer className={styles.footer}>
	          <div className={styles.clearfix}></div>
	          <Button variant="outline-warning" className={styles.feedback}><a href="https://docs.google.com/forms/d/e/1FAIpQLSdZhF7cTfyrgHZdLlHP-OGZKnnvuC6kf1n51h-pKbJTJ_1hbQ/viewform?usp=sf_link"
	         target="_blank" className={styles.feedbackText}>File a bug or feature request</a></Button>
	         <div className={styles.clearfix}></div>
	        </footer>

		)
	}
}

