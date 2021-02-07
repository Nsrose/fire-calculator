import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InputsForm from '../components/form'
import FixedPercentageGraph from '../components/graph';
import { Doughnut } from 'react-chartjs-2';

import FormElement from "../components/form-element";

const DEFAULTS = {
    age : {
        value: 25,
        userName: "Age",
        dataTip: "Your current age",
        name: "age"
      },
      investments: {
        value: 50000,
        userName: "Initial Net Worth",
        dataTip: "Your current total net worth, including all <br>investments, retirement accounts, and cash",
        name: 'investments',
        isCurrency: true

      },
      stocks: {
        value: "90%",
        userName: "Stocks",
        dataTip: "The percentage of your net worth allocated in stocks",
        name: "stocks",
      },
      bonds: {
        value: "7%",
        userName: "Bonds",
        dataTip: "The percentage of your net worth allocated in bonds",
        name: "bonds",
      },
      cash: {
        value: "3%",
        userName: "Cash",
        dataTip: "The percentage of your net worth allocated in cash",
        name: "cash",
      },
      income: {
        value: 50000.00,
        userName: "Post-Tax Income",
        dataTip: "Your yearly income, including bonuses <br> and equity, with taxes subtracted out",
        name: "income",
        isCurrency: true
      },
      spending: {
        value: 30000.00,
        userName: "Current Yearly Spending",
        dataTip: "Your yearly expenses, including things like groceries, <br>shopping, travel, gifts, and entertainment",
        name: "spending",
        isCurrency: true
      },
      incomeGrowth: {
        value: "2%",
        userName: "Income Growth Rate",
        dataTip: "Your anticipated annual rate of growth in your income",
        name: "incomeGrowth",
      },
      retirementSpending: {
        value: 100000.00,
        userName: "Retirement Yearly Spending",
        dataTip: "How much you plan to spend each year during retirement, which should<br> factor in house payments, vacations, education, and healthcare costs.",
        name: "retirementSpending",
        isCurrency: true
      },
      withdrawalRate: {
        value: "4%",
        userName: "Withdrawal Rate",
        dataTip: "The percentage of your savings you plan to liquidate each year. 4% is generally considered a safe amount.",
        name: "withdrawalRate",
      },
      retirementTaxRate: {
        value: "7%",
        userName: "Average Retirement Tax Rate",
        dataTip: "Your expected average tax rate during retirement.",
        name: "retirementTaxRate",
      
      },
      stockReturns: {
        value: "8.1%",
        userName: "Stock Returns",
        dataTip: "Expected average returns for your equity holdings. <br>8.1% is a conservative historical estimate.",
        name: "stockReturns",
      },
      bondReturns: {
        value: "2.4%",
        userName: "Bond Returns",
        dataTip: "Expected average returns for your bond holdings.<br>2.4% is an average historical estimate.",
        name: "bondReturns",
      },
}




export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
    this.formReference = React.createRef();
    this.defaults = {};

  }

  componentDidMount() {
      for (var key in DEFAULTS) {
        var storedItem = JSON.parse(window.localStorage.getItem(key)) || DEFAULTS[key];
        window.localStorage.setItem(key, JSON.stringify(storedItem));
        this.defaults[key] = 
          <FormElement 
          name={storedItem.name}
          userName={storedItem.userName}
          value={storedItem.value}
          dataTip={storedItem.dataTip}
          key={storedItem.key}
          ref={React.createRef()}
          />
        
        
      }

      this.formReference.current.setState({
        formElements: Object.values(this.defaults)
      })

      var calculationResult = this.chartReference.current.calculator.calculate(this.defaults, [], []);
      this.chartReference.current.handleUpdate(calculationResult);
   
      
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
            ref={this.formReference}
            />
        

          <div className={styles.graph}>
            <FixedPercentageGraph 
              ref={this.chartReference}
              defaults={this.defaults}
            />

          </div>
           <div className={styles.feedback}><a href="https://docs.google.com/forms/d/e/1FAIpQLSdZhF7cTfyrgHZdLlHP-OGZKnnvuC6kf1n51h-pKbJTJ_1hbQ/viewform?usp=sf_link"
         target="_blank">File a bug or feature request</a></div>
         <div className={styles.clearfix}></div>


        </div>


        </main>
                 <footer className={styles.footer}>
         
          <div><a
            href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            All financial data is processed client-side with {' '}
            <img src="/vercel.svg" alt="Vercel Logo" className={styles.logo} />
          </a>
          </div>
        </footer>
      </div>
    )
  }
}
