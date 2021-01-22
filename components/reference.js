// then do sensitivity.  What if you reduce spending or increase savings by x amount?

// other additions: income/expenses
// sensitivity - changes in returns (ignore for historical)
// retirement spending sensitivity


function resizetext(){
	w=window.innerWidth

	if (w<320){
		$("#retirespendlabel").html("Retirement Spend");
		$("#taxlabel").html("Avg Tax");
		$("#targetlabel").html("FIRE Goal");
	}



}



function parseURLparams(){
	//parse URL and set inputs to the right values

	isInIframe = (parent !== window);
	if (isInIframe){
		var thisURL = document.referrer;
	} else{
		var thisURL = window.location.href;		
	}
	
	inputnames=["age","totalsavings", "annualspending", "annualincome", "swr", "incomerate","retirespending","stockpct","bondpct","cashpct","stockrtn","bondrtn","MCstockrtn","MCbondrtn","taxrate","incomevalue","incomestart","incomeend","expensevalue","expensestart","expenseend"];
	urlparamnames=["age", "initsav", "spend", "initinc", "wr", "ir", "retspend", "stockpct", "fixpct", "cashpct","stockrtn","bondrtn","MCstockrtn","MCbondrtn","tax","income","incstart","incend","expense","expstart","expend"];
	defaultvals=[32,25000,45000,60000,4,1,40000,80,18,2,8.1,2.4,8.1,2.4,7,0,50,70,0,50,70];
	paramvals=[];

	var parseUrl = new URL(thisURL);
	
	for (var i=0;i<inputnames.length;i++){
		paramvals[i]=parseUrl.searchParams.get(urlparamnames[i]);

		if (paramvals[i]==null){
			paramvals[i]=defaultvals[i];
			// console.log(paramvals[i]);
		}
		document.getElementById(inputnames[i]).value=paramvals[i];
	}
	
	//graphmode
	
	(parseUrl.searchParams.get("graph")==null?graphmode="fix":graphmode=parseUrl.searchParams.get("graph"));
	console.log(parseUrl.searchParams.get("graph"));
	if (graphmode=="fix"){
		document.getElementById('typeSelect').selectedIndex=0;
	} else if (graphmode=="hist"){
		document.getElementById('typeSelect').selectedIndex=1;
	} else {
		document.getElementById('typeSelect').selectedIndex=2;
	}

	//second graphtype
	(parseUrl.searchParams.get("secgraph")==null?document.getElementById('secondgraphSelect').selectedIndex=0:document.getElementById('secondgraphSelect').selectedIndex=parseUrl.searchParams.get("secgraph"));

}


function getInputs(){

	w = window.innerWidth;
	plotwidth=w;
	smallscreen = (w<=650?true:false); 

	//get values from inputs
	
	startage=parseInt($('#age').val());
	beginningstache = parseInt(((document.getElementById("totalsavings").value).replace(/\,/g, '')).replace(/\$/g,''));
	annualspend = parseInt((document.getElementById("annualspending").value).replace(/\,/g, '').replace(/\$/g,''));
	annualincome = parseInt((document.getElementById("annualincome").value).replace(/\,/g, '').replace(/\$/g,''));
	// wr = parseFloat(document.getElementById("swr").value/100);
	wr=parseFloat($('#swr').val()/100);

	annualsavings = annualincome-annualspend;
	incomerate = parseFloat(document.getElementById("incomerate").value/100);
	retirespending= parseInt((document.getElementById("retirespending").value).replace(/\,/g, '').replace(/\$/g,''));
	savingsrate=(annualsavings/annualincome*100).toFixed(0);
	taxrate=parseFloat($("#taxrate").val()/100);
	target = parseInt((retirespending*(1+taxrate)/wr).toFixed(0));

	//populate inputs with localized numbers
	$("#totalsavings").val("$"+beginningstache.toLocaleString('en-US'));
	$("#annualspending").val("$"+annualspend.toLocaleString('en-US'));
	$("#annualincome").val("$"+annualincome.toLocaleString('en-US'));
	$("#annualsavings").val("$"+annualsavings.toLocaleString('en-US')+" ("+savingsrate+"%)");
	// document.getElementById("fireamount").value="$"+target.toLocaleString('en-US');
	$('#fireamount').val("$"+target.toLocaleString('en-US'));

	// cycleLength = parseInt(document.getElementById("cyclelength").value)+1;

	stockpct = $('#stockpct').val()/100;
	fixedpct = $('#bondpct').val()/100;
	cashpct = $('#cashpct').val()/100;

	incomestring=$("#incomevalue").val();
	incomelist=incomestring.split(";");
	incomestartagestring=$("#incomestart").val();
	incomestartagelist=incomestartagestring.split(";");
	incomeendagestring=$("#incomeend").val();
	incomeendagelist=incomeendagestring.split(";");

	for (var i=0;i<incomelist.length;i++){
		incomelist[i]=(isNaN(parseInt(((incomelist[i]).replace(/\,/g, '')).replace(/\$/g,'')))?0:parseInt(((incomelist[i]).replace(/\,/g, '')).replace(/\$/g,'')));
		incomestartagelist[i]=(incomestartagelist[i]==undefined?startage:parseInt(incomestartagelist[i]));
		incomeendagelist[i]=(incomeendagelist[i]==undefined?120:parseInt(incomeendagelist[i]));
	}

	expensestring=$("#expensevalue").val();
	expenselist=expensestring.split(";");
	expensestartagestring=$("#expensestart").val();
	expensestartagelist=expensestartagestring.split(";");
	expenseendagestring=$("#expenseend").val();
	expenseendagelist=expenseendagestring.split(";");

	for (var i=0;i<expenselist.length;i++){
		expenselist[i]=(isNaN(parseInt(((expenselist[i]).replace(/\,/g, '')).replace(/\$/g,'')))?0:parseInt(((expenselist[i]).replace(/\,/g, '')).replace(/\$/g,'')));
		expensestartagelist[i]=(expensestartagelist[i]==undefined?startage:parseInt(expensestartagelist[i]));
		expenseendagelist[i]=(expenseendagelist[i]==undefined?120:parseInt(expenseendagelist[i]));
	}

	
}

function checkallocationinputs(){
	var sum=parseFloat($('#stockpct').val())+parseFloat($('#bondpct').val())+parseFloat($('#cashpct').val());
	$("#errormsg").html("Stock, bond and cash allocation percentages must be whole numbers and add to 100%");
	if (sum>101||sum<99){
		$('#errormsg').show();
		$('.allocationinputs').addClass('allocationerror');

	} else {
		$('#errormsg').hide();
		$('.allocationinputs').removeClass('allocationerror');
		calcandmakegraphs();
	}
}

function setgraphvisibility(dispnames){

		for (var i of dispnames.show){
			$(i).show();
		}
		for (var j of dispnames.hide){
			$(j).hide();
		}
}
function calcandmakegraphs(){

	// graphmode=document.getElementById('typeSelect').value;
	graphmode=$('#typeSelect').val();

	fixdisp={show:["#fixedoptions","#secondgraphtype","#stachegraphdiv"],hide:["#histoptions,#MCoptions","#histgraphdiv","#MCgraphdiv"]};
	histdisp={show:["#histoptions","#secondgraphtype","#histgraphdiv"],hide:["#fixedoptions,#MCoptions","#stachegraphdiv","#MCgraphdiv"]};
	mcdisp={show:["#MCoptions","#secondgraphtype","#MCgraphdiv"],hide:["#fixedoptions,#histoptions","#stachegraphdiv","#histgraphdiv"]};

	secondgraphmode=$('#secondgraphSelect')[0].selectedIndex;

	if (graphmode=="fix"){
		//input parameters 
		setgraphvisibility(fixdisp);
		
		calcandplotfixed();
		plotsavingsgraph();
		if(secondgraphmode==1||secondgraphmode==2){
			$('#secondgraphSelect')[0].selectedIndex=0;
		}

	} else if (graphmode=="hist"){
		setgraphvisibility(histdisp);
		
		// document.getElementById('secondgraphSelect').selectedIndex=2;
		// $('#secondgraphSelect')[0].selectedIndex=2
		calcandplotfixed(8.1,2.4);
		calcandplotHistorical();
		if(secondgraphmode==4){
			$('#secondgraphSelect')[0].selectedIndex=0;
		}

	} else if (graphmode=="mc"){
		setgraphvisibility(mcdisp);

		// document.getElementById('secondgraphSelect').selectedIndex=2;
		// $('#secondgraphSelect')[0].selectedIndex=2
		calcandplotfixed(8.1,2.4);
		calcandplotMonteCarlo();
	}

	draw2ndgraph();
	
}
// graphmode="fix";

function draw2ndgraph(){
	//disable dropdown menu options
	options=document.getElementById('secondgraphtype').getElementsByTagName("option");
	if (graphmode=="fix"){
		options[1].disabled=true;
		options[2].disabled=true;
		options[0].disabled=options[3].disabled=options[4].disabled=false;
	} else if (graphmode=="hist"){
		options[4].disabled=true;
		options[0].disabled=options[1].disabled=options[2].disabled=options[3].disabled=false;
	} else {
		options[0].disabled=options[1].disabled=options[2].disabled=options[3].disabled=options[4].disabled=false;
	}

	secondgraphmode=$('#secondgraphSelect')[0].selectedIndex;

	if (secondgraphmode==0){ //saving graph
		$('#savingsgraphdiv').show();
		$('#retirementhistogramdiv').hide();
		$('#sensitivityDiv').hide();
		
	
		plotsavingsgraph();

	} else if (secondgraphmode==1){  //retire year graph
		
		if (graphmode=="hist"){
			histmin = parseInt(minArray(retirementyearlistH))-5;
			histmax = parseInt(maxArray(retirementyearlistH))+5;

			histogramdata = [{
				x: retirementyearlistH,
				type:'histogram',
				xbins: {
				    start: histmin,
				    end: histmax, 
				    size: 1, 
				}
			}];
			medianlinex=retirementYearH[3];
		} else if (graphmode=="mc"){
			histmin = parseInt(minArray(retirementyearlistMC))-5;
			histmax = parseInt(maxArray(retirementyearlistMC))+5;

			histogramdata = [{
				x: retirementyearlistMC,
				type:'histogram',
				xbins: {
				    start: histmin,
				    end: histmax, 
				    size: 1, 
				}
			}];
			medianlinex=retirementYearMC[3];
		}
		
		$('#retirementhistogramdiv').show();
		$('#savingsgraphdiv').hide();
		$('#sensitivityDiv').hide();
		
		mediantext='median<br>retirement year'
		plotretirementhist();
	} else if (secondgraphmode==2){  //retire age graph

		if (graphmode=="hist"){
			histmin = parseInt(minArray(retirementyearlistH)-5+startage);
			histmax = parseInt(maxArray(retirementyearlistH)+5+startage);
			histogramdata = [{
				x: addArrWScal(retirementyearlistH,startage),
				type:'histogram',
				xbins: {
				    start: histmin,
				    end: histmax, 
				    size: 1, 
				}
			}];
			medianlinex=retirementYearH[3]+startage;
		} else if (graphmode=="mc"){
			histmin = parseInt(minArray(retirementyearlistMC)-5+startage);
			histmax = parseInt(maxArray(retirementyearlistMC)+5+startage);
			histogramdata = [{
				x: addArrWScal(retirementyearlistMC,startage),
				type:'histogram',
				xbins: {
				    start: histmin,
				    end: histmax, 
				    size: 1, 
				}
			}];
			medianlinex=retirementYearMC[3]+startage;
		}
		
		$('#retirementhistogramdiv').show();
		$('#savingsgraphdiv').hide();
		$('#sensitivityDiv').hide();
		
		mediantext='median<br>retirement age'
		plotretirementhist();
	} else if (secondgraphmode==3){  //sensitivity graph
		
		$('#sensitivityDiv').show();
		$('#savingsgraphdiv').hide();
		$('#retirementhistogramdiv').hide();
		
		plotspendingsensitivitygraph();
	} else if (secondgraphmode==4){  //sensitivity graph
		
		$('#sensitivityDiv').show();
		$('#savingsgraphdiv').hide();
		$('#retirementhistogramdiv').hide();
		
		if (graphmode=="fix"){
			plotreturnsensitivitygraph();
		} else if (graphmode=="mc"){
			plotreturnsensitivitygraph();
		}


	} 
}

function calcHistSensitivity(){
	getInputs();
	originalspend=annualspend;
	spendlist=multArrByScal([0.8,0.9,0.95,0.98,1,1.02,1.05,1.1,1.2],originalspend);
	retirehistsensitivity=[];

	for (var i=0;i<spendlist.length;i++){
		annualspend=spendlist[i];		
		calchistoricaloutputs();
		retireyearslist=retirementYearH.slice();
		retireyearslist.unshift(parseInt(annualspend));
		
		retirehistsensitivity.push(retireyearslist);
	}
	relativehistsensitivity=[];
	
	var hindex = [2,4,6];
	retirehistsensitivity=reshape2DArray(retirehistsensitivity);
	relativehistsensitivity[0]=addArrWScal(retirehistsensitivity[0],-retirehistsensitivity[0][4]);
	relativehistsensitivity[1]=addArrWScal(retirehistsensitivity[hindex[0]],-retirehistsensitivity[hindex[0]][4]);
	relativehistsensitivity[2]=addArrWScal(retirehistsensitivity[hindex[1]],-retirehistsensitivity[hindex[1]][4]);
	relativehistsensitivity[3]=addArrWScal(retirehistsensitivity[hindex[2]],-retirehistsensitivity[hindex[2]][4]);
	pcthistspending=multArrByScal(relativehistsensitivity[0],(100/retirehistsensitivity[0][4]));


	histlabeltext=[];

	for (var j =0;j<3;j++){
		var labeltext=[];
		for (var i=0;i<relativehistsensitivity[0].length;i++){
			labeltext.push("");
			if (relativehistsensitivity[1][i]<0){
				 labeltext[i]="Spending $"+Math.abs(relativehistsensitivity[0][i]).toLocaleString()
				 	+" less per yr ("+pcthistspending[i]+"%)<br>speeds retirement by "+ Math.abs(relativehistsensitivity[j+1][i]).toFixed(1)+" yrs ("+retirehistsensitivity[hindex[j]][i]+" yrs total)." ;
			} else if (relativehistsensitivity[1][i]>0){
				 labeltext[i]="Spending $" +Math.abs(relativehistsensitivity[0][i]).toLocaleString()
				 	+" more per yr (+"+pcthistspending[i]+"%)<br>delays retirement by "+ Math.abs(relativehistsensitivity[j+1][i]).toFixed(1)+" yrs ("+retirehistsensitivity[hindex[j]][i]+" yrs total).";
			} else {
				 labeltext[i]="Baseline ("+retirehistsensitivity[hindex[j]][i]+" yrs to retirement)";
			}	
			
			// direction + retirefixedsensitivity[1][i]+" yrs<br>("+relativefixedsensitivity[1][i].toFixed(1)+" vs baseline)";
		}
		histlabeltext.push(labeltext);
	}

}



function calcandplotHistorical(){
	getInputs();
	calchistoricaloutputs();
	plotHistPercentiles();
}

function calchistoricaloutputs(){

	//read in returns data from annmarketdata.js
	var fixed_factor=addArrWScal(real_fixed_return,1);
	var stockdiv_factor=addArrWScal(real_stockdiv_return,1);
	
	//create array of arrays with the variable length (cycleLength) and with all different starting years
	//[[1871 array],[1872 array]. . . .[1990 array]] for 25 year cycle (since data goes to 2015).
	// NumCycles is equal to the number of market years - the length of the cycle + 1
	// i.e. if you want to analyze 30 years and there are 145 historical years, that'll be 116 cycles

	// ************  NEED TO DEFINE cycleLength ****************
	var numHistYrs = stockdiv_factor.length
	cycleLength=Math.max(parseInt(retirementyear*1.75),parseInt(retirementyear+10));
	numCycles = numHistYrs - cycleLength + 1;
	yearhist=stepArray(startage,startage+numCycles);
	//array of of length (cycleLength) 
	var fixed_array = [];
	var stockplusdiv_array = [];
	initsavingsrate = (savings/income*100).toFixed(1);

	cyclesArrayH=[];  // this is an array that holds all historical cycles (arrays) in Nominal dollars
	retirementyearlistH=[];

	// iterate over all cycles (numCycles) each i is one historical cycle (e.g. 25 year period)
	for (var i=0; i<numCycles; i++) { 
		//get returns for one cycle //these arrays change for each historical cycle
		fixed_array = fixed_factor.slice(i,i+cycleLength);
		stockplusdiv_array = stockdiv_factor.slice(i,i+cycleLength);
		

		retirementyearlistH.push(cycleLength);

		var retirementflag=0;
		//Stache returns cycle - calculate returns across allocation for each year of cycle
		for (var j=0;j<=cycleLength;j++){ //cycleLength
			var thisyearincome=0;
			for (var k=0;k<incomelist.length;k++){
				thisyearincome+=getIncomeExpense(incomelist[k],incomestartagelist[k],incomeendagelist[k],j);
			}
			// var income=getIncome(SSincomestart,SSstartage,SSendage,inflation_adjustment_array[j],j)+getIncome(pensionincomestart,pensionstartage,pensionendage,inflation_adjustment_array[j],j);  //j is age
			var thisyearexpense=0;
			for (var k=0;k<expenselist.length;k++){
				thisyearexpense+=getIncomeExpense(expenselist[k],expensestartagelist[k],expenseendagelist[k],j);
			}
			if (j==0){
				var stacheH=[beginningstache]; //reset stache before starting calculation cycle of returns
				spendingH = [annualspend+thisyearexpense]; //initialize spending to annual spend
				basespendingH=[annualspend];
				extraspendingH=[thisyearexpense];
				
				incomeH = [annualincome+thisyearincome];
				baseincomeH=[annualincome];
				extraincomeH=[thisyearincome];
				savingsH = [annualincome+thisyearincome-annualspend-thisyearexpense];
			} else {
				var newincome=baseincomeH[j-1]*(1+incomerate)
				baseincomeH.push(newincome);
				extraincomeH.push(thisyearincome);
				var newspend=basespendingH[j-1]*(1+spendingrate)
				basespendingH.push(newspend);
				extraspendingH.push(thisyearexpense);

				incomeH.push(newincome+thisyearincome);
				spendingH.push(newspend+thisyearexpense)
				
				savingsH.push(incomeH[j]-spendingH[j]);
				// console.log(startage+j,incomeH[j], spendingH[j],savingsH[j]);

				if (stacheH[j]<=0){
					eoy_stacheH = stacheH[j-1]+savingH[j];   //no returns on a negative stache
				} else {
					eoy_stacheH = (stacheH[j-1]+savingsH[j])*cashpct*1 
					+ (stacheH[j-1])*fixedpct*fixed_array[j]  +savingsH[j]*fixedpct*fixed_array[j]**0.5
					+ (stacheH[j-1])*stockpct*stockplusdiv_array[j] +savingsH[j]*stockpct*stockplusdiv_array[j]**0.5;

					//stache value at end of year
					stacheH.push(eoy_stacheH);
					if (eoy_stacheH>=target&&retirementflag==0){
						retireyearHfloat=parseFloat(calcexactyear([j-1,j],[stacheH[j-1],stacheH[j]],target).toFixed(1));
						retirementyearlistH[i]=retireyearHfloat;
						retirementflag=1;
					}
				}
			}

			cyclesArrayH[i]=stacheH;
		}
	}

	//calculate percentiles
	yearlyArrayH=reshape2DArray(cyclesArrayH);
	percentilesListH=[5,10,25,50,75,90,95];
	percentilesNamesH=["5%","10%","25%","median","75%","90%","95%"];
	percentilesArrayH=[[],[],[],[],[],[],[]];
	retirementYearH=[];
	graphtextH=[];

	for (var m=0;m<percentilesListH.length;m++){  //m is index of different percentiles
		var retirementflag=0;
		for (var k=0;k<yearlyArrayH.length-1;k++){ //k is years
			
			var stachelevelH=percentileArray(yearlyArrayH[k].slice(),percentilesListH[m]);
			percentilesArrayH[m].push(stachelevelH);

			if (stachelevelH>=target&&retirementflag==0){
				retirementflag=1;
				
				var exactyear =  parseFloat(calcexactyear([k-1,k],[percentilesArrayH[m][k-1],percentilesArrayH[m][k]],target).toFixed(1));
				retirementYearH.push(exactyear);
				graphtextH.push(exactyear+" years (age "+parseInt(exactyear+startage)+")");
				
			}		
		}
		if (retirementflag==0){
			var exactyear=yearlyArrayH.length;
			retirementYearH.push(exactyear);
			graphtextH.push(exactyear+" years (age "+parseInt(exactyear+startage)+")");

		}
	}

}

function plotHistPercentiles(){

	mediantext="<b>"+retirementYearH[3]+" years<br>(age "+parseInt(retirementYearH[3]+startage)+")</b>";

	tracesH=[{	x: yearhist, y: percentilesArrayH[1].slice(), mode: 'lines', fill:'none', name: '10th %ile', text: formatArrayMagnitude(percentilesArrayH[1].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(255, 165, 0,.5)',line:{color:'rgba(255, 165, 0,1)'} },
	{	x: yearhist, y: percentilesArrayH[5].slice(), mode: 'lines',fill:'tonexty', name: '90th %ile', text: formatArrayMagnitude(percentilesArrayH[5].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(255, 165, 0,.5',line:{color:'rgba(255, 165, 0,1)'}},
	{	x: yearhist, y: percentilesArrayH[2].slice(), mode: 'lines', fill:'none', name: '25th %ile', text: formatArrayMagnitude(percentilesArrayH[2].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0, 255, 102,.5)',line:{color:'rgb(0, 255, 102)'} },
	{	x: yearhist, y: percentilesArrayH[4].slice(), mode: 'lines', fill:'tonexty', name: '75th %ile', text: formatArrayMagnitude(percentilesArrayH[4].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0, 255, 102,.5)',line:{color:'rgb(0, 255, 102)'}},
	{	x: yearhist, y: percentilesArrayH[3].slice(), mode: 'lines', fill:'none', name: 'median', text: formatArrayMagnitude(percentilesArrayH[3].slice(),1),marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0,0,0,1)', line: {color: 'rgb(0,0,0)'}},
	{ 	x: [retirementYearH[1]+startage], y: [target], name: '10th %ile', type: 'scatter', text: graphtextH[1], hoverinfo:'x+name+text',mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(216, 130, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearH[5]+startage], y: [target], name: '90th %ile', type: 'scatter', text: graphtextH[5], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(216, 130, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearH[2]+startage], y: [target], name: '25th %ile', type: 'scatter', text: graphtextH[2], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(0, 105, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearH[4]+startage], y: [target], name: '75th %ile',type: 'scatter', text: graphtextH[4], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(0, 105, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearH[3]+startage], y: [target], name: 'median',type: 'scatter', text: graphtextH[3], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(255,0, 0,0)',size: 15, line: {color: 'rgb(255, 0, 0)',width: 3}},showlegend: false},
	];	
	
	// graph annotations

	
	graphmaxxH=parseInt(retirementYearH[1])+startage+1;
	graphmaxyH=percentilesArrayH[5][graphmaxxH-startage];
	outputstringhist1="Initial savings rate: <b>"+savingsrate+"%</b> (spending: $"+ annualspend.toLocaleString()+", income: $"+annualincome.toLocaleString()+")<br>Fire Target: <b>"+parseInt(target).toLocaleString()+"</b> ("+(1/wr).toFixed(0)+"x expected retirement spending)<br>In <b>"+numCycles+"</b> cycles, <b>"+parseInt(retirementYearH[3]+startage)+"</b> is the median retirement age <b>("+ retirementYearH[3]+" years)</b>"
	outputstringhist2="10th to 90th %ile: <b>"+retirementYearH[5]+" to "+retirementYearH[1]+" years</b> to retirement";
	outputstringhist3="25th to 75th %ile: <b>"+retirementYearH[4]+" to "+retirementYearH[2]+" years</b> to retirement";

	$('#resultsdiv').html(outputstringhist1+"<br><span class='tenninety'>"+outputstringhist2+"</span><br><span class='twentyfiveseventyfive'>"+outputstringhist3+"</span>");


	// graphmaxx=graphmaxxH;

	var layout = {
		width:plotwidth,
		height: 350,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.02,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 45,t: 7,pad: 4},
  		xaxis: {
		    title: 'Age',
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    tick0: 0,
		    dtick: (smallscreen?2:1),
		    ticklen:2,
			range:[startage,graphmaxxH],
		    showgrid:true,
		  },
		  yaxis: {
		    title: 'Retirement Savings ($)',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		    tick0: 0,
		    showgrid:true,
		    range:[fixedgraphmin,graphmaxyH]
		    
		    
		  },
		  shapes: [
        
        {
            type: 'line', 
            xref: 'paper', // x-reference is assigned to the plot paper [0,1]
            yref: 'y', // y-reference is assigned to the y - values
            x0: 0,
            y0: target,
            x1: 1,
            y1: target,
            opacity: 1,
            line: {
                width: 3,
                color: 'red',
                dash: 'dash'

            }
        },
        {
		      type: 'line',
		      x0: startage+retirementYearH[3],
		      y0: 0,
		      x1: startage+retirementYearH[3],
		      y1: target,
		      line: {
		        width: 3,
		        color: 'gray',
		        dash: 'dash'
		      }
		    }],
		  annotations: [{
			    xref: 'paper',
			    yref: 'paper',
			    x: .98,
			    xanchor: 'right',
			    y: 0,
			    yanchor: 'bottom',
			    text: '<b>engaging-data.com</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?11:14),
			        color: 'darkblue',

			      }
			  },
			  {
			    xref: 'paper',
			    yref: 'paper',
			    x: .5,
			    xanchor: 'center',
			    y: .95,
			    yanchor: 'bottom',
			    text: '<b>Historical Cycle Returns Retirement Graph</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?15:18),
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementYearH[3]/2,
			    xanchor: 'right',
			    y: target,
			    yanchor: 'top',
			    text: "FIRE Target",
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:15),
			        color: "red",
			    }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementYearH[3],
			    xanchor: 'center',
			    y: target*1.1,
			    yanchor: 'bottom',
			    text: mediantext,
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?15:25),
			        color: "#800000"

			    }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxH,
			    xanchor: 'right',
			    y: percentilesArrayH[1][graphmaxxH-startage],
			    yanchor: 'bottom',
			    text: '<b>'+percentilesNamesH[1],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxH,
			    xanchor: 'right',
			    y: percentilesArrayH[5][graphmaxxH-startage]*.94,
			    yanchor: 'top',
			    text: '<b>'+percentilesNamesH[5],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxH,
			    xanchor: 'right',
			    y: percentilesArrayH[4][graphmaxxH-startage]*.95,
			    yanchor: 'top',
			    text: '<b>'+percentilesNamesH[4],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxH,
			    xanchor: 'right',
			    y: percentilesArrayH[2][graphmaxxH-startage],
			    yanchor: 'bottom',
			    text: '<b>'+percentilesNamesH[2],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxH,
			    xanchor: 'right',
			    y: percentilesArrayH[3][graphmaxxH-startage]*.97,
			    yanchor: 'center',
			    text: '<b>'+percentilesNamesH[3],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',
			      }
			  }]
	};

	Plotly.react(histgraphdiv, tracesH, layout,{responsive: true,displayModeBar: false} );

}

function calcFixedSensitivity(){
	getInputs();
	originalspend=annualspend;
	spendlist=multArrByScal([0.8,0.9,0.95,0.98,1,1.02,1.05,1.1,1.2],originalspend);


	retirefixedsensitivity=[];
	relativefixedsensitivity=[];

	for (var i=0;i<spendlist.length;i++){
		annualspend=spendlist[i];		
		calcfixedoutputs();
		retirefixedsensitivity.push([parseInt(annualspend),retirementyear]);
	}
	retirefixedsensitivity=reshape2DArray(retirefixedsensitivity);

	relativefixedsensitivity[0]=addArrWScal(retirefixedsensitivity[0],-retirefixedsensitivity[0][4]);
	relativefixedsensitivity[1]=addArrWScal(retirefixedsensitivity[1],-retirefixedsensitivity[1][4]);
	pctfixedspending=multArrByScal(relativefixedsensitivity[0],(100/retirefixedsensitivity[0][4]));

	fixedlabeltext=[];
	for (var i=0;i<relativefixedsensitivity[0].length;i++){
		if (relativefixedsensitivity[1][i]<0){
			 fixedlabeltext[i]="Spending $"+Math.abs(relativefixedsensitivity[0][i]).toLocaleString()
			 	+" less per yr ("+pctfixedspending[i]+"%)<br>speeds retirement by "+ Math.abs(relativefixedsensitivity[1][i]).toFixed(1)+" yrs ("+retirefixedsensitivity[1][i]+" yrs total)." ;
		} else if (relativefixedsensitivity[1][i]>0){
			 fixedlabeltext[i]="Spending $" +Math.abs(relativefixedsensitivity[0][i]).toLocaleString()
			 	+" more per yr (+"+pctfixedspending[i]+"%)<br>delays retirement by "+ Math.abs(relativefixedsensitivity[1][i]).toFixed(1)+" yrs ("+retirefixedsensitivity[1][i]+" yrs total).";
		} else {
			 fixedlabeltext[i]="Baseline ("+retirefixedsensitivity[1][i]+" yrs to retirement)";
		}	
		
		// direction + retirefixedsensitivity[1][i]+" yrs<br>("+relativefixedsensitivity[1][i].toFixed(1)+" vs baseline)";
	}
}

function calcFixedRtnSensitivity(){
	getInputs();
	stockreturns=parseFloat(document.getElementById("stockrtn").value/100);	
	
	fixedrtnlist=multArrByScal([0.4,0.55,0.70,0.85,1,1.15,1.3,1.45,1.6],stockreturns);


	retirefixedsensitivity=[];
	relativefixedsensitivity=[];

	for (var i=0;i<fixedrtnlist.length;i++){
		stockrtn=fixedrtnlist[i]*100;		
		calcfixedoutputs(stockrtn);
		retirefixedsensitivity.push([(stockrtn),retirementyear]);
	}
	retirefixedsensitivity=reshape2DArray(retirefixedsensitivity);

	relativefixedsensitivity[0]=addArrWScal(retirefixedsensitivity[0],-retirefixedsensitivity[0][4]);
	relativefixedsensitivity[1]=addArrWScal(retirefixedsensitivity[1],-retirefixedsensitivity[1][4]);
	pctfixedspending=multArrByScal(relativefixedsensitivity[0],(100/retirefixedsensitivity[0][4]));

	fixedlabeltext=[];
	for (var i=0;i<relativefixedsensitivity[0].length;i++){
		if (relativefixedsensitivity[1][i]<0){
			 fixedlabeltext[i]="Higher stock returns ("+Math.abs(retirefixedsensitivity[0][i]).toFixed(1)
			 	+"% per yr) <br>speeds retirement by "+ Math.abs(relativefixedsensitivity[1][i]).toFixed(1)+" yrs ("+retirefixedsensitivity[1][i]+" yrs total)." ;
		} else if (relativefixedsensitivity[1][i]>0){
			 fixedlabeltext[i]="Lower stock returns (" +Math.abs(retirefixedsensitivity[0][i]).toFixed(1)
			 	+"% per yr) <br>delays retirement by "+ Math.abs(relativefixedsensitivity[1][i]).toFixed(1)+" yrs ("+retirefixedsensitivity[1][i]+" yrs total).";
		} else {
			 fixedlabeltext[i]="Baseline returns of "+ retirefixedsensitivity[0][i].toFixed(1)+"% per year ("+retirefixedsensitivity[1][i]+" yrs to retirement)";
		}	
		
		// direction + retirefixedsensitivity[1][i]+" yrs<br>("+relativefixedsensitivity[1][i].toFixed(1)+" vs baseline)";
	}
	//returns stock returns value (for URL generation) back to baseline value from input box
	stockreturns=parseFloat(document.getElementById("stockrtn").value/100);	
}

function calcandplotfixed(fixedstockreturn,fixedbondreturn){
	getInputs();
	calcfixedoutputs(fixedstockreturn,fixedbondreturn);
	plotFixedGraph();
}


function calcfixedoutputs(fixedstockreturn,fixedbondreturn){
	// all calculations are done on a real basis! 
	
	if (fixedstockreturn==undefined){
		stockreturns=parseFloat(document.getElementById("stockrtn").value/100);		
	} else {
		stockreturns=parseFloat(fixedstockreturn/100);	
	}

	if (fixedbondreturn==undefined){
		bondreturns=parseFloat(document.getElementById("bondrtn").value/100);		
	} else {
		bondreturns=parseFloat(fixedbondreturn/100);
	}

	maxperiod=50;
	spendingrate=0;
	//one cycle only (max 50 years)
	// each year 
	stache=[beginningstache];
	
	
	
	savingsarea=[0];
	returnsarea=[0];
	startingarea=[beginningstache];
	yearfixed=[startage];
	zeroarea=[target/300];
	targetpct=[" ("+(beginningstache/target*100).toFixed(1)+"%)"];
	zeroarea2=[annualincome/30];
	// initsavingsrate = (savings/income*100).toFixed(1);
	savingsrates=[" <b>("+savingsrate+"%)</b>"];
	
	for (var i=0;i<=maxperiod;i++){
		var thisyearincome=0;
		for (var k=0;k<incomelist.length;k++){
			thisyearincome+=getIncomeExpense(incomelist[k],incomestartagelist[k],incomeendagelist[k],i);
		}
		// var income=getIncome(SSincomestart,SSstartage,SSendage,inflation_adjustment_array[j],j)+getIncome(pensionincomestart,pensionstartage,pensionendage,inflation_adjustment_array[j],j);  //j is age
		var thisyearexpense=0;
		for (var k=0;k<expenselist.length;k++){
			thisyearexpense+=getIncomeExpense(expenselist[k],expensestartagelist[k],expenseendagelist[k],i);
		}

		if (i==0){
			income=[annualincome+thisyearincome];
			baseincome=[annualincome];
			extraincome=[thisyearincome];
			basespending=[annualspend];
			spending =[annualspend+thisyearexpense];
			extraspending=[thisyearexpense];
			savings= [annualincome+thisyearincome-annualspend-thisyearexpense];
		} else {
			//this section covers income expenses from extra income expenses inputs
			var newincome=baseincome[i-1]*(1+incomerate);
			baseincome.push(newincome);
			extraincome.push(thisyearincome);
			income.push(newincome+thisyearincome);

			var newspend=basespending[i-1]*(1+spendingrate);
			basespending.push(newspend);
			extraspending.push(thisyearexpense);
			spending.push(newspend+thisyearexpense)

			savings.push(newincome+thisyearincome-newspend-thisyearexpense);

			if(stache[i-1]>0){
				var eoy_stache = (stache[i-1]+savings[i])*cashpct*1 
				+ (stache[i-1])*fixedpct*(1+bondreturns) +savings[i]*fixedpct*(1+bondreturns)**0.5
				+ (stache[i-1])*stockpct*(1+stockreturns) +savings[i]*stockpct*(1+stockreturns)**0.5;
			} else {
				var eoy_stache = (stache[i-1]+savings[i]);
			}
			stache.push(eoy_stache);

			savingsarea.push((savingsarea[i-1]+savings[i]));
			startingarea.push(beginningstache);  //make constant level
			returnsarea.push((stache[i]-savingsarea[i]-beginningstache));
			yearfixed.push(startage+i);
			zeroarea.push(target/300);
			zeroarea2.push(annualincome/30);
			targetpct.push(" ("+(eoy_stache/target*100).toFixed(1)+"%)");
			savingsrates.push(" <b>("+(((newincome-newspend)/newincome)*100).toFixed(1)+"%)</b>");
		}

		//stache = stache * (1+ return) + savings

		
	}

	savingsarea=roundArray(savingsarea,0);
	returnsarea=roundArray(returnsarea,0);

	for (i=1;i<=maxperiod;i++){
		if (stache[i]>target){
			retirementyear=i;
			
			break;
		}
	}

	// calcs for graph details
	retirementyear=parseFloat(calcexactyear([retirementyear-1,retirementyear],[stache[retirementyear-1],stache[retirementyear]],target).toFixed(1)); //linear interpolates to get the retirement year to tenths of year

	

	// results: target amount, annual spending, withdrawal rate, years/age at retirement, savings rate,
	//sensitivity?  reduce spending, increase income +/- 5 and 10%, stock returns? 

}

function getIncomeExpense(startincome,pensionstartage,pensionendage,cycleyear){

	var income=0;

	if (cycleyear>=pensionstartage-startage&&cycleyear<=pensionendage-startage){
		income=startincome;
	}

	return income;
}

function calcexactyear(x,y,target){
	fraction=(target-y[0])/(y[1]-y[0]);
	year=x[0]+(x[1]-x[0])*fraction;
	return year;
}

function stackedArea(traces) {    
    for(var i=1; i<traces.length; i++) {
        for(var j=0; j<(Math.min(traces[i]['y'].length, traces[i-1]['y'].length)); j++) {
            traces[i]['y'][j] += traces[i-1]['y'][j];
        }
    }
    return traces;
}

function plotFixedGraph(){

	graphmaxx=Math.ceil(retirementyear+4+startage);
	graphmaxy=(parseInt(stache[retirementyear+4]/500000)+1)*500000;
	fixedgraphmax=(parseInt(stache[graphmaxx-startage]/500000)+1)*500000;
	savingsgraphmax=((maxArray(income)/20000)+1.5)*20000;
	radx =	(graphmaxx-startage)*.017;
	rady = 	fixedgraphmax*.04;
	fixedgraphmin = Math.min(0,Math.floor(startingarea[0]/50000)*50000);
	initiallabel=((startingarea[0]/fixedgraphmax<.04)?"":"initial");


	circle1={x: [startage+retirementyear], y:[target], type: 'scatter', name:'', text:'',mode: 'markers', marker: { color: 'rgba(255,0, 0,0)',size: 25, line: {color: 'rgba(255,0, 0,1)',width: 3}},showlegend: false, hoverinfo:'none'};
	circle2={x: [startage+retirementyear], y:[target], type: 'scatter', name:'', text:'',mode: 'markers', marker: { color: 'rgba(255,0, 0,0)',size: 12, line: {color: 'rgba(255,0, 0,1)',width: 3}},showlegend: false, hoverinfo:'none'};
	var graphtraces=[
	{	x: yearfixed, y: startingarea.slice(), fill:'tozeroy', name: 'initial', text: formatArrayMagnitude(startingarea,1), hoverinfo:'x+name+text',fillcolor: 'rgba(255, 153, 0,.5)',line:{color:'rgb(255, 153, 0)'} },
	{	x: yearfixed, y: savingsarea.slice(), fill:'tonexty', name: 'saved', text: formatArrayMagnitude(savingsarea,1),hoverinfo:'x+name+text', fillcolor: '#rgba(0, 102, 255,.5)',line:{color:'#rgb(0, 102, 255)'} },
	{	x: yearfixed, y: returnsarea.slice(), fill:'tonexty', name: 'returns', text: formatArrayMagnitude(returnsarea,1), hoverinfo:'x+name+text'},
	{	x: yearfixed, y: zeroarea.slice(), fill:'tonexty', name: 'total', fillcolor: 'rgba(0,0,0,1)',
		text: addArrs(formatArrayMagnitude(stache,1),targetpct), line: {color: 'rgb(0,0,0)'}, hoverinfo:'x+name+text'},
	];	

	data=stackedArea(graphtraces);  //convert to stacked, filled area graph (recalculates values so stacking occurs)
	data.push(circle1,circle2)

	var savingstraces=[
	{	x: yearfixed, y: spending.slice(), fill:'tozeroy', name: 'spending', text: formatArrayMagnitude(spending,1), hoverinfo:'x+name+text', fillcolor: 'rgba(255, 51, 0,.5)',line:{color:'rgba(255, 51, 0,1)'} },
	{	x: yearfixed, y: savings.slice(), fill:'tonexty', name: 'savings', text:  addArrs(formatArrayMagnitude(savings,1),savingsrates),hoverinfo:'x+name+text', fillcolor: '#rgba(0, 102, 255,.5)',line:{color:'#rgb(0, 102, 255)'} },
	{	x: yearfixed, y: zeroarea2.slice(), fill:'tonexty', name: 'income', text: formatArrayMagnitude(income,1),hoverinfo:'x+name+text', fillcolor: 'rgba(0,0,0,1)', line: {color: 'rgb(0,0,0)'}}
	];	

	traces2=savingstraces;
	// outputstring = "You have an initial savings rate of <b>" + initsavingsrate +"%</b> <br>(spending: $"+ annualspend.toLocaleString()+" income: $"+annualincome.toLocaleString()+"). <br>At a "+(wr*100).toFixed(1)+"% withdrawal rate, your retirement savings <br>target is <b>$"+parseInt(target).toLocaleString()+"</b> ("+(1/wr).toFixed(0)+" times your expected <br>retirement spending). If you continue to save at <br>this rate and get "+ (stockreturns*100).toFixed(1)+"%/"+(bondreturns*100).toFixed(1)+"% market returns, <br><b>you can retire in "+ retirementyear + " years at age "+parseInt(retirementyear+startage)+".</b>";

	outputstring2 = "Initial savings rate: <b>"+savingsrate+"%</b> (spending: $"+ annualspend.toLocaleString()+", income: $"+annualincome.toLocaleString()+")<br>Fire Target: <b>"+parseInt(target).toLocaleString()+"</b> ("+(1/wr).toFixed(0)+"x expected retirement spending)<br>Stock/Bond returns: <b>"+ (stockreturns*100).toFixed(1)+"% / "+(bondreturns*100).toFixed(1)+"%</b><br><b>You can retire in "+ retirementyear + " years at age "+parseInt(retirementyear+startage)+".</b>";
	$('#resultsdiv').html(outputstring2);


	targetlabel="<b>"+retirementyear + " years <br>(age "+parseInt(retirementyear+startage)+")</b>";

	var layout = {
		width:plotwidth,
		height: 350,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.02,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 45,t: 7,pad: 4},
  		xaxis: {
		    title: 'Age',
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    tick0: 0,
		    dtick: (smallscreen?2:1),
		    ticklen:2,
			range:[startage,graphmaxx],
		    showgrid:true,
		  },
		  yaxis: {
		    title: 'Retirement Savings ($)',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		    tick0: 0,
		    showgrid:true,
		    range:[fixedgraphmin,fixedgraphmax]
		    
		    
		  },
		  shapes: [
        
        {
            type: 'line', 
            xref: 'paper', // x-reference is assigned to the plot paper [0,1]
            yref: 'y', // y-reference is assigned to the y - values
            x0: 0,
            y0: target,
            x1: 1,
            y1: target,
            opacity: 1,
            line: {
                width: 3,
                color: 'red',
                dash: 'dash'

            }
        },
        {
		      type: 'line',
		      x0: startage+retirementyear,
		      y0: 0,
		      x1: startage+retirementyear,
		      y1: target,
		      line: {
		        width: 3,
		        color: 'gray',
		        dash: 'dash'
		      }
		    }],
		  annotations: [{
			    xref: 'paper',
			    yref: 'paper',
			    x: .99,
			    xanchor: 'right',
			    y: -.15,
			    yanchor: 'bottom',
			    text: '<b>engaging-data.com</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?11:14),
			        color: 'darkblue',

			      }
			  },{
			    xref: 'paper',
			    yref: 'paper',
			    x: .5,
			    xanchor: 'center',
			    y: .95,
			    yanchor: 'bottom',
			    text: '<b>Fixed Returns Retirement Graph</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?14:18),
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementyear-1,
			    xanchor: 'right',
			    y: target,
			    yanchor: 'top',
			    text: "FIRE Target",
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:15),
			        color: "red",
			    }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementyear,
			    xanchor: 'center',
			    y: target*1.1,
			    yanchor: 'bottom',
			    text: targetlabel,
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?14:25),
			        color: "#800000"

			    }
			  },
			  {
			    xref: 'paper',
			    yref: 'y',
			    x: .98,
			    xanchor: 'right',
			    y: startingarea[parseInt(retirementyear+3)]+savingsarea[parseInt(retirementyear+4)]+(returnsarea[parseInt(retirementyear+4)])*(smallscreen?.4:.5),
			    
			    yanchor: 'center',
			    text: 'returns',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'white',

			      }
			  },
			  {
			    xref: 'paper',
			    yref: 'y',
			    x: .98,
			    xanchor: 'right',
			    y: startingarea[parseInt(retirementyear+3)]+(savingsarea[parseInt(retirementyear+3)])*.5,
			    yanchor: 'center',
			    text: 'saved',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'white',

			      }
			  },
			  {
			    xref: 'paper',
			    yref: 'y',
			    x: .98,
			    xanchor: 'right',
			    y: startingarea[parseInt(retirementyear+3)]*.5,
			    yanchor: 'center',
			    text: initiallabel,
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'white',
			      }
			  }]
	};

	Plotly.react(stachegraphdiv, data, layout,{responsive: true,displayModeBar: false} );

}

function plotsavingsgraph(){

	yearfixed=stepArray(startage,startage+spending.length);

	var savingstraces=[
	{	x: yearfixed, y: spending.slice(), fill:'tozeroy', name: 'spending', text: formatArrayMagnitude(spending,1), hoverinfo:'x+name+text', fillcolor: 'rgba(255, 51, 0,.5)',line:{color:'rgba(255, 51, 0,1)'} },
	{	x: yearfixed, y: savings.slice(), fill:'tonexty', name: 'savings', text:  addArrs(formatArrayMagnitude(savings,1),savingsrates),hoverinfo:'x+name+text', fillcolor: '#rgba(0, 102, 255,.5)',line:{color:'#rgb(0, 102, 255)'} },
	{	x: yearfixed, y: zeroarea2.slice(), fill:'tonexty', name: 'income', text: formatArrayMagnitude(income,1),hoverinfo:'x+name+text', fillcolor: 'rgba(0,0,0,1)', line: {color: 'rgb(0,0,0)'}}
	];	

	traces2=savingstraces;

	var layout = {
		width:plotwidth,
		height: 150,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.03,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 25,t: 10,pad: 4},
  		xaxis: {
		    
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    tick0: 0,
		    dtick: (smallscreen?2:1),
		    ticklen:2,
			range: [startage,graphmaxx],
		    showgrid:true,
		  },
		  yaxis: {
		    title: '$',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		    tick0: 0,
		    showgrid:true,
		    range: [0,savingsgraphmax]
		  },
		  annotations: [{
			    xref: 'paper',
			    yref: 'y',
			    x: .98,
			    xanchor: 'right',
			    y: (spending[parseInt(retirementyear+3)])*.5,
			    
			    yanchor: 'center',
			    text: 'annual spending',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'white',

			      }
			  },
			  {
			    xref: 'paper',
			    yref: 'y',
			    x: .98,
			    xanchor: 'right',
			    y: (spending[parseInt(retirementyear+3)]+income[parseInt(retirementyear+3)])*.5,
			    yanchor: 'center',
			    text: 'annual saving',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'white',

			      }
			  }
			]	  
	};

	Plotly.react(savingsgraphdiv, stackedArea(traces2), layout,{responsive: true, displayModeBar: false});
}

function plotretirementhist(){

	var layout = {
		width:plotwidth,
		height: 150,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.03,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 25,t: 10,pad: 4},
  		xaxis: {
		    
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    tick0: 0,
		    dtick: (smallscreen?2:1),
		    ticklen:2,
			
		    showgrid:true,
		    range:[histmin,histmax],
		  },
		  yaxis: {
		    title: 'frequency',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		    tick0: 0,
		    showgrid:true,
		    
		  },
		  shapes: [
        
        {
            type: 'line', 
            xref: 'x', 
            yref: 'paper', 
            x0: medianlinex,
            y0: 0,
            x1: medianlinex,
            y1: 1,
            opacity: 1,
            line: {
                width: 3,
                color: 'red',
                dash: 'dash'

            }
        }],
        annotations: [{
			    xref: 'x',
			    yref: 'paper',
			    x: medianlinex,
			    xanchor: 'center',
			    y: 0,
			    yanchor: 'bottom',
			    text: mediantext,
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:14),
			        color: 'black',

			      }
			  }]	  
	};

	Plotly.react(retirementhistogramdiv, histogramdata, layout,{responsive: true,displayModeBar: false} );
}


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawRandomArrayElement(arr){
	return arr[getRandomInt(0,arr.length-1)];
}

function calcMCSensitivity(){
	getInputs();
	originalspend=annualspend;
	spendlist=multArrByScal([0.8,0.9,0.95,0.98,1,1.02,1.05,1.1,1.2],originalspend);
	retireMCsensitivity=[];

	for (var i=0;i<spendlist.length;i++){
		annualspend=spendlist[i];		
		calcmontecarlooutputs();
		retireyearslistMC=retirementYearMC.slice();
		retireyearslistMC.unshift(parseInt(annualspend));
		
		retireMCsensitivity.push(retireyearslistMC);
	}
	retireMCsensitivity=reshape2DArray(retireMCsensitivity);
	
	relativeMCsensitivity=[];

	mcindex=[2,4,6];
	relativeMCsensitivity[0]=addArrWScal(retireMCsensitivity[0],-retireMCsensitivity[0][4]);
	relativeMCsensitivity[1]=addArrWScal(retireMCsensitivity[mcindex[0]],-retireMCsensitivity[mcindex[0]][4]);
	relativeMCsensitivity[2]=addArrWScal(retireMCsensitivity[mcindex[1]],-retireMCsensitivity[mcindex[1]][4]);
	relativeMCsensitivity[3]=addArrWScal(retireMCsensitivity[mcindex[2]],-retireMCsensitivity[mcindex[2]][4]);
	pctMCspending=multArrByScal(relativeMCsensitivity[0],(100/retireMCsensitivity[0][4]));


	MClabeltext=[];

	for (var j =0;j<3;j++){
		var labeltext=[];
		for (var i=0;i<relativeMCsensitivity[0].length;i++){
			labeltext.push("");
			if (relativeMCsensitivity[1][i]<0){
				 labeltext[i]="Spending $"+Math.abs(relativeMCsensitivity[0][i]).toLocaleString()
				 	+" less per yr ("+pctMCspending[i]+"%)<br>speeds retirement by "+ Math.abs(relativeMCsensitivity[j+1][i]).toFixed(1)+" yrs ("+retireMCsensitivity[mcindex[j]][i]+" yrs total)." ;
			} else if (relativeMCsensitivity[1][i]>0){
				 labeltext[i]="Spending $" +Math.abs(relativeMCsensitivity[0][i]).toLocaleString()
				 	+" more per yr (+"+pctMCspending[i]+"%)<br>delays retirement by "+ Math.abs(relativeMCsensitivity[j+1][i]).toFixed(1)+" yrs ("+retireMCsensitivity[mcindex[j]][i]+" yrs total).";
			} else {
				 labeltext[i]="Baseline ("+retireMCsensitivity[mcindex[j]][i]+" yrs to retirement)";
			}	
			
			// direction + retirefixedsensitivity[1][i]+" yrs<br>("+relativefixedsensitivity[1][i].toFixed(1)+" vs baseline)";
		}
		MClabeltext.push(labeltext);
	}

}

function calcMCreturnSensitivity(){
	getInputs();
	stockreturns=parseFloat(document.getElementById("MCstockrtn").value/100);	
	fixedrtnlist=multArrByScal([0.4,0.55,0.70,0.85,1,1.15,1.3,1.45,1.6],stockreturns);
	
	retireMCsensitivity=[];
	relativeMCsensitivity=[];

	for (var i=0;i<fixedrtnlist.length;i++){
		stockrtn=fixedrtnlist[i]*100;	
		calcmontecarlooutputs(stockrtn);

		retireyearslistMC=retirementYearMC.slice();
		retireyearslistMC.unshift(stockrtn);
		
		retireMCsensitivity.push(retireyearslistMC);
	}
	retireMCsensitivity=reshape2DArray(retireMCsensitivity);
	
	mcindex=[2,4,6];
	relativeMCsensitivity[0]=addArrWScal(retireMCsensitivity[0],-retireMCsensitivity[0][4]);
	relativeMCsensitivity[1]=addArrWScal(retireMCsensitivity[mcindex[0]],-retireMCsensitivity[mcindex[0]][4]);
	relativeMCsensitivity[2]=addArrWScal(retireMCsensitivity[mcindex[1]],-retireMCsensitivity[mcindex[1]][4]);
	relativeMCsensitivity[3]=addArrWScal(retireMCsensitivity[mcindex[2]],-retireMCsensitivity[mcindex[2]][4]);
	// pctMCspending=multArrByScal(relativeMCsensitivity[0],(100/retireMCsensitivity[0][4]));


	MClabeltext=[];

	for (var j =0;j<3;j++){
		var labeltext=[];
		for (var i=0;i<relativeMCsensitivity[0].length;i++){
			labeltext.push("");
			if (relativeMCsensitivity[1][i]<0){
				 labeltext[i]="Higher mean stock returns ("+Math.abs(retireMCsensitivity[0][i]).toFixed(1)
				 	+"% per yr) <br>speeds retirement by "+ Math.abs(relativeMCsensitivity[j+1][i]).toFixed(1)+" yrs ("+retireMCsensitivity[mcindex[j]][i]+" yrs total)." ;
			} else if (relativeMCsensitivity[1][i]>0){
				 labeltext[i]="Lower mean stock returns (" +Math.abs(retireMCsensitivity[0][i]).toFixed(1)
				 	+"% per yr) <br>delays retirement by "+ Math.abs(relativeMCsensitivity[j+1][i]).toFixed(1)+" yrs ("+retireMCsensitivity[mcindex[j]][i]+" yrs total).";
			} else {
				 labeltext[i]="Baseline returns of "+retireMCsensitivity[0][i].toFixed(1)+ "% ("+retireMCsensitivity[mcindex[j]][i]+" yrs to retirement)";
			}	
			
			// direction + retirefixedsensitivity[1][i]+" yrs<br>("+relativefixedsensitivity[1][i].toFixed(1)+" vs baseline)";
		}
		MClabeltext.push(labeltext);
	}
	//reset meanstock returns to value in input box (so that URL generated is set to baseline and not last value in sensitivity)
	meanstockreturns=parseFloat(document.getElementById("MCstockrtn").value);
}

function calcandplotMonteCarlo(){
	getInputs();
	calcmontecarlooutputs();
	plotMCPercentiles();
}

function calcmontecarlooutputs(fixedstockreturn,fixedbondreturn){
	
	if (fixedstockreturn==undefined){
		meanstockreturns=parseFloat(document.getElementById("MCstockrtn").value);
	} else {
		meanstockreturns=parseFloat(fixedstockreturn);	
	}

	if (fixedbondreturn==undefined){
		meanbondreturns=parseFloat(document.getElementById("MCbondrtn").value);			
	} else {
		meanbondreturns=parseFloat(fixedbondreturn);
	}

	numSims=1000;  // number of monte carlo simulations
	simlength=50; // make it be based in part on the fixed method's retirementyear
	stock_adjuster=(meanstockreturns-8.1)/100;
	bond_adjuster=(meanbondreturns-2.4)/100;
	yearMC=stepArray(startage,startage+simlength);

	MCcycles=[];
	retirementyearlistMC=[];

	for (var sim=0;sim<numSims;sim++){

		var stacheMC=[beginningstache]; //reset stache before starting calculation cycle of returns
		
		retirementyearlistMC.push(simlength);
		initsavingsrate = (annualincome-annualspend/annualincome*100).toFixed(1);

		var retirementflag=0;

		for (var yr=0;yr<=simlength;yr++){
			var thisyearincome=0;
			for (var k=0;k<incomelist.length;k++){
				thisyearincome+=getIncomeExpense(incomelist[k],incomestartagelist[k],incomeendagelist[k],yr);
			}
			// var income=getIncome(SSincomestart,SSstartage,SSendage,inflation_adjustment_array[j],j)+getIncome(pensionincomestart,pensionstartage,pensionendage,inflation_adjustment_array[j],j);  //j is age
			var thisyearexpense=0;
			for (var k=0;k<expenselist.length;k++){
				thisyearexpense+=getIncomeExpense(expenselist[k],expensestartagelist[k],expenseendagelist[k],yr);
			}
			if (yr==0){
				basespendingMC=[annualspend]
				spendingMC = [annualspend+thisyearexpense]; //initialize spending to annual spend
				baseincomeMC=[annualincome];
				incomeMC = [annualincome+thisyearincome];
				savingsMC = [annualincome+thisyearincome-annualspend-thisyearexpense];
			} else {
				//draw returns from stock and bond lists
				stockrtndraw=  drawRandomArrayElement(real_stockdiv_return)+stock_adjuster;
				bondrtndraw= drawRandomArrayElement(real_fixed_return)+bond_adjuster;

				newincome = baseincomeMC[yr-1]*(1+incomerate);
				baseincomeMC.push(newincome);
				incomeMC.push(newincome+thisyearincome);
				
				newspend=basespendingMC[yr-1]*(1+spendingrate);
				basespendingMC.push(newspend);
				spendingMC.push(newspend+thisyearexpense);
				savingsMC.push(incomeMC[yr]+thisyearincome-spendingMC[yr]-thisyearexpense);

				if (stacheMC[yr]<=0){
					eoy_stacheMC = stacheMC[yr-1]+savingMC[yr];   //no returns on a negative stache
				} else {
					eoy_stacheMC = (stacheMC[yr-1]+savingsMC[yr])*cashpct*1 
					+ (stacheMC[yr-1])*fixedpct*(1+bondrtndraw) + savingsMC[yr]*fixedpct*((1+bondrtndraw)**0.5)
					+ (stacheMC[yr-1])*stockpct*(1+stockrtndraw) +savingsMC[yr]*stockpct*((1+stockrtndraw)**0.5);

					//stache value at end of year
					stacheMC.push(parseInt(eoy_stacheMC));
					if (eoy_stacheMC>=target&&retirementflag==0){
						retireyearMCfloat=parseFloat(calcexactyear([yr-1,yr],[stacheMC[yr-1],stacheMC[yr]],target).toFixed(1));
						retirementyearlistMC[sim]=retireyearMCfloat;
						retirementflag=1;
						
					}
				}
			}
			

		}

		MCcycles.push(stacheMC);	
	}

	yearlyArrayMC=reshape2DArray(MCcycles);
	percentilesListMC=[5,10,25,50,75,90,95];
	percentilesNamesMC=["5%","10%","25%","median","75%","90%","95%"];
	percentilesArrayMC=[[],[],[],[],[],[],[]];
	retirementYearMC=[];
	graphtextMC=[];

	for (var m=0;m<percentilesListMC.length;m++){  //m is index of different percentiles
		var retirementflag=0;
		for (var yr=0;yr<yearlyArrayMC.length-1;yr++){ //k is years
			
			var stachelevelMC=percentileArray(yearlyArrayMC[yr].slice(),percentilesListMC[m]);
			percentilesArrayMC[m].push(stachelevelMC);

			if (stachelevelMC>=target&&retirementflag==0){
				retirementflag=1;
				
				var exactyear =  parseFloat(calcexactyear([yr-1,yr],[percentilesArrayMC[m][yr-1],percentilesArrayMC[m][yr]],target).toFixed(1));
				retirementYearMC.push(exactyear);
				graphtextMC.push(exactyear+" years (age "+parseInt(exactyear+startage)+")");
			}		
		}
		if (retirementflag==0){
			var exactyear=yearlyArrayMC.length;
			retirementYearMC.push(exactyear);
			graphtextMC.push(exactyear+" years (age "+parseInt(exactyear+startage)+")");

		}
	}
	
	
}

function plotMCPercentiles(){

	mediantextMC="<b>"+retirementYearMC[3]+" years<br>(age "+parseInt(retirementYearMC[3]+startage)+")</b>";

	tracesMC=[{	x: yearMC, y: percentilesArrayMC[1].slice(), mode: 'lines', fill:'none', name: '10th %ile', text: formatArrayMagnitude(percentilesArrayMC[1].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(255, 165, 0,.5)',line:{color:'rgba(255, 165, 0,1)'} },
	{	x: yearMC, y: percentilesArrayMC[5].slice(), mode: 'lines',fill:'tonexty', name: '90th %ile', text: formatArrayMagnitude(percentilesArrayMC[5].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(255, 165, 0,.5',line:{color:'rgba(255, 165, 0,1)'}},
	{	x: yearMC, y: percentilesArrayMC[2].slice(), mode: 'lines', fill:'none', name: '25th %ile', text: formatArrayMagnitude(percentilesArrayMC[2].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0, 255, 102,.5)',line:{color:'rgb(0, 255, 102)'} },
	{	x: yearMC, y: percentilesArrayMC[4].slice(), mode: 'lines', fill:'tonexty', name: '75th %ile', text: formatArrayMagnitude(percentilesArrayMC[4].slice(),1), marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0, 255, 102,.5)',line:{color:'rgb(0, 255, 102)'}},
	{	x: yearMC, y: percentilesArrayMC[3].slice(), mode: 'lines', fill:'none', name: 'median', text: formatArrayMagnitude(percentilesArrayMC[3].slice(),1),marker:{size:0},hoverinfo:'x+name+text', fillcolor: 'rgba(0,0,0,1)', line: {color: 'rgb(0,0,0)'}},
	{ 	x: [retirementYearMC[1]+startage], y: [target], name: '10th %ile', type: 'scatter', text: graphtextMC[1], hoverinfo:'x+name+text',mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(216, 130, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearMC[5]+startage], y: [target], name: '90th %ile', type: 'scatter', text: graphtextMC[5], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(216, 130, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearMC[2]+startage], y: [target], name: '25th %ile', type: 'scatter', text: graphtextMC[2], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(0, 105, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearMC[4]+startage], y: [target], name: '75th %ile',type: 'scatter', text: graphtextMC[4], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(17, 157, 255,0)',size: 8, line: {color: 'rgb(0, 105, 0)',width: 3}},showlegend: false},
	{ 	x: [retirementYearMC[3]+startage], y: [target], name: 'median',type: 'scatter', text: graphtextMC[3], hoverinfo:'x+name+text', mode: 'markers', marker: { color: 'rgba(255,0, 0,0)',size: 15, line: {color: 'rgb(255, 0, 0)',width: 3}},showlegend: false},
	];	

	graphmaxxMC=parseInt(retirementYearMC[1])+startage+1;
	graphmaxyMC=percentilesArrayMC[5][graphmaxxMC-startage];
	MCgraphmin = Math.min(0,Math.floor(beginningstache/50000)*50000);
	outputstringMC1="Initial savings rate: <b>"+savingsrate+"%</b> (spending: $"+ annualspend.toLocaleString()+", income: $"+annualincome.toLocaleString()+")<br>Fire Target: <b>"+parseInt(target).toLocaleString()+"</b> ("+(1/wr).toFixed(0)+"x expected retirement spending)<br>In <b>"+numSims+"</b> simulations, <b>"+parseInt(retirementYearMC[3]+startage)+"</b> is the median retirement age <b>("+ retirementYearMC[3]+" years)</b>"
	outputstringMC2="10th to 90th %ile: <b>"+retirementYearMC[5]+" to "+retirementYearMC[1]+" years</b> to retirement";
	outputstringMC3="25th to 75th %ile: <b>"+retirementYearMC[4]+" to "+retirementYearMC[2]+" years</b> to retirement";

	$('#resultsdiv').html(outputstringMC1+"<br><span class='tenninety'>"+outputstringMC2+"</span><br><span class='twentyfiveseventyfive'>"+outputstringMC3+"</span>");

	var layout = {
		width:plotwidth,
		height: 350,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.02,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 45,t: 7,pad: 4},
  		xaxis: {
		    title: 'Age',
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    tick0: 0,
		    dtick: (smallscreen?2:1),
		    ticklen:2,
			range:[startage,graphmaxxMC],
		    showgrid:true,
		  },
		  yaxis: {
		    title: 'Retirement Savings ($)',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		    tick0: 0,
		    showgrid:true,
		    range:[MCgraphmin,graphmaxyMC]
		    
		    
		  },
		  shapes: [
        
        {
            type: 'line', 
            xref: 'paper', // x-reference is assigned to the plot paper [0,1]
            yref: 'y', // y-reference is assigned to the y - values
            x0: 0,
            y0: target,
            x1: 1,
            y1: target,
            opacity: 1,
            line: {
                width: 3,
                color: 'red',
                dash: 'dash'

            }
        },
        {
		      type: 'line',
		      x0: startage+retirementYearMC[3],
		      y0: 0,
		      x1: startage+retirementYearMC[3],
		      y1: target,
		      line: {
		        width: 3,
		        color: 'gray',
		        dash: 'dash'
		      }
		    }],
		  annotations: [{
			    xref: 'paper',
			    yref: 'paper',
			    x: .99,
			    xanchor: 'right',
			    y: .0,
			    yanchor: 'bottom',
			    text: '<b>engaging-data.com</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?11:14),
			        color: 'darkblue',

			      }
			  },
			  {
			    xref: 'paper',
			    yref: 'paper',
			    x: .5,
			    xanchor: 'center',
			    y: .95,
			    yanchor: 'bottom',
			    text: '<b>Monte Carlo Returns Retirement Graph</b>',
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?14:18),
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementYearMC[3]/2,
			    xanchor: 'right',
			    y: target,
			    yanchor: 'top',
			    text: "FIRE Target",
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?12:15),
			        color: "red",
			    }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: startage+retirementYearMC[3],
			    xanchor: 'center',
			    y: target*1.1,
			    yanchor: 'bottom',
			    text: mediantextMC,
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: (smallscreen?15:25),
			        color: "#800000"

			    }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxMC,
			    xanchor: 'right',
			    y: percentilesArrayMC[1][graphmaxxMC-startage],
			    yanchor: 'bottom',
			    text: '<b>'+percentilesNamesMC[1],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxMC,
			    xanchor: 'right',
			    y: percentilesArrayMC[5][graphmaxxMC-startage]*.94,
			    yanchor: 'top',
			    text: '<b>'+percentilesNamesMC[5],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxMC,
			    xanchor: 'right',
			    y: percentilesArrayMC[4][graphmaxxMC-startage]*.95,
			    yanchor: 'top',
			    text: '<b>'+percentilesNamesMC[4],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxMC,
			    xanchor: 'right',
			    y: percentilesArrayMC[2][graphmaxxMC-startage],
			    yanchor: 'bottom',
			    text: '<b>'+percentilesNamesMC[2],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',

			      }
			  },
			  {
			    xref: 'x',
			    yref: 'y',
			    x: graphmaxxMC,
			    xanchor: 'right',
			    y: percentilesArrayMC[3][graphmaxxMC-startage]*.97,
			    yanchor: 'center',
			    text: '<b>'+percentilesNamesMC[3],
			    showarrow: false,
			    font: {
			        family: 'Arial',
			        size: 11,
			        color: 'black',
			      }
			  }]
	};

	Plotly.react(MCgraphdiv, tracesMC, layout,{responsive: true,displayModeBar: false} );

}

function plotreturnsensitivitygraph(){
	if (graphmode=="fix"){
		calcFixedRtnSensitivity();
		var sens = {
			x: retirefixedsensitivity[0],
			y: retirefixedsensitivity[1],
			marker: { color: 'black',size: 4, line: {color: 'black',width: 4}},
			name: '',
			type: 'scatter',
			text: fixedlabeltext,
			hoverinfo:'name+text'
		};
		sensitivitydata = [sens];
		 maxplot=maxArray(sens.y);
		 minplot=minArray(sens.y);
	} else if (graphmode=="mc"){
		calcMCreturnSensitivity();
		var sens1 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[2],
			name: '10th %ile',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[0]
		};
		var sens2 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[4],
			name: 'median',
			marker: { color: 'black',size: 4, line: {color: 'black',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[1],
		};
		var sens3 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[6],
			name: '90th %ile',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[2],

		};
		sensitivitydata = [sens1,sens2,sens3];
		 maxplot=Math.max(maxArray(sens1.y),maxArray(sens2.y),maxArray(sens3.y));
		 minplot=Math.min(minArray(sens1.y),minArray(sens2.y),minArray(sens3.y));
	}


	console.log(maxplot,minplot);

	if (maxplot-minplot<15){
		tickinterval=2;
	} else if (maxplot-minplot<30){
		tickinterval=4;
	} else {
		tickinterval=5;
	}
	var layout = {
		width:plotwidth,
		height: 150,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.03,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 45,t: 10,pad: 4},
		xaxis: {
		    title: 'Annual Stock Returns %',
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    ticklen:2,
		    showgrid:true,
		  },
		  yaxis: {
		    title: 'Years to Retire',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		   	dtick: tickinterval,
		    showgrid:true,
		  }
	}

Plotly.react('sensitivityDiv', sensitivitydata, layout,{responsive: true,displayModeBar: false} );
}


function plotspendingsensitivitygraph(){

	if (graphmode=="fix"){
		calcFixedSensitivity();
		var sens = {
			x: retirefixedsensitivity[0],
			y: retirefixedsensitivity[1],
			marker: { color: 'black',size: 4, line: {color: 'black',width: 4}},
			name: '',
			type: 'scatter',
			text: fixedlabeltext,
			hoverinfo:'name+text'
		};
		sensitivitydata = [sens];
		 maxplot=maxArray(sens.y);
		 minplot=minArray(sens.y);
	} else if (graphmode=="hist"){
		calcHistSensitivity();
		var sens1 = {
			x: retirehistsensitivity[0],
			y: retirehistsensitivity[2],
			type: 'scatter',
			text: histlabeltext[0],
			name: '10th %ile',
			hoverinfo:'name+text',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
		};
		var sens2 = {
			x: retirehistsensitivity[0],
			y: retirehistsensitivity[4],
			type: 'scatter',
			text: histlabeltext[1],
			name: 'median',
			hoverinfo:'name+text',
			marker: { color: 'black',size: 4, line: {color: 'black',width: 4}},
		};
		var sens3 = {
			x: retirehistsensitivity[0],
			y: retirehistsensitivity[6],
			type: 'scatter',
			text: histlabeltext[2],
			name: '90th %ile',
			hoverinfo:'name+text',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
		};
		sensitivitydata = [sens1,sens2,sens3];
		 maxplot=Math.max(maxArray(sens1.y),maxArray(sens2.y),maxArray(sens3.y));
		 minplot=Math.min(minArray(sens1.y),minArray(sens2.y),minArray(sens3.y));
	} else if (graphmode=="mc"){
		calcMCSensitivity();
		var sens1 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[2],
			name: '10th %ile',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[0]
		};
		var sens2 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[4],
			name: 'median',
			marker: { color: 'black',size: 4, line: {color: 'black',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[1],
		};
		var sens3 = {
			x: retireMCsensitivity[0],
			y: retireMCsensitivity[6],
			name: '90th %ile',
			marker: { color: 'darkorange',size: 4, line: {color: 'darkorange',width: 4}},
			type: 'scatter',
			hoverinfo:'name+text',
			text: MClabeltext[2],

		};
		sensitivitydata = [sens1,sens2,sens3];
		 maxplot=Math.max(maxArray(sens1.y),maxArray(sens2.y),maxArray(sens3.y));
		 minplot=Math.min(minArray(sens1.y),minArray(sens2.y),minArray(sens3.y));
	}

	//reset annual spend after sensitivity analysis to value in input box
	annualspend = parseInt((document.getElementById("annualspending").value).replace(/\,/g, '').replace(/\$/g,''));

	console.log(maxplot,minplot);

	if (maxplot-minplot<15){
		tickinterval=2;
	} else if (maxplot-minplot<30){
		tickinterval=4;
	} else {
		tickinterval=5;
	}
	var layout = {
		width:plotwidth,
		height: 150,
		showlegend: false,
		paper_bgcolor: '#eeeeee',
  		plot_bgcolor: '#eeeeee',
		legend: {
			"orientation": "h",
			x: 0,
			y: 1.03,
			font: {
		      family: 'Arial',
		      size: 12,
		    },
		    tracetoggle: false,
		    bgcolor: 'rgba(255,255,255,0)',
		},
		margin: {l: 50,r: 20,b: 45,t: 10,pad: 4},
		xaxis: {
		    title: 'Current Annual Spending',
		    fixedrange: true,
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    titlefont: {
		      family: 'Arial',	
		      size: 14,
		      color: '#7f7f7f'
		    },
		    ticklen:2,
		    showgrid:true,
		  },
		  yaxis: {
		    title: 'Years to Retire',
		    fixedrange: true,
		    titlefont: {
		      family: 'Arial',	
		      size: 15,
		      color: '#7f7f7f'
		    },
		    tickfont: {
		      family: 'Arial',
		      size: 11,
		      color: 'black'
		    },
		    ticks: 'inside',
		   	dtick: tickinterval,
		    showgrid:true,
		  }
	}

Plotly.react('sensitivityDiv', sensitivitydata, layout,{responsive: true,displayModeBar: false} );

}

hoverInfo = document.getElementById('hoverInfo');

function hovereventcheck(){
	sensitivityDiv.on('plotly_hover', function(data){
    pointdata=data;
    infotext = pointdata.points.map(function(d){
      return ([d.data.name, d.x,d.y.toPrecision(3)]);
    });
  

    hoverInfo.innerHTML = "";//infotext.join('<br/>');
})
 .on('plotly_unhover', function(data){
    hoverInfo.innerHTML = '';
});	
}


window.onload = function ()
{
	if (window.self !== window.top){
		parent.resizecalc();
	}
	setTimeout(function(){ bodyheight=$("#calc").height(); console.log(bodyheight)}, 100);
	setTimeout(function(){ $("#calc").height(bodyheight+33);}, 200);

	
}


	

function resizerotatecheck(){
	$(window).bind('resize', function () { 
		plotwidth = window.innerWidth;
		console.log(plotwidth);
		calcandmakegraphs();
		parent.resizecalc();
		bodyheight=$("#calc").height();

	});
	$(window).on("orientationchange",function(){
    	plotwidth = window.innerWidth;
		console.log(plotwidth);
		calcandmakegraphs();
		resizetext();
		bodyheight=$("#calc").height();
		parent.resizecalc();
});
}

resizetext()