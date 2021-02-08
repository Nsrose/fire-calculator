import React from "react";
import styles from '../styles/Education.module.css'


export default class Education extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
        <div className={styles.educationContainer}>
          <div className={styles.educationElementContainer}>
           <div className={styles.title}>What is F.I.R.E.?</div>
            <div className={styles.description}>
            F.I.R.E. stands for Financial Independence, Retire Early. It's built around the idea that retirement is not about cranking away at a job until you're 65, but more about hitting a target total net worth.
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
          
            </div>
          </div>


          <div className={styles.educationElementContainer}>
           <div className={styles.title}>It's not about how much you have right now, it's about how much you save.</div>
            <div className={styles.description}>
              With a few extreme examples (for example getting a million dollars from the lottery), 
              hitting your FIRE target number will be much more heavily influenced by your yearly income & spending and how of what you save is put into assets that appreciate rather than your current total net worth. 
              You can see this for yourself by trying different Initial Net Worth values in the calculator -- make some large $10k+ changes and you'll notice how little that changes your timeline to retirement.
            </div>
          </div>



        </div>
    )
  }
}