import React, { Component } from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';


import PersonIcon from '@material-ui/icons/Person';

import ZoneItem from './ZoneItem.js';
import ResponsiveDialog from './ResponsiveDialog.js';

import DataService from '../../DataService.js';


import {DataContext} from '../../DataContext.js';
import {MainContext} from '../../MainContext.js';

import Util from '../../Util.js';



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
	
	content() {
		const electionHistory = this.state.electionHistory;
		
		return <DataContext.Consumer>
		{data=>(
			 <MainContext.Consumer>
			{state=>(
					<>
			        {
			        	Object.keys(electionHistory).map((electionName,i)=>{
			        		const items = electionHistory[electionName]
			        		return <>
			        			<Box mb={1} mt={3}><Typography variant="subtitle2">{electionName}</Typography></Box>
			        			
			        			<Box mb={5} >
			        			 <Paper>
				        			 
				        			{
				        				
				        				items.map((item,i)=>{
				        					return <ZoneItem item={item} key={i} index={i}/>
				        				})
				        			}
			        			</Paper>
			        			</Box>
			        		</>
			        	})
			        }
			        </>
			)}
			</MainContext.Consumer>
		)}
	     </DataContext.Consumer>
	      	
	}
	
	render() {
		
		return  <ResponsiveDialog 
			open={this.props.open}
			close={this.props.close}
			title={<Grid container alignItems="center">
					<Typography variant="h6">{ this.state.zoneTitle}</Typography>  
					<Typography variant="body1">
						<Box ml={1}>
							<PersonIcon fontSize="small" style={{position: 'relative',top: '3px'}}/>{Util.number(this.state.pop)}명
						</Box>
					</Typography>
				</Grid>}>
			{this.content()}
		</ResponsiveDialog>
	
	}
}