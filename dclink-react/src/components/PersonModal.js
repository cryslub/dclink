import React, { Component } from 'react';
import Modal from 'react-bootstrap/Modal';


import DataService from '../DataService.js';

import Person from './Person.js';


export default class PersonModal extends Component {

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

	render() {
		const history = this.state.history;
		return <Modal show={this.props.show} onHide={()=>this.props.close('person')}>
		        <Modal.Header closeButton className="pl-4 pt-4">
		          <Modal.Title><h5>{this.state.name}</h5></Modal.Title>
		        </Modal.Header>
		        <Modal.Body className="pl-2">
		        {		        	
		       	 	Object.keys(history).map((id,index)=>{
		       	 		const person = history[id];
		       	 		return <>
		       	 			{index>0?<hr/>:null}		       	 		
		       	 			<Person person={person} id={id}  key={index}/>
		       	 		</>
		       	 	})
		        
		        }
		        {
			        Object.keys(history).length > 1?
			        <div className="mchamp">
						<br/>
						<small>
							<p className="text-muted">
								검색된 인물 : <strong>{Object.keys(history).length}</strong>명
							</p>
						</small>
					</div>
					:null	
				}						
		        </Modal.Body>

	      	</Modal>
	      	
	}
}