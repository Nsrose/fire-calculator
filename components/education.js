import React from "react";
import styles from '../styles/Education.module.css'
import {isMobile} from 'react-device-detect';


export default class Education extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div className={styles.educationContainer} id="educationContainer">
          <div className={styles.fixerContainer}>


            <div className={styles.educationElementContainer}>
             <div className={styles.title}>What is FIRE?</div>
              <div className={styles.description}>
              F.I.R.E. stands for <a className={styles.link} href="https://www.reddit.com/r/Fire/" target="_blank">Financial Independence, Retire Early</a>. It's built around the idea that retirement is not about cranking away at a job until you're 65, but more about hitting a target total net worth.
                <br></br> <br></br>
              The fundamental principle behind FIRE is that once you hit your target net worth number, you can safely withdraw some percentage of that per year (this is called the Withdrawal Rate) and live off of that indefinitely. 

              <br></br> <br></br>
              Generally a 4% Withdrawal Rate is assumed to be safe. For example, if you withdraw 4% of your $1,000,000 net worth, that gives you $40,000 in spending money that year. 
              During the same year, however, your remaining $960,000 is still invested in a reasonable mix of stocks, bonds, and cash. 
              Assuming your overall mix of assets appreciates by more than 4% that year (which is quite conservative compared to historical years) that will replenish your net worth to be back at $1,000,000 by the next year (on average).
              Put together, this means if you can live off of $40,000 / year in spending money, you need to reach $1,000,000 in net worth before becoming financially independent and "FIREing".

              </div>
            </div>

            <div className={styles.educationElementContainer}>
             <div className={styles.title}>So what's this calculator for?</div>
              <div className={styles.description}>
              What if you wanted to spend more than $40k / year during retirement? What if you could live off of less? 
              This calculator will tell you what your target FIRE number should be based on what you want to spend during retirement. 
              You can use this calculator to estimate how long, based on your current yearly income and spending patterns, your portfolio allocation, and average stock & bond market return rates it will take to hit your FIRE number.
              <br></br><br></br>
              This calculator will tell you everything up until you hit your FIRE target -- but nothing about what happens after. 
              </div>
            </div>


            <div className={styles.educationElementContainer}>
             <div className={styles.title}>It's not about how much you have right now, it's about how much you save.</div>
              <div className={styles.description}>
                With a few extreme examples (for example getting a million dollars from the lottery), 
                hitting your FIRE target number will be much more heavily influenced by your yearly income & spending and how of what you save is put into assets that appreciate rather than your current total net worth. 
                You can see this for yourself by trying different Initial Net Worth values in the calculator -- make some large $10k+ changes and you'll notice how little that changes your timeline to retirement.
                <br></br><br></br>
                In other words, it's okay if you're only just getting started on your journey to FIRE now. Like anything in life, building the right habits is most important.
              </div>
            </div>

            <div className={styles.educationElementContainer}>
             <div className={styles.title}>FIRE doesn't have to be about retiring.</div>
              <div className={styles.description}>
                One of the most common responses from people new FIRE is "what if I like my job and I want to continue working?" With FIRE, that's completely achievable. Hitting your FIRE target simply means you no longer <em>need</em> to work unless you want to.
                <br></br><br></br>
                You can now instead choose to focus on hobbies, invest in other companies, donate to charity, get involved in local government, or keep working at exactly the same job.
              </div>
            </div>

            <div className={styles.educationElementContainer}>
             <div className={styles.title}>How do I calculate my annual post-tax income and yearly spending?</div>
              <div className={styles.description}>
                If you're a salaried employee, you can calculate your annual post-tax income by checking out your <a className={styles.link} href="https://www.irs.gov/forms-pubs/about-form-w-2" target="_blank">W2 form</a>, which should list your yearly income and your yearly taxes.
                Don't forget to add any employer contributions to your income including HSA & 401k matching.
                This will be a bit harder if you have your own business or multiple sources of income, but getting within a few thousand dollars should be fine. 
                <br></br><br></br>
                You can calculate your yearly spending in most online bank accounts, such as Chase's yearly spending summary, or you can estimate based your monthly rent / housing costs, grocery bills, travel & leisure, and gift costs. 
              </div>
            </div>

            <div className={styles.educationElementContainer}>
             <div className={styles.title}>Accounting for extra expenses and sources of income</div>
              <div className={styles.description}>
                The calculator allows you to add extra expenses or income sources, on a one-time or recurring basis. For example, you can see how purchasing a $1M home at age 35 will affect your retirement date, or how working a part-time second job that pays $40k / year will move it up.
              </div>
            </div>



          </div>

        </div>
    )
  }
}