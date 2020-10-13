import React, { Component } from 'react';
import Popover from 'react-bootstrap/Popover';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';


import { isMobile} from "react-device-detect";


export default class Link extends Component {
	render(){
		
		var trigger = "hover"
		const photo = this.props.photo;
		var overlay = <Tooltip id="button-tooltip" >
			{
	    	photo>0?
	 		 	<Image src={require(`../portrait/${photo}.jpg`)} style={{width: '30px', height: '40px'}} className="mr-1" alt="" ></Image>
	 		 :null
			}
			{this.props.extraText} 
			{this.props.extraText===undefined?this.props.button:null}
		</Tooltip>
		var onClick = 	this.props.onClick;
		var text = this.props.text;
		const button = this.props.button;
		const showButton = this.props.showButton===undefined?true:this.props.showButton
		
		if(isMobile){
			trigger = ['hover','focus']
			overlay =  <Popover id="popover-basic">
			    <Popover.Content>
			    	{
			    	photo>0? <Image src={require(`../portrait/${photo}.jpg`)} style={{width: '30px', height: '40px'}} className="mr-1" alt="" ></Image>
			 		 :null
					}
			    	{this.props.extraText!==''?
			    		<span className="pr-1">{this.props.extraText}</span> 
			    		:null
			    	}
			      {showButton? 
			    	<Button variant="link" size="sm"  onClick={this.props.onClick} style={{position:'relative',top:'-2px'}}>{button}</Button>
			    	:null
			      }
			      {
			    	  this.props.extra
			      }
			    </Popover.Content>
			  </Popover>	
			onClick = ()=>{}
		}
			
			
			
		return <OverlayTrigger
			placement="top"
		    overlay={ overlay}
			trigger={trigger}
		  >
			<Button variant="link" className={'link '+this.props.extraClass} onClick={onClick} >{text}</Button> 
		</OverlayTrigger>
	}
}