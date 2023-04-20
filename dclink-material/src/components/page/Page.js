
import BaseComponent from '../BaseComponent.js';


import DataService from '../../DataService.js';
import Util from '../../Util.js';

const candidateMap = {};

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
		
	//	console.log(election.id+","+state.id)
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
			item.councils = {};
    		item.rates = [];
    		item.metros = [];
    		item.mrates = [];
			item.metroWards = {}
			item.basicWards = {}
			item.rateWards = {}
			item.eduWards = {}
    		
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
		if(this.props.currentElection.type === 'provincial' || this.props.currentElection.type === 'by'){
			await this.getCandidateInfo(items,state);
			await this.getPromise(state)
		}
		if(this.props.currentElection.type === 'presidential' ){			
			await this.makeCandidate(items,state,"1","metroWards")
		}
		
		data.setLoading(false);
		

	}
	
	async getCandidate(items,state){

		const data = this.props.data;

		const result = await DataService.getCandidate(state.id);
//		const items = this.state.items;
	
		result.forEach((candidate)=>{
			candidate.promises = []
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
//		await this.getCouncil(state,items);

		this.setState({items:items})
		this.setState({candidateMap:candidateMap})

		data.items = items
	
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
	
	
	checkWards(wards,name){
		if(wards[name] === undefined){
			wards[name] = []
		}
	}

	async getCandidateInfo(items,state){

		await this.makeCandidate(items,state,"5","metroWards")
		await this.makeCandidate(items,state,"6","basicWards")
		await this.makeCandidate(items,state,"8","rateWards")
		await this.makeCandidate(items,state,"9","rateWards")
		await this.makeCandidate(items,state,"10","eduWards")

	}

	async getPromise(state){
		const result = await DataService.getPromise(state.id);
		result.forEach(promise=>{
			const candidate = candidateMap[promise.candidate]
			if(candidate){
				candidate.promises.push(promise);
			}
		})
		
	}

	async makeCandidate(items,state,type,wardsKey){

		const self = this;

		let metroItem 
		Object.keys(items).forEach(key=>{
			const item = items[key]
			if(item.type==='광역') metroItem = item
		})

		const result = await DataService.getCandidateInfo(type,state.id);
		result.forEach(function(candidate) {
			let item = items[candidate.item]
			if(item===undefined) item=metroItem;
			if(item===undefined) return;
			const wards = item[wardsKey]
			const ward = Util.getWardName(candidate,item.name)
			self.checkWards(wards,ward);
			wards[ward].push(candidate);
			//items[candidate.item].metroCandidates.push(candidate)

			if(type==='5' || type==='8' ){
				self.pushCouncil(metroItem,candidate)
			}else if(type!=='10' ){
				self.pushCouncil(item,candidate)
			}
		})

		if(type==='8' || type==='9' ){
			let list = await DataService.getResult(type,state.id);
			list.forEach(function(result) {
				let item = items[result.item]
				if(item===undefined) item=metroItem;
				if(item===undefined) return;
				item.rates.push(result);
			})	
		}
	}

	pushCouncil(item,candidate){
		if(candidate.result==='당선'){
			if(item.councils[candidate.party]==undefined){
				item.councils[candidate.party] = 0
			}
			item.councils[candidate.party]++;
		}
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