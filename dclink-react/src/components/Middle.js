import React, { Component } from 'react';
import ProvincialPage from './ProvincialPage.js';
import ByPage from './ByPage.js';
import InspectionPage from './InspectionPage.js';
import PresidentialPage from './PresidentialPage.js';


import {DataContext} from '../DataContext.js';

export default class Middle extends Component {
	constructor(){
		super();
		
		this.page = React.createRef();
		
	}


	componentDidUpdate(){
		if(this.page.current!==null){
			if(this.loadedElection !==this.props.currentElection){
				this.loadedElection = this.props.currentElection
				this.page.current.load(this.props.currentElection);
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