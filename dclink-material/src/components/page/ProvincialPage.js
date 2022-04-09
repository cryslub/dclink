import React from 'react';

import cloneDeep from 'lodash/cloneDeep';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Hidden from '@material-ui/core/Hidden';


import Page from './Page.js';

import ProvincialItem from '../item/ProvincialItem.js';
import ProportionItem from '../item/ProportionItem.js';
import StaticsItem from '../item/StaticsItem.js';




import LongBar from '../chart/LongBar.js';
import MultiSunburst from '../chart/MultiSunburst.js';
import Sunburst from '../chart/Sunburst.js';

import {MainContext} from '../../MainContext.js';
import {DataContext} from '../../DataContext.js';

import DataService from '../../DataService.js';



export default class ProvincialPage extends Page {
	
	async getRates(){
		const metros = {};
    	const basics = {};
    	var metroParty = 0;
    	var basicParty = 0;
    	const rateParty = [];
    	const allBasics = {};    	
    	const totals={};
    	const metroItems = {};
    	
    	const rates = await DataService.getRates(this.props.currentElection.id)
    	
	    rates.forEach(function(rate){
    		if(rate.type === '광역' || rate.type === '국회'){
    			if(metroParty === 0) metroParty =rate.party;
    			if(metros[rate.party]===undefined){
    				metros[rate.party] = [];
    				rateParty.push({party:rate.party,count:0});
    			}
    			metros[rate.party].push(rate);
    			
    			if(rate.type === '광역'){
    				if(metroItems[rate.code] === undefined){
    					metroItems[rate.code] = [];
    				}
    				metroItems[rate.code].push(rate);
    			}
    			
    			if(rate.type === '국회'){
        			allBasics[rate.code] = rate;    				
    			}
    		}else if(rate.type === '기초' ){
    			if(basicParty === 0) basicParty =rate.party;
    			allBasics[rate.code] = rate;
    			
    			if(basics[rate.party]===undefined){
    				basics[rate.party] = [];
    			}
    			
    			var arr = rate.code.split(",");

    			arr.forEach(function(code){
    				var r = cloneDeep(rate);
    				r.code = code;
	    			basics[rate.party].push(r);		    				
    			});
    		}
    		
    		if(totals[rate.item]=== undefined){
    			totals[rate.item] = 0
    		}
    		
    		totals[rate.item] += rate.rate;
    	});
    	
    	rates.forEach(function(rate){
    		rate.total = totals[rate.item];
    	});
    	
    	Object.keys(basics).forEach((party)=>{
    		const p = basics[party];
    		p.forEach((rate)=>{
    			rate.total = totals[rate.item];
    		})
    	})
	    	
    	if(Object.keys(basics).length > 0){
	    	//drawMetroRate('metroRate',metroParty,metros);
	    	//drawMetroRate('basicRate',basicParty,basics);
    	}else{
    		rateParty.forEach(function(party){
    			party.count = metros[party.party].length;
    		});
    		for(var i=0;i<rateParty.length;){
    			if(rateParty[i].party===5){
    				rateParty.splice(i,1);
    			}else{
    				i++;
    			}
    		}
	    	//drawSenateRate('metroRate',metroParty,metros);	    		
    	}
	 
    	const statics = this.state.statics;
    	statics.metros = metros;
    	statics.basics = basics;
    	statics.rateParty = rateParty;
    	statics.allBasics = allBasics;
    	statics.metroItems = metroItems;
    	this.setState({statics:statics})		
	}
	
	
	
	
	async getProportion(){
    	const rmetros = {};
    	const rbasics = {};
    	var metroParty = 0;
    	var basicParty = 0;
    	const rmetroItems = {}
    	
	    const rrates = await DataService.getProportion(this.props.currentElection.id)

    	rrates.forEach(function(rate){
    		if(rate.type === '광역'){
    			if(metroParty === 0) metroParty =rate.party;
    			if(rmetros[rate.party]===undefined)
    				rmetros[rate.party] = [];
    			rmetros[rate.party].push(rate);
    			
    			if(rmetroItems[rate.code] === undefined){
    				rmetroItems[rate.code] = [];
				}
    			rmetroItems[rate.code].push(rate);
    		}else if(rate.type === '기초'){
    			if(basicParty === 0) basicParty =rate.party;

    			if(rbasics[rate.party]===undefined){
    				rbasics[rate.party] = [];
    			}
    			
    			var arr = rate.code.split(",");

    			arr.forEach(function(code){
    				var r = cloneDeep(rate);
    				r.code = code;
	    			rbasics[rate.party].push(r);		    				
    			});
    		}
    	});
	    
    	const statics = this.state.statics;
    	statics.rmetros = rmetros;
    	statics.rbasics = rbasics;
    	statics.rmetroItems = rmetroItems;
    	
    	this.setState({statics:statics})		

	}
	
	
	async extra(state){
		if(state.name === '통계'){
			await this.getRates();
			await this.getProportion();	        	
        }
	}
	
	items(items){
		const self = this;
		const currentState = this.state.currentState;
		var style= {    width: 'calc(100% - 50px)'};
		
		
		
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<Grid container justify="space-between" direction="row">
					<Grid item style={state.showResult==='full'?style:null}>
				  		{Object.keys(items).map(function(keyName, keyIndex) {
				  			
				  			const item = items[keyName];
				  			
							  const ref = React.createRef();
							if(data.items[keyName]!=undefined)
								data.items[keyName].ref = ref;
								
				  			if(item.name==='' && item.title===''&& item.party==0) return null;
				  			
				  			if(currentState.name==='비례') return 	<ProportionItem item={item} key={keyIndex} index={keyIndex} ref={ref}/>
				  			else if(currentState.name==='통계') return 	<StaticsItem item={item} key={keyIndex} statics={self.state.statics} context={data}/>
				  			else return 	<ProvincialItem item={item} key={keyIndex} index={keyIndex} currentElection={self.props.currentElection} ref={ref}/>
						})}
		  			</Grid>
		  			<Hidden xsDown implementation="css">
		  			{
		  				(currentState.name==='비례' && state.showResult!=='min')?
		  				<Box height='100%'>
		  					<small>득표</small>
		  					<LongBar data={data} items={items}/>
		  				</Box>
		  				:null
		  			}
		  			</Hidden>
		  		</Grid>
	    	 )}
		  	</DataContext.Consumer>
		 )}
	  	</MainContext.Consumer>
	}
	
	init(){
		
	}
	
	

	statics(items){
		var isBasic = false;
		var isMetro = false;
		var isStatics = false;
		Object.keys(items).forEach((key)=>{
			const item = items[key];
			if(item.type==='기초') isBasic = true
			if(item.type==='광역') isMetro = true
			if(item.type==='광역득표') {
				isStatics = true
				isBasic = true
			}
			if(item.type==='득표') {
				isStatics = true
			}
		});
		
		
		if(this.state.currentState === undefined) return null
		
		if(isMetro && !isBasic) return null;
		if(isStatics && !isBasic) return null;
		
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<>
	    		{state.showResult==='full' && this.state.currentState.name!=='비례' && this.props.currentElection.type!=='inspection'?
	    		<Grid container>
	    			<Grid item>
	    			<Box mb={1}><Typography variant="h6"  >{isBasic?<span>{isStatics?'광역':'기초'} 후보 및 비례득표</span>:<span>후보득표</span>} 통계</Typography></Box>
	    				<Grid container spacing={2}>
	    				
	    				{
	    					isStatics?<Sunburst context={data} statics={this.state.statics}/>  				
	    					:<MultiSunburst context={data} items={items} isBasic={isBasic} currentState={this.state.currentState}/>
	    				}
	    				
						</Grid>
					</Grid>
				
				</Grid>
				:null
	    		}
	    		</>
	    	)}
	    	</DataContext.Consumer>
    	)}
    	</MainContext.Consumer>
	}
	
	layout(){
		const items = this.state.items;
	    return  <>	    	
	      	{
	      		
	      		this.items(items)
	      		
	      	}
	      	{
	      		this.statics(items)
	      	}
	    </>
	}
	
	render() {
		
		
		return <>
			{this.layout()}
		</>
		
	}
}