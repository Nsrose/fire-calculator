import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InputsForm from '../components/form'
import FixedPercentageGraph from '../components/graph';
import { Doughnut } from 'react-chartjs-2';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
    this.formReference = React.createRef();
    this.defaults = {
      "age" : 26,
      "investments" : 417300,
      "stocks" : 0.9,
      "bonds" : 0.07,
      "cash" : 0.03,
      "income" : 141000.00,
      "spending" : 72000.00,
      "incomeGrowth" : 0.02,
      "retirementSpending" : 100000.00,
      "withdrawalRate" : 0.04,
      "retirementTaxRate" : 0.07,
      "stockReturns" : 0.081,
      "bondReturns" : 0.024
    };
  }



  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>FatFire Calculator</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

       

        <main className={styles.main}>
          <h1 className={styles.title}>
            FatFire Calculator
          </h1>

          <p className={styles.description}>
            How long until I can chill on the beach for the rest of my life?
          </p>
      
          <InputsForm 
          graph={this.chartReference}
          defaults={this.defaults}
          />

          <div className={styles.graph}>
          <FixedPercentageGraph 
            ref={this.chartReference}
            form={this.formReference}
            defaults={this.defaults}
          />
          </div>


        </main>

         <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Powered by{' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
        </footer>
      </div>
    )
  }
}
