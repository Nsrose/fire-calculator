import React from "react";
import Head from 'next/head'
import Image from 'next/image';
import TripHeader from '../components/trip-header';
import TopBar from '../components/topbar';
import styles from '../styles/About.module.css';
import { Button } from 'react-bootstrap';
import Footer from '../components/footer';
import Splitwise from '../node_modules/splitwise';
import Link from "next/link";

var SPLITWISE_API_KEY = "yNaIqZjz2ztidmKq1SlmsFr6zsaSV29tfuHCxI5T";


export default class Trips extends React.Component {
	constructor (props) {
		super(props);
		const sw = Splitwise({
  			consumerKey: 'o7yokwOJyej2yX1T3SVyiTqK95c7FoYuretCM1wB',
  			consumerSecret: 'NX3dV83FIRT8IBDAOg5tmm2YNDdk4e1kDFb3dTTe',
  			logger: console.log
		});

		sw.getCurrentUser().then(console.log) // => { id: ... }
	}

	// https://github.com/keriwarr/splitwise. You need to download https://chrome.google.com/webstore/detail/moesif-origin-cors-change/digfbfaphojjndkpccljibejjbppifbc?hl=en-US to make this work in dev


	initiate = () => {
		window.open('https://www.notion.so/Trip-Planning-Template-fc4bb38a5a1748b5a122e93a69e93401'); 
	    window.open('https://secure.splitwise.com/groups/new');
	}


	render() {
		return (<div className={styles.container}>
			<TripHeader />
			<main className={styles.main}>
				

				<div className={styles.educationContainer} id="educationContainer">
				<div className={styles.fixerContainer}>


	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}>Start a new trip</div>
	          
	            </div>

	          
	  
				<div><a href="https://www.notion.so/Trip-Planning-Template-fc4bb38a5a1748b5a122e93a69e93401?duplicate=true" target='_blank'>Create planning template</a></div>
	            <div><a href="https://secure.splitwise.com/groups/new" target='_blank'>Create Splitwise group</a></div>
	            

	            


	          </div>

	          </div>
	          

			</main>
			<Footer />

		</div>)
	}
}