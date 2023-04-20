import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';


import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Popover from '@material-ui/core/Popover';

import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import ReactEcharts from 'echarts-for-react';

import {
	  BrowserRouter as Router
} from "react-router-dom";

import ResponsiveDrawer from './components/ResponsiveDrawer.js';



import Middle from './components/Middle.js';
import PersonModal from './components/dialog/PersonModal.js';

import InfoModal from './components/dialog/InfoModal.js';
import YoutubeModal from './components/dialog/YoutubeModal.js';

import ZoneModal from './components/dialog/ZoneModal.js';

import SearchDialog from './components/dialog/SearchDialog.js';

import PersonInfo from './components/PersonInfo.js';




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

const MainPopover = (props)=>{
	const type = props.type;

	return  <MainContext.Consumer>
	{state=>(
		<DataContext.Consumer>
		{data=>(
		<Popover
			id="mouse-over-popover"
			style={{
				pointerEvents: 'none',
			}}
			open={state.popover[type]}
			anchorEl={state.anchor[type]}
			anchorOrigin={{
				vertical: 'top',
				horizontal: 'right',
			}}
			transformOrigin={{
				vertical: 'bottom',
				horizontal: 'left',
			}}
			onClose={()=>data.closePopover(type)}
			disableRestoreFocus
		>
			{props.children}
		</Popover>
		)}
		</DataContext.Consumer>
	)}
	</MainContext.Consumer>
}


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
					youtube:false,
					info:false
				},
				popover:{
					info:false,
					map:false
				},
				anchor:{
					info:null,
					map:null
				},
				showResult:'full',
				loading:true,
				anchorEl:null,
				history:{},
				searchName:'',
				openElections:false,
				electionMap:{},
				stateMap:{},
				popOverData:{}
		}
		
		this.middle = React.createRef();
		this.person = React.createRef();
		this.info = React.createRef();
		this.zone = React.createRef();
		this.youtube = React.createRef();

		this.data = {
				history:this.history,
				showInfo:this.showInfo,
				zoneHistory:this.zoneHistory,
				setLoading:this.setLoading,
				play:this.play,
				openPopover:this.openPopover,
				closePopover:this.closePopover,
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

	
	showInfo =  (candidate)=>{

		this.info.current.setCandidate(candidate);
				
		this.setState({modal:{info:true}})
	}

	play = (link)=>{
		if(link ==='') return

		if(link!=='open')
			this.youtube.current.play(link)
		this.setState({modal:{youtube:true}})

	}

	contents = (items) =>{

	}

	zoneHistory = (zone)=>{
		this.setState({modal:{zone:true}})
		this.zone.current.history(zone)

	}

	openPopover = (type,event,data)=>{
		this.setState({anchor:{[type]:event.currentTarget},popoverData:data,popover:{[type]:true}})
	}

	closePopover = (type)=>{
		this.setState({anchor:{[type]:null},popover:{[type]:false}})

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
		
		if(this.state.currentState === state){
			this.setLoading(false);
		}
		this.setState({currentState:state})
		this.data.currentState = state

	}
	
	
	handlePopoverOpen = (event) => {
		this.setState({anchorEl:event.currentTarget})
	};

	handlePopoverClose = () => {
		this.setState({anchorEl:null})

	};
	
	
	zoomedMapChart(data){

		if(data===undefined) return null;


		const context =  this.data;
		const code = data.code;

		if(code===undefined) return null;

		const geoJson = data.geoJson;
		var parent = code.substring(0,2);
		  
    	const parentJson = require(`./json/${parent}.json`) 
		 
	        
        var json = {features: [],type:"FeatureCollection"};
        json.features[0] = parentJson.features[0];
        json.features[0].properties.name = 'parent';
        
        
        var option = {
			    visualMap: {
			        min: -100000,
			        max: 600000,
			        show:false,
			        calculable: true,
			        inRange: {
			            color: ['white','#50a3ba', '#eac736', '#d94e5d']
			        }
			    },
        		 series: [
	                {
	                    type: 'map',
	                    mapType: 'zoomed'+code, 
	                    aspectScale:1,
	                    cursor:'default',
	                    label: {
	                        normal: {
	                            show: false
	                        },
	                        emphasis: {
	                            show: false
	                        }
	                    },
	                    data:[
	                    	{name:'parent',
	                    	value:-600000,
	                    	itemStyle:{
	                    			borderColor:'#f0f0f0',
	                    			normal:{borderWidth:1,color:'#ffffff'},
	                    			emphasis:{borderWidth:1,areaColor:'rgba(128, 128, 128, 0)'}
	                    	},
	                    	emphasis:{
	                    		itemStyle:{normal:{color:'#000000'}}}}
	                    ],
	                    nameMap: {'parent':'parent'}
	                }
	            ]
	        };
        
	        var index = 1;
	        var arr = code.split(",");
	        
	        arr.forEach(function(item){
		        json.features[index] = geoJson.features[index-1];
		        json.features[index].properties.name = 'child'+index;

		        var c = item;
		        if(item.length>5){
		        	c = item.substring(0,5);
		        }			        
		        var zone = context.zones[c];
		        if(zone===undefined) zone = context.zones[item.substring(0,2)]
		        
		        option.series[0].data.push({
		        	name:'child'+index,
		        	value:zone.pop,
		        	itemStyle:{
			        	normal:{
			        		borderWidth:0
						},
	                    emphasis:{
	                    	areaColor:'#f04541'
                        }
		        	}
		        });
		        option.series[0].nameMap['child'+index] = 'child'+index;
		        
		        index++;
	        });
	        
	        const echarts = require('echarts');
	        echarts.registerMap('zoomed'+code, json);
	        
	        return <ReactEcharts option={option} style={{width: '300px', height: '280px'}}/>
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
			        <InfoModal open={this.state.modal.info} close={()=>this.closeModal('info')} ref={this.info}/>

					
			        <YoutubeModal open={this.state.modal.youtube} close={()=>this.closeModal('youtube')} ref={this.youtube}/>

			        <DataContext.Consumer>
			    	{data=>(
			    		<ZoneModal open={this.state.modal.zone} close={()=>this.closeModal('zone')} ref={this.zone}  data={data}/>
			    	)}
			    	</DataContext.Consumer>
			        
					<MainPopover type="info">
						<Box p={2}>
							<PersonInfo candidate={this.state.popoverData}/>
						</Box>
					</MainPopover>

					<MainPopover type="map">
						<Typography>{this.zoomedMapChart(this.state.popoverData)}</Typography>
					</MainPopover>


			       <Backdrop className={classes.backdrop} open={this.state.modal.loading} >
				        <CircularProgress color="inherit" />
				      </Backdrop>
		    	</MainContext.Provider>
			</DataContext.Provider>
		</Router>
	}
}

export default withStyles(useStyles)(Main);