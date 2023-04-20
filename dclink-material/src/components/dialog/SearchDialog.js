import React  from 'react';


import {fade,withStyles } from '@material-ui/core/styles';


import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Hidden from '@material-ui/core/Hidden';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Paper from '@material-ui/core/Paper';


import InputAdornment from '@material-ui/core/InputAdornment';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';

import InfoIcon from '@material-ui/icons/Info';
import SearchIcon from '@material-ui/icons/Search';
import StarIcon from '@material-ui/icons/Star';


import Person from './Person.js';
import Party from '../Party.js';


import PersonInfo from '../PersonInfo.js';

import PopoverContainer from '../PopoverContainer.js'

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
	    width: '100%',
	    [theme.breakpoints.up('sm')]: {
	      marginLeft: theme.spacing(3),
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
	    width: '100%',
	    [theme.breakpoints.up('md')]: {
	      width: '20ch'
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
	  },
	  star:{
		color: 'gold',
		position: 'relative',
		top: '4px'
	}
})

  
class SearchDialog extends PersonBase {
	
	
	constructor(){
		super();
		
		this.state = {
			loading:false,
			info:{}
		}
		
	
	}
	
	onChange = async (event, values)=>{
		const name = event.target.value;
		const self = this;
		
		if(name.length>=2){
			console.log(name)
			
			this.setState({loading:true})
			
			const result = await DataService.search(name);
			const infoResult = await DataService.searchInfo(name)
			
			
			const history = Util.makeHistory(result);			
			this.setState({history:history})
			
			Object.keys(history).forEach(function(person){
				self.getInspection(person)		
			});
			
			
			this.setState({info:this.makeInfo(infoResult)})
			
			
			this.setState({loading:false})

			
		}
	}
	
	makeInfo = (list)=>{
		const ret = {};
		list.forEach(info=>{
			const key = info.chinese+info.birth
			if(ret[key]==undefined){
				ret[key] = [];
			}
			ret[key].push(info);
		})

		return ret
	}

	handleClose = () => {
		this.props.close()
	  };

	  typeMap = {
		  "5":"광역의원",
		  "6":"기초의원",
		  "8":"광역비례",
		  "9":"기초비례",
		  "10":"교육의원"
		}

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
		   	 		if(length===1) sm=12
		   	 		return <>
			   	 		<Hidden mdUp >
			   	 			<Box width="100%" mb={3}>				   	 		
				   	 			{index>0?<><Divider/><Box mt={3}/></>:null}		       	 		
				   	 			<Person person={person} id={id}  key={index}/>			   	 		
					   	 	</Box>
			   	 		</Hidden>
			   	 		<Hidden smDown >
			   	 			<Grid item sm={sm} className={length>1&&index%2===0?classes.rightLine:''}>
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
			 {
				 Object.keys(this.state.info).length>0?<>
					<Box>	
					<Box pt={1}><Typography component="div">지자체 의원</Typography></Box>
					<Divider />
					<Box p={1}></Box>

					<Grid container spacing={2}>
					{
						Object.keys(this.state.info).map(key=>{
							const list = this.state.info[key]
							return <Grid item >
								<Paper style={{minWidth:270}}>
									<List>
										{list.map((candidate,i)=>{
											return <>
											{i>0?<Divider  />:null}
											<ListItem>
												<ListItemText primary={<>
													{candidate.result==='당선'?
													<Box component="span"><StarIcon  className={classes.star} /></Box>
													:<Box ml={2}></Box>		
													}
													{candidate.electionName}
													<Typography component="span" variant="caption" style={{padding:2}}>{Util.typeMap[candidate.type]}</Typography>
													<PopoverContainer
													type="info"
													handler={(open)=>{
														return <IconButton aria-label="settings">
															<InfoIcon fontSize="small"/>
														</IconButton>
													}}
													data = {candidate}	
													/>	
												</>
												}

												secondary={<>
													<Typography component="span"  variant="caption" style={{paddingRight:2}}>{candidate.stateName}</Typography>
													<Typography component="span"  variant="caption" style={{paddingRight:2}}>{candidate.itemName}</Typography>
													{candidate.type==='8'?null:<Typography component="span"  variant="caption" style={{padding:2}}>{Util.getWardName(candidate,candidate.itemName)}</Typography>}
													<Party party={candidate.party} />
													<Typography component="span"  variant="caption" style={{paddingLeft:5}}>{candidate.status!=='등록'?candidate.status:candidate.result}</Typography>
												</>}
												/>
											</ListItem>
										</>
										})}
									</List>
								</Paper>
							</Grid>
						})
					}
					</Grid>
					</Box>
				 </>
				 :null
			 }
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
		              inputProps={{ style: {fontSize:'16px'} }}
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