import React from "react";
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import InputsForm from '../components/form'
import FixedPercentageGraph from '../components/graph';
import FormElement from "../components/form-element";
import Education from "../components/education";
import {DEFAULTS,formatter} from '../components/util';
import {isMobile} from 'react-device-detect';
import Image from 'next/image';
import classNames from 'classnames'
import { CSVLink, CSVDownload } from "react-csv";
import TopBar from '../components/topbar';
import Header from '../components/header';
import { Button } from 'react-bootstrap';
import Footer from '../components/footer';


export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.chartReference = React.createRef();
    this.formReference = React.createRef();
    this.defaults = {};
    this.state = {
      "csvData": []
    };

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

  scrollDown = () => {
    var div = document.getElementById("educationContainer");
    div.scrollIntoView({behavior: 'smooth'});
  }


  render() {
    return (
      <div className={styles.container}>
        <Header />

       

        <main className={styles.main}>

        <TopBar />

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

        <CSVLink data={this.state.csvData} className={styles.csv}>Download CSV</CSVLink>

        <div className={classNames(styles.downArrow, styles.bounce)} onClick={this.scrollDown}>
          <Image 
          src="/images/down-arrow-icon.jpg"
          width="60px"
          height="60px"
          />
        </div>

        

        <Education />


        </main>
        <Footer />
        
      </div>
    )
  }
}
