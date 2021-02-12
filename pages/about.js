import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import Image from 'next/image';
import Header from '../components/header';
import TopBar from '../components/topbar';


export default class About extends React.Component {
	constructor (props) {
		super(props);
	}


	render() {
		return (<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<TopBar />
			</main>


		</div>)
	}
}