import React, { Component } from 'react';
import ListGroup from 'react-bootstrap/ListGroup';

import {DataContext} from '../DataContext.js';

import PersonIcon from './PersonIcon.js';

export default class InspectionSection extends Component {

	render() {
		var color,icon;
		if(this.props.type ==='issue'){
			color = '#2780E3';
			icon = 'glyphicon-book';
		}else if(this.props.type ==='scene'){
			color = '#FF0039';
			icon = 'glyphicon-alert';

		}else if(this.props.type ==='final'){
			color = 'gold';
			icon = 'glyphicon-tower';

		}
		
		

	    return <DataContext.Consumer >
	    {data=>(
		    <ListGroup style={{ borderTop: '5px solid '+color}} className="mb-3">
				<ListGroup.Item className='pt-4 pb-4'>
				{
					this.props.items.map((item,i)=>{
						return <div key={i}>
								{
									i>0?<hr/>:null
								}
								<small className='mr-2'> 
									<span className={'glyphicon '+icon} style={{color: color}}></span>
								</small>
								<span  >{item.name}</span>
								<a href={item.link} target="youtube" className='mr-2'> <small> 듣기</small></a>
								
								{
									item.candidates.map((member,i)=>{
										return <PersonIcon member={member} text={data.parties[member.party].name+' '+member.personName} 
												onClick={()=>data.history(member.person)} button="인물이력"/>
									})
								}
							</div>
					})
				}
				</ListGroup.Item>
			</ListGroup> 
		)}
		</DataContext.Consumer >
	  
	}
}