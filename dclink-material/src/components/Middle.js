import React, { Component } from 'react';



import ProvincialPage from './page/ProvincialPage.js';
import ByPage from './page/ByPage.js';
import InspectionPage from './page/InspectionPage.js';
import PresidentialPage from './page/PresidentialPage.js';


import {DataContext} from '../DataContext.js';

export default class Middle extends Component {
	constructor(){
		super();
		
		this.page = React.createRef();
		
	}


	componentDidUpdate(){
		if(this.page.current!==null){
			if(this.loadedElection !==this.props.currentElection || this.loadedState !==this.props.currentState){
				this.loadedElection = this.props.currentElection
				this.loadedState = this.props.currentState
				this.page.current.load(this.props.currentElection,this.props.currentState);
			}
		}
		console.log('update');
	}
	
	
	render() {
	    return <DataContext.Consumer>
    	{data=>(
    		<>
	    	{
	    		this.props.currentElection.type ==='provincial'?  <ProvincialPage  currentElection={this.props.currentElection} ref={this.page} data={data} leftSize={104}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='by'?  <ByPage  currentElection={this.props.currentElection} ref={this.page}  data={data}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='inspection'?  <InspectionPage  currentElection={this.props.currentElection} ref={this.page}  data={data} leftSize={300}/>: null
	    	}
	    	{
	    		this.props.currentElection.type ==='presidential'?  <PresidentialPage  currentElection={this.props.currentElection} ref={this.page}  data={data}/>: null
	    	}
			<div className="push"></div>
			</>	
    	)}
    	</DataContext.Consumer>
	}
}