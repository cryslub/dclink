import React from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Item from './Item.js';
import Party from './Party.js';
import PersonName from './PersonName.js';
import Icon from './Icon.js';
import Link from './Link.js';


import {MainContext} from '../MainContext.js';
import {DataContext} from '../DataContext.js';


export default class PresidentialItem extends Item {
	
	title(data){
		return <MainContext.Consumer>
		{state=>(
			<>{
			data.type === '당선' && state.showResult!=='min'?
				<small className="ml-1">
					<span className="glyphicon glyphicon-star" style={{color: 'gold'}}></span>
				</small>
			:null
			}
			<span className="m-1">
				<PersonName candidate={data}/>
			  	{data.party!==0?this.party(data.party):null}
		  	</span>
		  	</>
		)}
	    </MainContext.Consumer>

	}
	
	party(party){
		return <span  className="ml-1"><Party party={party}/> </span>
	}
	
	body(candidate){
		if(candidate.count===0) return null;
		return 	 <MainContext.Consumer>
		{state=>(
			state.showResult==='min'?
				candidate.subs.map((sub,i)=>{
					if(sub.link==='') return null
					return <Icon  text={<>{candidate.txt + ' > '}<small>{sub.txt}</small></>}   glyphicon="glyphicon-file"  party={candidate.party} onClick={()=>window.open(sub.link, "youtube")}/>
				})
			:state.showResult==='full'?
				<div className="card-body">
					<Row className="m-0">
					{	
						candidate.subs.map((sub,i)=>{
							return <Col style={{whiteSpace:'nowrap'}} sm={1} md="auto" className='pr-1 pl-0' key={i}>
							{sub.link===''? sub.txt
							: <small><Link text={sub.txt}  
			    			    	button="듣기"  onClick={()=>window.open(sub.link, "youtube")}
			    			   />
								</small>
							}
							</Col>
						})
					
					}
					</Row>
				</div>
				:null
			
		)}
	    </MainContext.Consumer>
	}
	
	result(data){
			return <div>
				<small className="m-1">
					<strong>{data.type}</strong> 
					{data.code>0?this.aquired(data):null}
				</small>
			</div>
		
	}	

	
	candidate(candidate,i){
		return 	 <MainContext.Consumer>
		{state=>(
			<DataContext.Consumer key={i}>
		    {data=>(
		    		state.showResult==='min'?
		    			<>
		    				 <Icon  text={candidate.txt}   glyphicon="glyphicon-book"  party={candidate.party} onClick={()=>window.open(candidate.link, "youtube")}/>
		    				{this.body(candidate)}
		    			</>
		    		:
				    <div className="card" style={{maxWidth: '21rem','borderColor':data.parties[candidate.party].color}}>
				    	<div className={'card-header'}>	
				    		<span className="m-0">{candidate.txt}</span>
					    	<a  className="m-1" href={candidate.link} target="youtube"><small >듣기</small></a>
				    	</div>
				    	{this.body(candidate)}
				    		
				    </div>
				    
			    )}
			    </DataContext.Consumer>
		  )}
	    </MainContext.Consumer>
	}
	
}