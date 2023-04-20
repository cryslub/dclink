import React  from 'react';


import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';

import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';


import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import BookmarkIcon from '@material-ui/icons/BookmarkBorderOutlined';
import BookmarksIcon from '@material-ui/icons/BookmarksOutlined';
import DataService from '../../DataService.js';

import Person from './Person.js';
import ResponsiveDialog from './ResponsiveDialog.js';

import PersonBase from './PersonBase.js';
import PersonInfo from '../PersonInfo.js';


class InfoModal extends PersonBase {

	constructor(){
		super();
		
		this.state = {
				name:'',
				history:{},
				candidate:{}
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
	
	setCandidate(candidate){
		this.setState({candidate})
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
	
	
	async getHistory(person){
		
		
		
		const result = await DataService.getHistory(person);
		const history = this.makeHistory(result);
			
			
		this.setState({name:result[0].personName})
			
		this.setState({history:history});
		
	}
	
	async getInspection(person){
		const result = await DataService.getInspection(person);
		this.makeInspection(result);
	}
	
	async history(person){
		
		
		await this.getHistory(person);
		await this.getInspection(person);	
		
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
			title={<Typography variant="h6">{ this.state.candidate.personName}</Typography>}>
				<Box p={1} >
					<PersonInfo candidate={this.state.candidate}/>
				</Box>
				<Box p={1} mb={2}>
					<Box component="span" style={{display:'flex',alignItems:'center'}}>
						<BookmarksIcon size="small" style={{color:'rgba(0, 0, 0, 0.54)',paddingRight:2,fontSize:20}}/> <Typography variant="subtitle1">공약</Typography>
					</Box>
					{
						this.state.candidate.promises?.map(promise=>{
							return <Accordion>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
								>
								<Box component="span" style={{display:'flex'}}>
									<BookmarkIcon size="small" style={{color:'rgba(0, 0, 0, 0.54)',paddingRight:2,fontSize:20}}/>
									<Typography variant="body2">{promise.title}</Typography>
								</Box>
								</AccordionSummary>
								<AccordionDetails>
								<Typography   variant="caption" style={{whiteSpace: 'pre-line'}}>
									{promise.content}								
								</Typography>
								</AccordionDetails>
							</Accordion>
						})
					}
				</Box>

				
		</ResponsiveDialog>
	      	
	}
}


export default InfoModal;