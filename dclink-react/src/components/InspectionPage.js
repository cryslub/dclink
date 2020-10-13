import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

import ProvincialPage from './ProvincialPage.js';

import InspectionSection from './InspectionSection.js';
import PersonIcon from './PersonIcon.js';
import Icon from './Icon.js';

import DataService from '../DataService.js';
import Util from '../Util.js';

import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';


export default class InspectionPage extends ProvincialPage {

	
	async getElectionItems(state){
		const result = await DataService.getElectionItem(this.props.currentElection.id)
		
		const stateMap = Util.hash(this.state.states,'id')
		result.forEach((item)=>{
			if(stateMap[item.state].items===undefined) stateMap[item.state].items=[];
			stateMap[item.state].items.push(item);
		})
		
		this.setState({stateMap:stateMap})
	}
	
	makeSections(items){
		var members = {};
		var overview = {};
		
		const issues = [];
		const scenes = [];
		const final = [];
		var scene = true;
		
		Object.keys(items).forEach(function(keyName, keyIndex) {
  			
  			const item = items[keyName];
  			if(item.type==='소속위원'){
  				members = item;
  			}else if(item.type==='오버뷰'){
  				overview = item;
  			}else if(item.type==='이슈'){
  				issues.push(item);
  			}else if(item.type==='장면' ){
  				scenes.push(item);
  			}else if(item.type==='피폭' ){
  				scenes.push(item);
  				scene = false;
  			}else if(item.type==='파이날'){
  				final.push(item);
  			}
		})
		
		return{
			members:members,
			overview:overview,
			issues:issues,
			scenes:scenes,
			final:final,
			scene:scene
		}
	}
	
	items(items){
		
		const section = this.makeSections(items)
		
		return <DataContext.Consumer >
		{data=>(
			<div className="inspection-tab">
				{section.members!==undefined?
				<div>
					<small><span className="text-muted"> {section.members.name}</span></small>
				</div>
				:null
				}
				<div className='mb-5'>
				{section.members.candidates!==undefined?
						section.members.candidates.map((member,i)=>{

						const text = (member.txt===''?'위원':member.txt)+' '+data.parties[member.party].name+' '+member.personName;
						return  <PersonIcon member={member} text={text} 
									onClick={()=>data.history(member.person)} button="인물이력"/>
					
					})
				:null
				}
				</div>
				<div className='mb-3'>
					<small><span className="text-muted"> {section.overview.name}</span></small>
					<a href={section.overview.link}  target="youtube"> <small> 듣기</small></a>
				</div>			
				<Row>
					<Col lg={6}>
						<div>
							<small className="text-muted">이슈 {section.issues.length}</small>
						</div>
						<InspectionSection items={section.issues} type='issue'/>
					</Col>
					<Col lg={6}>
						<div>
						{section.scene?
							<small className="text-muted">장면 {section.scenes.length}</small>
							:<small className="text-muted">주목할만한 시전과 피폭</small>
						}
						</div>

						<InspectionSection items={section.scenes} type='scene'/>
						
						{section.final.length>0?
							<InspectionSection items={section.final} type='final'/>
							:null
						}
							
					</Col>

				</Row>
			
	  		</div>
  		)}
  		</DataContext.Consumer>

	}
	
	minView(){
		const stateMap = this.state.stateMap;
		
		if(stateMap===undefined) return null;
		return <div className="m-3 mb-4">
		{
			Object.keys(stateMap).map((key,i)=>{
				const state = stateMap[key];
				
				const section = this.makeSections(state.items)
				
				return<>
					{i>0?<hr/>:null}
					<Row className="mb-2">
					
					<Col  sm={3} className="left">
						{state.name} 
						<small><a href={section.overview.link}  target="youtube">  듣기 </a></small>
					</Col>
					<Col>
					{
						state.items.map((item)=>{
							if(item.name==='' ||item.name==='소속위원' || item.type==='오버뷰') return null
							
							var glyphicon = 'glyphicon-book'
							var color = '#2780E3'
							if(item.type==='장면' || item.type==='피폭'){
								glyphicon = 'glyphicon-alert'
								color = '#FF0039'
							}else if(item.type==='파이날'){
								glyphicon = 'glyphicon-tower'								
								color = 'gold'
							}
							
							return <span className="mr-1">
								<Icon  text={item.name} glyphicon={glyphicon} color={color} onClick={()=>window.open(item.link, "youtube")} />
							</span>
					    		
						})
					}
					</Col>
				</Row>
				</>
			})
		}
		</div>
	}
	
	smallView(items){
		const stateMap = this.state.stateMap;
	
		
		if(stateMap===undefined) return null;
		return <Row className="m-3 mb-4 inspection-tab">
		{
			Object.keys(stateMap).map((key,i)=>{
				const state = stateMap[key];
				
				const section = this.makeSections(state.items)
				var count=0;
				return <Card   key={i}  className="mb-3 mr-2 col col-sm-1">
							
						<Card.Header className="bg-dark" style={{color:'white'}}>
							{state.name} 
							<small className="mr-1 pl-1"><a href={section.overview.link}  target="youtube" style={{color:'#eeeeee'}}>듣기 </a></small>
						</Card.Header>
						<Card.Text className="p-2 pb-3">
						{
							state.items.map((item,i)=>{
								if(item.name==='' ||item.name==='소속위원' || item.type==='오버뷰') return null
								
								var glyphicon = 'glyphicon-book'
								var color = '#2780E3'
								if(item.type==='장면' || item.type==='피폭'){
									glyphicon = 'glyphicon-alert'
									color = '#FF0039'
								}else if(item.type==='파이날'){
									glyphicon = 'glyphicon-tower'								
									color = 'gold'
								}
								count++
								return<div>
									
						    		<span className={'glyphicon '+glyphicon} style={{color:color}}></span>
						    			<div className="inspection-name" title={item.name}>
						    				{item.name}
						    			</div>
							    	<a  className="m-1" href={item.link} target="youtube"><small >듣기</small></a>
							    	{count===section.issues.length || (count===section.issues.length+section.scenes.length&&section.final.length>0)?<hr/>:null}
								 </div>
								    
							})						
						}
						</Card.Text>
			    		
				    </Card>
					
			})
		}
		</Row>
	}
	
	render() {
		
		
		return <MainContext.Consumer>
		{state=>(
			state.showResult==='min'?
					this.minView()
			:state.showResult==='small'?
				this.smallView()
				:<div className="inspection-tab">{this.layout()}</div>
		)}
	  	</MainContext.Consumer>
		
	}

}