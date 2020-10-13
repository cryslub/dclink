import React, { Component } from 'react';


import Header from './components/Header.js';
import Middle from './components/Middle.js';
import PersonModal from './components/PersonModal.js';
import ZoneModal from './components/ZoneModal.js';
import LoadingModal from './components/LoadingModal.js';


import DataService from './DataService.js';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';


import {DataContext} from './DataContext.js';
import {MainContext} from './MainContext.js';

import Util from './Util.js';

export default class Main extends Component {
	
	constructor(){
		super();
		
		this.state = {
				elections:[],
				currentElection:{name:""},
				modal:{
					person:false,
					zone:false,
					loading:false
				},
				showResult:'full',
				loading:true

		}
		
		this.middle = React.createRef();
		this.person = React.createRef();
		this.zone = React.createRef();

		this.data = {
				history:this.history,
				zoneHistory:this.zoneHistory,
				setLoading:this.setLoading
		};
	}
	
	
	setLoading = (loading) =>{
		this.setState({modal:{loading:loading}})
	}
	
	selectElection = async  (election) =>{

		this.setLoading(true);

		
		this.setState({currentElection:election})
		

	}
	
	
	async getPartySub(){
		
		const parties = this.data.parties;
		const result  = await DataService.getPartySub();
		result.forEach(function(sub) {
			parties[sub.party].subs[sub.election] = sub;
        });

		this.data.parties = parties;
	}

	async getParty(){
		const result  = await DataService.getParty();
		result.forEach((party)=>{
			party.subs = {};
		})
		this.data.parties = Util.hash(result,'id');
		this.data.parties[0] = {color:'silver',subs :{}}
		
		this.getPartySub();
	}

	async getZone(){
		this.data.zones = {};
		const result  = await DataService.getZone();
		this.data.zones = Util.hash(result,'code');
		
	}

	
	async componentDidMount() {
		
		this.getParty();
		this.getZone();
		
		const elections  = await DataService.getElection();
		this.setState({elections:elections})
		
		this.selectElection(elections[0]);

		

	}
	
	

	
	search = (name) =>{
		
		this.setState({modal:{person:true}})
		this.person.current.search(name)
	}
	
	history = async (person)=>{
		await this.person.current.history(person)

		this.setState({modal:{person:true}})
	}

	zoneHistory = (zone)=>{
		this.setState({modal:{zone:true}})
		this.zone.current.history(zone)

	}

	
	closeModal = (type) => {
		this.setState({modal:{[type]:false}})
	}
	
	showResult = (result) =>{
		this.setState({showResult:result})
		
	}
	
	render() {
	    return  <DataContext.Provider value={this.data}>
	    	<MainContext.Provider value={this.state}>
		    	<div  className="wrapper">
			    	<Header 
			    		elections={this.state.elections} 
			    		currentElection={this.state.currentElection} 
			    		selectElection={this.selectElection} 
			    		search={this.search}
			    		showResult={this.showResult}
			    	/>
			    	<Middle  currentElection={this.state.currentElection} ref={this.middle} />	  
			    	<LoadingModal show={this.state.modal.loading} />
			    	<PersonModal show={this.state.modal.person} close={this.closeModal} ref={this.person}/>
			    	<DataContext.Consumer>
			    	{data=>(
			    			<ZoneModal show={this.state.modal.zone} close={this.closeModal} ref={this.zone} data={data}/>
			    	)}
			    	</DataContext.Consumer>
			    	
			    	</div>
		    	<Navbar className="footer" bg="dark" variant="dark" sticky="bottom">
		
					<Nav>
						<Nav.Item>
							<Nav.Link style={{cursor:'default'}}> <small>본 페이지는 개인이 심심해서 만든 페이지이며 xsfm과는 관련이 없습니다.</small></Nav.Link>
						</Nav.Item>
					</Nav>
				</Navbar>
	    	
	    	</MainContext.Provider>
		</DataContext.Provider>
	}
}