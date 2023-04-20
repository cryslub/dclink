import React  from 'react';


import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';


import DataService from '../../DataService.js';

import Person from './Person.js';
import ResponsiveDialog from './ResponsiveDialog.js';

import PersonBase from './PersonBase.js';


class PersonModal extends PersonBase {

	constructor(){
		super();
		
		this.state = {
				name:'',
				history:{}
		}
		
	}
	

	makeHistory (arr){

		const history = {};
		
    	arr.forEach(function(item) {
    		if(history[item.person] === undefined){
    			history[item.person] = {
    					candidates:[],inspection:[],inspectionCount:{}};
    		}
    		history[item.person].candidates.push(item);
    	});
    	
    	
    	return history;
	}
	
	
	
	async search(name){
	
		const self = this;
		this.setState({name:name})
		
		const result = await DataService.search(name);
		
		const history = this.makeHistory(result);
			
		this.setState({history:history});
		
		Object.keys(history).forEach(function(person){
			self.getInspection(person)		
		});
			
		
	}
	
	
	async getHistory(candidate){
		
		let result = []
		if(candidate.person){
		
			result = await DataService.getHistory(candidate.person);
		}else{
			result = await DataService.getInfoHistory(candidate.id );
		}
		const history = this.makeHistory(result);
			
			
		this.setState({name:result[0].personName})
			
		this.setState({history:history});
		
	}
	
	async getInspection(person){
		const result = await DataService.getInspection(person);
		this.makeInspection(result);
	}
	
	async history(candidate){
		
		
		await this.getHistory(candidate);
		if(candidate.person){
			await this.getInspection(candidate.person);	
		}
		
	}

	content(history){
		if(history === undefined) return null;
		
		return <>
		{		        	
	   	 	Object.keys(this.state.history).map((id,index)=>{
	   	 		const person = this.state.history[id];
	   	 		return <Box mb={3}>
	   	 			{index>0?<><Divider/><Box mt={3}/></>:null}		       	 		
	   	 			<Person person={person} id={id}  key={index}/>
	   	 		</Box>
	   	 	})
	    
	     }
	        
		</>
	}
	
	render() {
		const history = this.state.history;
		
		return  <ResponsiveDialog 
			open={this.props.open}
			close={this.props.close}
			title={<Typography variant="h6">{ this.state.name}</Typography>}>
				{this.content(history)}
		</ResponsiveDialog>
	      	
	}
}


export default PersonModal;