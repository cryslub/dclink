import React, { Component } from 'react';
import Row from 'react-bootstrap/Row';

import Link from './Link.js';

import PersonIcon from './PersonIcon.js';
import Doughnut from './Doughnut.js';

import {DataContext} from '../DataContext.js';
import {MainContext} from '../MainContext.js';

import Util from '../Util.js';



export default class ZoneItem extends Component {
	
	render() {
		const item = this.props.item;
		const title = item.title===null?'':item.title;
		
	    return  <DataContext.Consumer>
		{data=>(
			 <MainContext.Consumer>
			{state=>(
				<div className={state.showResult==='full'?'jumbotron mb-1':'mb-1'} >
					<h6 className="mb-0">
						<Link text={item.name + title}  button="듣기"  onClick={()=>window.open(item.link, "youtube")} extraClass="election-name"/>
						<small>
						{
							item.candidates.map((candidate,i)=>{
								return <PersonIcon member={candidate} text={(candidate.party===0?'':data.parties[candidate.party].name)+' '+candidate.personName}
										onClick={()=>Util.link(candidate.link)} showButton={candidate.link!==''} button="듣기"/>
							})
						}
						</small>
					</h6>
					{state.showResult==='full'?
						<Row className="pl-4">
							{item.candidates.length>0?
								<div className="mr-2">
									<small className="text-muted">후보득표</small><br/>
									<Doughnut results={item.candidates} style={{width:'40px',height:'40px',paddingLeft:'5px'}} 
										countKey="rate" idKey="person" context={data} unit="표"/>
								</div>
							:null
							}
							{item.councils.length>0?
								<div className="mr-2">
									<small className="text-muted">의회구성</small><br/>
									<Doughnut results={item.councils} style={{width:'40px',height:'40px',paddingLeft:'5px'}} 
										countKey="count" idKey="party" context={data} unit="명" />
								
								</div>
							:null
							}
							{item.rates.length>0?
								<div>
									<small className="text-muted">비례득표</small><br/>
									<Doughnut results={item.rates} style={{width:'40px',height:'40px',paddingLeft:'5px'}} 
										countKey="count" idKey="party" context={data} unit="표" />
								
								</div>
							:null
							}
						</Row>
					:null
					}
				</div>
			)}
			</MainContext.Consumer>
		)}
	     </DataContext.Consumer>
	}
}