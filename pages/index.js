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
      "age" : 25,
      "investments" : 50000,
      "stocks" : "90%",
      "bonds" : "7%",
      "cash" : "3%",
      "income" : 50000.00,
      "spending" : 30000.00,
      "incomeGrowth" : "2%",
      "retirementSpending" : 100000.00,
      "withdrawalRate" : "4%",
      "retirementTaxRate" : "7%",
      "stockReturns" : "8.1%",
      "bondReturns" : "2.4%"
    };
  }



  render() {
    return (
      <div className={styles.container}>
        <Head>
          <title>FIRE Calculator</title>
          <link rel="icon" href="/favicon.ico" />
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-39S0HP6RN0"
          />

          <script
            dangerouslySetInnerHTML={{
              __html: `
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', 'G-39S0HP6RN0');
                `,
            }}
          />
        </Head>

       

        <main className={styles.main}>
          <h1 className={styles.title}>
            🔥 FIRE Calculator
          </h1>

          <p className={styles.description}>
            How many years until financial independence?
          </p>


         <div className={styles.floatContainer}>
            <InputsForm 
            graph={this.chartReference}
            defaults={this.defaults}
            />
        

          <div className={styles.graph}>
            <FixedPercentageGraph 
              ref={this.chartReference}
              defaults={this.defaults}
            />
          </div>
        </div>


        </main>

         <footer className={styles.footer}>
          <a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            All financial data is processed client-side with {' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
          
        </footer>
      </div>
    )
  }
}
