import React from "react";
import Head from 'next/head'
import Image from 'next/image';
import Header from '../components/header';
import TopBar from '../components/topbar';
import styles from '../styles/About.module.css';
import { Button } from 'react-bootstrap';
import Footer from '../components/footer';


export default class About extends React.Component {
	constructor (props) {
		super(props);
	}


	render() {
		return (<div className={styles.container}>
			<Header />
			<main className={styles.main}>
				<TopBar />

				<div className={styles.educationContainer} id="educationContainer">
				<div className={styles.fixerContainer}>


	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}>Hi, I'm Nick</div>
	              <div className={styles.description}>
	              I work as a <a href="https://www.linkedin.com/in/nicksilverose/" target="_blank" className={styles.link}>Product Manager at Google</a> and I'm passionate about teaching everyone else the secrets of personal finance that experts in Silicon Valley 
	              are already very familiar with.

	              <br></br><br></br>
	              I grew up going to public school & went to UC Berkeley for college, and it was only once I got to Google that I finally learned how the rich kids treated finance & money. 
	              I believe everyone should have access to the knowledge these kids have, and I want to use this site to share as much as I can with you all about it.
	              </div>
	            </div>

	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}>Getting wealthy is about learning the vocabulary first.</div>
	              <div className={styles.description}>
	              I believe learning most new things is 80% a vocabulary exercise & 20% actual new skills. Personal finance & wealth building in particular are 
	              full of confusing words like "appreciation", "dividend", and "asset", and you will have a much easier time learning how to grow your wealth if you take
	              some time to learn the language first. I'll use pieces of this site to explain in really simple terms what the key words of finance mean that you need to know.
	              </div>
	            </div>

	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}>Interactive visuals will help more than books.</div>
	              <div className={styles.description}>
	              Many of the concepts of personal wealth building & finance are not readily accessible to our brains because they involve growth rates that 
	              we can't properly grasp. I think interactive visuals like graphs are far more helpful in explaining these difficult concepts, like compound 
	              growth, because you'll be able to see for yourself how much little habits at the beginning build wealth over time.
	              </div>
	            </div>


	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}>Let me know what else you want to see</div>
	              <div className={styles.description}>
	              I'll try to keep this updated with your feature requests. Give me feedback on what visualizations you want to see, concepts you want explained, 
	              and tools you want built and I'll do my best to help you out.
	              </div>
	            </div>

	            


	          </div>

	          </div>
	          

			</main>
			<Footer />

		</div>)
	}
}