import  { Component } from 'react';

import DataService from '../../DataService.js';

export default class PersonModal extends Component {

	async getInspection(person){
		const result = await DataService.getInspection(person);
		this.makeInspection(result);
	}
	
	makeInspection = function(inspections){
		
		const history = this.state.history;
	
    	inspections.forEach(function(item) {
    		if(history[item.person] === undefined){
    			history[item.person] = {
    					election:[],inspection:[],inspectionCount:{}};
    		}
    		
    		history[item.person].inspection.push(item);
    		if(history[item.person].inspectionCount[item.election] === undefined){
    			history[item.person].inspectionCount[item.election] =0;
    		}
    		var add = 1;
    		if(item.type==='이슈'){
    			add = 2;
    		}else if(item.type==='파이날'){
    			add = 4;
    		}
    		
    		if(item.txt==='MVP'){
    			add += 4;
    		}
    		
    		history[item.person].inspectionCount[item.election]+= add;
    	});
    	
    	this.setState({history:history})
    	

	}
	
}