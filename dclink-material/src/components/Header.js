import React, { Component } from 'react';

import {fade, withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import Link from '@material-ui/core/Link';
import Tooltip from '@material-ui/core/Tooltip';


import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';


import DataService from '../DataService.js';
import Util from '../Util.js';

const drawerWidth = 300;
const useStyles = (theme) => ({
	  root: {
	    
	  },
	  appBar: {
		    [theme.breakpoints.up('md')]: {
		        width: `calc(100% - ${drawerWidth}px)`,
		        marginLeft: drawerWidth,
		      },
		    },
		    
	    menuButton: {
	        marginRight: theme.spacing(2),
	        [theme.breakpoints.up('md')]: {
	          display: 'none',
	        },
	      },
	  title: {
	    flexGrow: 1,
	    display: 'none',
	    [theme.breakpoints.up('md')]: {
	      display: 'block',
	    },
	  },
	  search: {
	    position: 'relative',
	    borderRadius: theme.shape.borderRadius,
	    backgroundColor: fade(theme.palette.common.white, 0.15),
	    '&:hover': {
	      backgroundColor: fade(theme.palette.common.white, 0.25),
	    },
	    marginLeft: 0,
	    width: '100%',
	    [theme.breakpoints.up('md')]: {
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
	  rightToolbar: {
	    marginLeft: 'auto',
	    marginRight: -12,
	  },
	});

function HideOnScroll(props) {
	  const { children, window } = props;
	  // Note that you normally won't need to set the window ref as useScrollTrigger
	  // will default to window.
	  // This is only being set here because the demo is in an iframe.
	  const trigger = useScrollTrigger({ target: window ? window() : undefined });

	  return (
	    <Slide appear={false} direction="down" in={!trigger}>
	      {children}
	    </Slide>
	  );
	}

	HideOnScroll.propTypes = {
	  children: PropTypes.element.isRequired,
	  /**
	   * Injected by the documentation to work in an iframe.
	   * You won't need it on your project.
	   */
	  window: PropTypes.func,
	};

class Header extends Component {
	
	constructor(){
		super();
		
		this.state = {
				name:'',
				options:[],
				open:false
		}
		
		this.middle = React.createRef();
		
	}
	
	
	selectElection(election){
		this.props.selectElection(election);
	}
	
	handleChange(event) {
	    let fieldName = event.target.name;
	    let fleldVal = event.target.value;
	    this.setState({ [fieldName]: fleldVal})
	}
	
	search = (e)=>{
		//console.log(this.state.name);
		e.preventDefault();
		this.props.search(this.state.name);
	}
	
	onChange = async (event, values)=>{
		const name = event.target.value;
		if(name.length>=2){
			console.log(name)
			
			const result = await DataService.search(name);
			
			if(result.length>0){
				const history = Util.makeHistory(result);			
			
				this.props.search(name,history);
			}else{
				this.props.toggleDrawer(false);				
			}
			
		}else{
			this.props.toggleDrawer(false);				
		}
	}
	

	  
	  
	render() {
		
		 const { classes } = this.props;
		
	    return  <div className={classes.root}>
	 
	    	<HideOnScroll>
			    <AppBar position="fixed" className={classes.appBar} elevation={0}>
				    <Toolbar>
				      <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>this.props.toggleElections(true)}>
				        <MenuIcon />
				      </IconButton>
				      <Typography variant="h6" className={classes.title}>
				      <Link href="http://xsfm.co.kr/" target="xsfm" color="inherit" className={classes.brand}>
				      	XSFM 그것은 알기 싫다 <small> 데이터 센트럴 조감도 </small>
				      </Link>
				      </Typography>
				      

				      <section className={classes.rightToolbar}>
				      		<Tooltip title="인물검색">
						      	<IconButton  color="inherit" onClick={()=>this.props.search()}>
									<SearchIcon/>
								</IconButton >
					         </Tooltip>
				         </section>

				            
				      
			            
				    </Toolbar>
			  </AppBar>
			  </HideOnScroll>
		 
	    </div>
	}
}

export default withStyles(useStyles)(Header);
