import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';
import NumberFormat from 'react-number-format';

import DataService from '../DataService.js';
import ZoneItem from './ZoneItem.js';


import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';




export default class ZoneModal extends Component {

	constructor(){
		super();
		
		this.state = {
				electionHistory:{},
				zoneItems :{},
				zoneTitle:"",
				pop:0
		}
		
		this.zoneItems = {}
	}
	
	
	
	parseCode(code){
		
		const zones = this.props.data.zones;

		var zoneTitle = "";
		var pop = 0;
    	
    	if(zones[code] === undefined){
        	var arr = code.split(",");
        	arr.forEach(function(c){
        		zoneTitle += zones[c].name +" ";
        		pop += zones[c].pop;
        	});    		
    	}else{
    		zoneTitle =zones[code].name;
    		pop = zones[code].pop;
    	}
    	
    	this.setState({zoneTitle:zoneTitle})
    	this.setState({pop:pop})
    	
	}
	
	
	async getHistory(zone){
		const result = await DataService.getZoneHistory(zone);
		
		const electionHistory = {};
		const zoneItems = {};

		result.forEach(function(item){
    		if(electionHistory[item.election] === undefined){
    			electionHistory[item.election] = [];
    		}
    		electionHistory[item.election].push(item);
    		
    		item.show = false;
    		item.candidates = [];
    		item.councils = [];
    		item.rates = [];
    		item.metros = [];
    		item.mrates = [];

    		zoneItems[item.id] = item;
    	});
		
		this.setState({electionHistory:electionHistory})
    	//this.setState({zoneItems:zoneItems})
    	
    	this.zoneItems = zoneItems;

		
	}
	
	async getCandidate(zone){
		
		const result = await DataService.getZoneCandidate(zone);

		const zoneItems = this.zoneItems;
		result.forEach(function(candidate) {
    		
    		zoneItems[candidate.item].candidates.push(candidate);
    	});
    	
    	Object.keys(zoneItems).forEach(function(key){
    		const item = zoneItems[key];
    		var total = 0;
    		item.candidates.forEach(function(candidate){
    			total += candidate.rate;
    		});
    		item.candidates.forEach(function(candidate){
    			candidate.percent = candidate.rate*100/total;
    		});
    	});
    	//this.setState({zoneItems:zoneItems})
    	this.zoneItems = zoneItems;
	}
	
	async getCouncil(zone){
		
		const zoneItems = this.zoneItems;
		const result = await DataService.getZoneCouncil(zone);
		result.forEach(function(council) {
			if(zoneItems[council.item]!==undefined){
	    		if(council.type === 'rate'){
		    		zoneItems[council.item].rates.push(council);    	    			    	  
	    		}else if(council.type === 'mrate'){
		    		zoneItems[council.item].mrates.push(council);    	    			    	  
	    		}else if(council.type === 'metro'){
		    		zoneItems[council.item].metros.push(council);    	    			    	      	    			
	    		}else{
		    		zoneItems[council.item].councils.push(council);    	    			    	    			
	    		}
			}
    	});
    	
    	
    	this.zoneItems = zoneItems;
	}
	
	async history(zone){
		
		
		
		this.parseCode(zone);
		
    	
		await this.getHistory(zone)
		
		await this.getCandidate(zone);
		await this.getCouncil(zone);
    
		this.setState({zoneItems:this.zoneItems})
	}
	
	render() {
		const electionHistory = this.state.electionHistory;
		
		return <DataContext.Consumer>
		{data=>(
			 <MainContext.Consumer>
			{state=>(
				<Modal show={this.props.show} onHide={()=>this.props.close('zone')}>
			        <Modal.Header closeButton className="pl-4 pt-4">
			          <Modal.Title>
			          	<h5>
			          	<span className="mr-1">{this.state.zoneTitle}</span>
			          	<small  style={{color:'silver'}}> <small className="mr-1"><span className="glyphicon glyphicon-user"> </span></small>
			          	<NumberFormat displayType={'text'} value={this.state.pop} thousandSeparator={true}  /></small>
			          	</h5>
			          </Modal.Title>
			        </Modal.Header>
			        <Modal.Body className="pl-3">
			        {
			        	Object.keys(electionHistory).map((electionName,i)=>{
			        		const items = electionHistory[electionName]
			        		return <div key={i}>
			        			<small><strong>{electionName}</strong></small>
			        			{
			        				
			        				items.map((item,i)=>{
			        					return <ZoneItem item={item} key={i}/>
			        				})
			        			}
			        			
			        		</div>
			        	})
			        }		        	
			        </Modal.Body>
	
		      	</Modal>
			)}
			</MainContext.Consumer>
		)}
	     </DataContext.Consumer>
	      	
	}
}