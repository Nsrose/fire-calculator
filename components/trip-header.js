import React from "react";
import Head from 'next/head'


export default class TripHeader extends React.Component {
	constructor(props) {
		super(props);
	}


	render() {
		return (
			<Head>
          <title>Better Trip Planner</title>
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
     )
	}
}