import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InputsForm from '../components/form'
import FixedPercentageGraph from '../components/graph';
import FormElement from "../components/form-element";
import Education from "../components/education";
import {DEFAULTS,formatter} from '../components/util';
import {isMobile} from 'react-device-detect';




export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
    this.formReference = React.createRef();
    this.defaults = {};
    this.state = {};

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
      this.setState({
        fireYear: calculationResult.fireYear,
        fireTarget: formatter.format(calculationResult.fireTarget)
      })
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

          <script data-ad-client="ca-pub-4222252253730110" async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"></script>
        </Head>

       

        <main className={styles.main}>
          <h1 className={styles.title}>
            🔥 FIRE Calculator: How Long Until I Can Retire?
          </h1>

          <p className={styles.description}>
          FIRE = Financial Independence, Retire Early

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
              parent={this}
            />

          </div>

          {isMobile && 
            <div className={styles.fireSummary}>
              <div>FIRE Target: {this.state.fireTarget}</div>
              <div>Age: {this.state.fireYear}</div>
            </div>
          }
           
          

        </div>

        <Education />


        </main>
        <footer className={styles.footer}>
         
          
<div className={styles.clearfix}></div>
          <div className={styles.feedback}><a href="https://docs.google.com/forms/d/e/1FAIpQLSdZhF7cTfyrgHZdLlHP-OGZKnnvuC6kf1n51h-pKbJTJ_1hbQ/viewform?usp=sf_link"
         target="_blank">File a bug or feature request</a></div>
         <div className={styles.clearfix}></div>
        </footer>
      </div>
    )
  }
}
