import React, { Component } from 'react';
import ReactPlayer from 'react-player'


import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';


import Dialog from '@material-ui/core/Dialog';
import Hidden from '@material-ui/core/Hidden';
import DialogContent from '@material-ui/core/DialogContent';

import Slide from '@material-ui/core/Slide';

import TvOffIcon from '@material-ui/icons/TvOff';


const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
  });


const Content = (props)=>{
	const url = props.url
	return <>
		{url===''?<>
			<Grid item style={{paddingRight:2}} xs={12}>
				<Box p={2}>
				<center>
				<TvOffIcon style={{marginRight:2}}/><br/>
				<Typography variant='caption'>재생중인 영상 없음</Typography>
				</center>
				</Box>
			</Grid>

		</>
		:<ReactPlayer width="100%" height="100%" url={url}  controls={true} playing ={true}/>
		}
	</>
}

class YoutubeModal extends Component  {

	constructor(){
		
		super()

		this.state = {
				url:''
		}
		
	}
	
	play(link){
		this.setState({url:link})
	}

	
	render() {
		
		return  <Dialog onClose={this.props.close} open={this.props.open}  
			TransitionComponent={Transition}
			keepMounted
		>
			<DialogContent style={{padding:0,   overflow: 'hidden'}} >
				<Hidden mdUp >
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						style={{width:'100%',height:169}}
						direction="row"
					>
						<Content url={this.state.url}/>
					</Grid>
				</Hidden>
				<Hidden smDown >
					<Grid
						container
						justifyContent="center"
						alignItems="center"
						style={{width:500,height:281}}
						direction="row"
					>
						<Content url={this.state.url}/>
					</Grid>
				</Hidden>

			</DialogContent>
		</Dialog>

	   	
	}
}


export default YoutubeModal;