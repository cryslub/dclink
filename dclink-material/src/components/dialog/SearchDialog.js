import React,{Component} from 'react';


import {withRouter} from 'react-router-dom'

import {fade,withStyles } from '@material-ui/core/styles';


import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';

import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';

import SearchIcon from '@material-ui/icons/Search';


import Person from './Person.js';
import PersonModal from './PersonModal.js';


import FullDialog from './FullDialog.js';

import DataService from '../../DataService.js';

import Util from '../../Util.js';

import PersonBase from './PersonBase.js';

const useStyles = (theme) => ({
	 search: {
	    position: 'relative',
	    borderRadius: theme.shape.borderRadius,
	    backgroundColor: fade(theme.palette.common.white, 0.15),
	    '&:hover': {
	      backgroundColor: fade(theme.palette.common.white, 0.25),
	    },
	    marginLeft: 0,
	    width: '50%',
	    [theme.breakpoints.up('sm')]: {
	      marginLeft: theme.spacing(1),
	      width: 'auto',
	    },
	  },
	  searchIcon: {
	    padding: theme.spacing(0, 2),
	    height: '100%',
	    position: 'absolute',
	    pointerEvents: 'none',
	    display: 'flex',
	    alignItems: 'center',
	    justifyContent: 'center',
	  },
	  inputRoot: {
		    color: 'inherit',
	  },
	  brand:{
		 '&:hover': {
			 color:'white'  ,
			 textDecoration: 'none'
		 },
		color:'white'  
	  },
	  inputInput: {
	    padding: theme.spacing(1, 1, 1, 0),
	    // vertical padding + font size from searchIcon
	    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
	    transition: theme.transitions.create('width'),
	    width: '50%',
	    [theme.breakpoints.up('sm')]: {
	      width: '6ch',
	      '&:focus': {
	        width: '10ch',
	      },
	    },
	  },
	  content: {
	    flexGrow: 1,
	    padding: theme.spacing(3),
	  },
	  toolbar: theme.mixins.toolbar,
	  progress:{
		  color:'white',
		  marginTop:'4px'
	  },
	  rightLine:{
		  borderRight:`1px solid ${theme.palette.divider}`
	  }
})


class SearchDialog extends PersonBase {
	
	
	constructor(){
		super();
		
		this.state = {
			loading:false

		}
		
	
	}
	
	onChange = async (event, values)=>{
		const name = event.target.value;
		const self = this;
		
		if(name.length>=2){
			console.log(name)
			
			this.setState({loading:true})
			
			const result = await DataService.search(name);
			
			if(result.length>0){
				const history = Util.makeHistory(result);			
				this.setState({history:history})
				
				Object.keys(history).forEach(function(person){
					self.getInspection(person)		
				});
				
				//this.props.search(name,history);
			}else{
				//this.props.toggleDrawer(false);				
			}
			
			this.setState({loading:false})

			
		}
	}
	
	handleClose = () => {
		this.props.close()
	  };

	  content(history){
			if(history === undefined) return null;
			const length =  Object.keys(history).length
			const { classes } = this.props;
			
			return <>
			{
				
		        length > 1?
		        <Box mb={2}>
			        <Typography>
						검색된 인물 : {Object.keys(this.state.history).length}명
					</Typography>
				</Box>
				:null	
			}
			<Grid container>
			{		        	
		   	 	Object.keys(this.state.history).map((id,index)=>{
		   	 		const person = this.state.history[id];
		   	 		
		   	 		var sm = 6
		   	 		if(length==1) sm=12
		   	 		return <>
			   	 		<Hidden mdUp >
			   	 			<Box width="100%" mb={3}>				   	 		
				   	 			{index>0?<><Divider/><Box mt={3}/></>:null}		       	 		
				   	 			<Person person={person} id={id}  key={index}/>			   	 		
					   	 	</Box>
			   	 		</Hidden>
			   	 		<Hidden smDown >
			   	 			<Grid item sm={sm} className={length>1&&index%2==0?classes.rightLine:''}>
			   	 				{index>1?<Box mr={3} ml={3}><Divider/></Box>:null}		 
					   	 		<Box m={3}>	  
					   	 			<Person person={person} id={id}  key={index}/>
					   	 		</Box>
				   	 		</Grid>
			   	 		
			   	 		</Hidden>
		   	 		</>
		   	 	})
		    
		     }
		     </Grid>
			</>
		}
	
	render(){
		 const { classes } = this.props;
		 const self = this;
		 
		return  <FullDialog
			open={this.props.open}
			close={this.props.close}
			title={
				<div className={classes.search}>
		            <div className={classes.searchIcon}>
		              <SearchIcon />
		            </div>
		            <InputBase
		              placeholder="이름"
		              classes={{
		                root: classes.inputRoot,
		                input: classes.inputInput,
		              }}
		              inputProps={{ 'aria-label': 'search' }}
		            	onChange={this.onChange}
		            	endAdornment={
		                    <InputAdornment position="end">
		                    	<Box mr={2}>
		                    	{
		                    		self.state.loading?
		                    		<CircularProgress className={classes.progress} size={15}/>
		                    		:<Box style={{width:'15px'}}></Box>
		                    	}
		                    	</Box>
		                    </InputAdornment>
		                  }
		            	autoFocus
		            />
	          </div>	
			}>
			{this.content(this.state.history)}
		</FullDialog>
		
		
	}
}

export default withStyles(useStyles)(SearchDialog)