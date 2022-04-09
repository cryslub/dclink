import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';



import {
	  BrowserRouter as Router,
	  Switch,
	  Route
} from "react-router-dom";

import ResponsiveDrawer from './components/ResponsiveDrawer.js';



import Middle from './components/Middle.js';
import PersonModal from './components/dialog/PersonModal.js';
import YoutubeModal from './components/dialog/YoutubeModal.js';

import ZoneModal from './components/dialog/ZoneModal.js';

import SearchDialog from './components/dialog/SearchDialog.js';





import {DataContext} from './DataContext.js';
import {MainContext} from './MainContext.js';

import Util from './Util.js';


import DataService from './DataService.js';


const useStyles = (theme) => ({

	  backdrop: {
		    zIndex: theme.zIndex.drawer + 1,
		    color: '#fff',
		  },
	})


class Main extends Component {
	
	constructor(){
		super();
		
		this.state = {
				elections:[],
				currentElection:{name:""},
				currentState:{},
				modal:{
					person:false,
					zone:false,
					loading:false,
					search:false,
					youtube:false
				},
				showResult:'full',
				loading:true,
				open:false,
				history:{},
				searchName:'',
				openElections:false,
				electionMap:{},
				stateMap:{}

		}
		
		this.middle = React.createRef();
		this.person = React.createRef();
		this.zone = React.createRef();
		this.youtube = React.createRef();

		this.data = {
				history:this.history,
				zoneHistory:this.zoneHistory,
				setLoading:this.setLoading,
				play:this.play,
				items:{},
				currentElection:{},
				currentState:{}
		};
	}
	
	
	setLoading = (loading) =>{
		this.setState({modal:{loading:loading}})
	}
	
	selectElection = async  (election) =>{

		this.setLoading(true);

		
		this.setState({currentElection:election})
		this.setState({currentState:election.states[0]})
		
		this.toggleElections(false);

		this.data.currentElection = election
		this.data.currentState = election.states[0]
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
		
		const electionMap = Util.hash(elections,'id')
		const stateMap = {};
		const states  = await DataService.getAllState();
		states.forEach((state)=>{
			if(electionMap[state.election].states ===  undefined){
				electionMap[state.election].states=[];
			}
			electionMap[state.election].states.push(state);
			
			stateMap[state.id] = state;
		})
		
		
		this.setState({elections:elections, electionMap:electionMap,stateMap:stateMap})
		
		
		
		this.selectElection(elections[0]);

		

	}
	
	

	
	search = (name) =>{
		
		this.setState({modal:{search:true}})
//		this.person.current.search(name)
	}
	
	history = async (person)=>{
		
		this.setLoading(true)
		
		await this.person.current.history(person)

		this.setLoading(false)

				
		this.setState({modal:{person:true}})
	}

	play = (link)=>{
		if(link =='') return

		if(link!='open')
			this.youtube.current.play(link)
		this.setState({modal:{youtube:true}})

	}

	contents = (items) =>{

	}

	zoneHistory = (zone)=>{
		this.setState({modal:{zone:true}})
		this.zone.current.history(zone)

	}

	
	closeModal = (type) => {
		this.setState({modal:{[type]:false}})
	}
	
	showResult = (e,result) =>{
		this.setState({showResult:result})
		
	}
	
	toggleDrawer = (open) => {
	  

	    this.setState({ open: open });
	  }
	toggleElections = (open) => {
		  

	    this.setState({ openElections: open });
	  }
	
	
	selectState = (election,state) =>{
		this.selectElection(election)
		
		if(this.state.currentState == state){
			this.setLoading(false);
		}
		this.setState({currentState:state})
		this.data.currentState = state

	}
	
	
	render() {
		 const { classes } = this.props;

		
	    return  <Router>
	    	<DataContext.Provider value={this.data}>
	    		<MainContext.Provider value={this.state}>
				    <ResponsiveDrawer elections={this.state.elections} currentElection={this.state.currentElection}
				    	currentState={this.state.currentState}
					    showResult={this.state.showResult} search={this.search} selectState={this.selectState}
				    	changeShowResult={this.showResult}
				    >
				 
				   
			        	<Middle  currentElection={this.state.currentElection} currentState={this.state.currentState} ref={this.middle} />	  		
					
				        
			        </ResponsiveDrawer>

			        
			        <SearchDialog open={this.state.modal.search} close={()=>this.closeModal('search')}/>
			        <PersonModal open={this.state.modal.person} close={()=>this.closeModal('person')} ref={this.person}/>
			        <YoutubeModal open={this.state.modal.youtube} close={()=>this.closeModal('youtube')} ref={this.youtube}/>

			        <DataContext.Consumer>
			    	{data=>(
			    		<ZoneModal open={this.state.modal.zone} close={()=>this.closeModal('zone')} ref={this.zone}  data={data}/>
			    	)}
			    	</DataContext.Consumer>
			        
			        
			       <Backdrop className={classes.backdrop} open={this.state.modal.loading} >
				        <CircularProgress color="inherit" />
				      </Backdrop>
		    	</MainContext.Provider>
			</DataContext.Provider>
		</Router>
	}
}

export default withStyles(useStyles)(Main);