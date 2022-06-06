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

var consumerKey = 'o7yokwOJyej2yX1T3SVyiTqK95c7FoYuretCM1wB';
var consumerSecret = 'NX3dV83FIRT8IBDAOg5tmm2YNDdk4e1kDFb3dTTe';
var AuthApi = require('splitwise-node');


export default class Trips extends React.Component {
	constructor (props) {
		super(props);
		// const sw = Splitwise({
  // 			consumerKey: consumerKey,
  // 			consumerSecret: consumerSecret,
  // 			logger: console.log
		// });

		// sw.use(function (req, res, next) {
		//    res.header("Access-Control-Allow-Origin", "*");
		//    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		//    next();
		// })

		// sw.createGroup({
		// 	name: "new group"

		// }).then(
		// 	data => console.log(data)
		// );
		this.splitwiseAuthURL = "";

		

	}

	componentDidMount() {
		var userOAuthToken, userOAuthTokenSecret;
		var authApi = new AuthApi(consumerKey, consumerSecret);
		authApi.getOAuthRequestToken()
	    .then(({ token, secret }) => {
	        [userOAuthToken, userOAuthTokenSecret] = [token, secret];
	        this.splitwiseAuthURL = authApi.getUserAuthorisationUrl(token);
	        // this isn't actually setting the URL 
	        console.log(this.splitwiseAuthURL);
	        var splitwiseApi = authApi.getSplitwiseApi(userOAuthToken, userOAuthTokenSecret);
	    	debugger;

	    	splitwiseApi.createGroup("new group", []);


	    });


	}




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
	             <div className={styles.title}>Please stop planning trips in chats, for the love of God</div>
	             	<div>
		             	<Image 
		             	src="/images/group-chat.png"
		             	width="200px"
		             	height="240px"
		             	/>
	             	</div>
	              <div className={styles.description}>
	              There is not a worse way in the world of planning a trip with friends than using a group chat, and yet this is how all of my friends seem to do it. 
	              <br></br><br></br>The reason this is so terrible is because you & your friends are trying to solve an intertwined constraint satisfaction problem at the same time in a sequential format. None of the decisions made are easily reachable and recallable, and if you want to return to any earlier part in the conversation to question an earlier decision based on new information, it’s impossible:



	              </div>

	              <div>
			              <Image 
				             	src="/images/graph.png"
				             	width="200px"
				             	height="200px"
				             	/>
		            </div>
		            <div className={styles.description}>
		            Instead consider using a doc as a way to plan. Docs and sheets allow for multiple ongoing discussions about different things at once, which at least solves a few problems (but admittedly not all):
					(A) Removes the terrible sequential nature of group chats, and (B) keeps state so people can go back and reference decisions that were already made instead of constantly pinging the chat “hey where’s the link to the airbnb again?”
					<br></br><br></br>
					In fact, I’m so annoyed by this I made a template doc you can use with your friends here. Try it out 

					</div>

	            </div>


	            <div className={styles.educationElementContainer}>
	             <div className={styles.title}><a href="https://www.notion.so/Trip-Planning-Template-fc4bb38a5a1748b5a122e93a69e93401?duplicate=true" target='_blank'>Start a new trip</a></div>
	          
	            </div>



	          
	          	{/*
	  
				<div><a href="https://www.notion.so/Trip-Planning-Template-fc4bb38a5a1748b5a122e93a69e93401?duplicate=true" target='_blank'>Create planning template</a></div>
	            <div>
	            	
	            	
	            	<a href={this.splitwiseAuthURL}>Create Splitwise</a>
	            </div>
	            
	            */}

	            


	          </div>

	          </div>
	          

			</main>
			<Footer />

		</div>)
	}
}