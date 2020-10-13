import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Nav from 'react-bootstrap/Nav';
import cloneDeep from 'lodash/cloneDeep';

import Page from './Page.js';

import ProvincialItem from './ProvincialItem.js';
import ProportionItem from './ProportionItem.js';
import StaticsItem from './StaticsItem.js';


import LongBar from './LongBar.js';
import MultiSunburst from './MultiSunburst.js';
import Sunburst from './Sunburst.js';

import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';

import DataService from '../DataService.js';



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
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<Row className="mb-3">
					<span className="p-0" style={{    width: 'calc(100% - 60px)'}}>
				  		{Object.keys(items).map(function(keyName, keyIndex) {
				  			
				  			const item = items[keyName];
				  			
				  			if(item.name==='' && item.title===''&& item.party==0) return null;
				  			
				  			if(currentState.name==='비례') return 	<ProportionItem item={item} key={keyIndex} index={keyIndex}/>
				  			else if(currentState.name==='통계') return 	<StaticsItem item={item} key={keyIndex} statics={self.state.statics} context={data}/>
				  			else return 	<ProvincialItem item={item} key={keyIndex} index={keyIndex}/>
						})}
		  			</span>
		  			{
		  				(currentState.name==='비례' && state.showResult!=='min')?
		  				<span sm="auto" className="pl-2 pr-0">
		  					<small>득표</small>
		  					<LongBar data={data} items={items}/>
		  				</span>
		  				:null
		  			}
		  		</Row>
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
		
		
		
		if(isMetro && !isBasic) return null;
		if(isStatics && !isBasic) return null;
		
		return <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer>
	    	{data=>(
	    		<>
	    		{state.showResult==='full' ?
	    		<Row className="mb-3">
	    			<Col>
	    			<div className="text-muted">{isBasic?<span>{isStatics?'광역':'기초'} 후보 및 비례득표</span>:<span>후보득표</span>} 통계</div>
	    				<Row>{
	    					isStatics?<Sunburst context={data} statics={this.state.statics}/>  				
	    					:<MultiSunburst context={data} items={items} isBasic={isBasic} currentState={this.state.currentState}/>
	    				}
						</Row>
					</Col>
				
				</Row>
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
		const leftSize = this.props.leftSize;
		const width = 'calc(100% - '+(leftSize+45)+'px)';
	    return  <>
	    	
	    	
		    <Row className="provincial mt-3">
		      <span style={{paddingLeft:'10px',width:leftSize}} className="column" >
		        <Nav variant="pills" >
		          
		        {
	        		this.state.states.map((state,i)=>{
	        		return 	<Nav.Item key={i} onClick={()=>this.selectState(state)}>
	        			<Nav.Link eventKey={'state'+i} active={this.state.currentState===state}>{state.name}</Nav.Link>
			          </Nav.Item>
			          

	        	})}
		        
		        
		        	  
		        </Nav>
		      </span>
		      <span style={{paddingLeft:'30px',width:width}} className="column" >
		      	{
		      		
		      		this.items(items)
		      		
		      	}
		      	{
		      		this.statics(items)
		      	}
		      </span>
		    </Row>
	    </>
	}
	
	render() {
		
		
		return <>
			{this.layout()}
		</>
		
	}
}