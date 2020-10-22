
import BaseComponent from '../BaseComponent.js';


import DataService from '../../DataService.js';


export default class Page extends BaseComponent {
	
	constructor(){
		super();
		this.unmounted = true;
		this.state = {
				states:[],
				currentState:{name:""},
				items:{},
				candidateMap:{},
				statics:{}
		}
		
	}
	
	init(){
		
	}
	
	async load(election,state){
	
		this.setState({
			items:{},
			candidateMap:{},
			statics:{}
		})
		if(state.id!==undefined){
			await this.getState(election,state)					
			this.init();
		}
		
		console.log(election.id+","+state.id)
	}
	
	async getState(election,state){
		const states = await DataService.getState(election.id);
		this.setState({states:states})
		
		await this.getElectionItems();
		
		this.selectState(state)
	}
	
	async getElectionItems(){
		
	}
	
	async extra(state){
		
	}
	
	selectState = async (state) => {
		
		this.setState({items:{}})
		this.setState({candidateMap:{}})
		
		const data = this.props.data;
		
		data.setLoading(true);
		
		
		await this.extra(state);
		
		
		this.setState({currentState:state})
		
		  

		
		const result = await DataService.getItem(state.id);
		
		const items = {};
		var total = 0;
		result.forEach((item)=>{
			item.candidates = [];
			item.councils = [];
    		item.rates = [];
    		item.metros = [];
    		item.mrates = [];
    		
			items[item.id] = item;

	    	if(this.props.currentElection.type === 'presidential' || this.state.currentState.name === '비례'){

				if(item.code !==''){
	    			item.code = parseInt(item.code);
	    			total += item.code;
				}
	    	}
			
		});
		
    	if(this.props.currentElection.type === 'presidential' || this.state.currentState.name === '비례'){
    		
    		Object.keys(items).forEach(function(keyName, keyIndex) {
    			const item = items[keyName];
    			item.percent = item.code * 100 / total;
    			
    		});
    		
    	}

    	
	//	this.setState({items:items})
		
    	await this.getCandidate(items,state);
		
		
		data.setLoading(false);
      

	}
	
	async getCandidate(items,state){
		const result = await DataService.getCandidate(state.id);
//		const items = this.state.items;
		const candidateMap = {};
		result.forEach((candidate)=>{
			if(items[candidate.item] !== undefined)
				items[candidate.item].candidates.push(candidate)
			candidate.subs = [];
			candidateMap[candidate.id] = candidate;
		});
		
		Object.keys(items).forEach(function(keyName, keyIndex) {
    		var total = 0;
    		const item = items[keyName];
    		item.candidates.forEach(function(candidate){
    			total += candidate.rate;
    		});
    		item.candidates.forEach(function(candidate){
    			candidate.percent = candidate.rate*100/total;
    		});
    	});
		
		
		await this.getSub(state,candidateMap);
		await this.getCouncil(state,items);

		this.setState({items:items})
		this.setState({candidateMap:candidateMap})

	
	}

	async getSub(state,candidateMap){
		const result = await DataService.getSub(state.id);
		
//		const candidateMap = this.state.candidateMap;
		result.forEach((sub)=>{
			candidateMap[sub.candidate].subs.push(sub);			
		})
		
///		this.setState({candidateMap:candidateMap})		
		
	}
	
	async getCouncil(state,items){
		const result = await DataService.getCouncil(state.id);

		
		result.forEach(function(council) {
			if(items[council.item]!==undefined){
	    		if(council.type === 'rate'){
		    		items[council.item].rates.push(council);    	    			    	  
	    		}else if(council.type === 'mrate'){
		    		items[council.item].mrates.push(council);    	    			    	  
	    		}else if(council.type === 'metro'){
		    		items[council.item].metros.push(council);    	    			    	      	    			
	    		}else{
		    		items[council.item].councils.push(council);    	    			    	    			
	    		}
			}
    	});
		
//		this.setState({items:items})
	}
	
	
	async componentDidMount(){
		this.unmounted = false;
		
		//await this.getState(this.props.currentElection);
		
		
	}
	
	componentWillUnmount (){
		this.unmounted = true;
	}
	
	items(items){
		return null;

	}
	
	render() {
		
		return null;
	}
}