import React, { Component } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Form from 'react-bootstrap/Form';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';




export default class Header extends Component {
	
	constructor(){
		super();
		
		this.state = {
				name:''
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
	
	render() {
		
		const currentElection = this.props.currentElection;
	    return  <>
	 
		    <Navbar expand="lg" bg="primary" variant="dark" sticky="top">
		    <Navbar.Brand href="http://xsfm.co.kr/" target="xsfm">XSFM 그것은 알기 싫다 <small> 데이터 센트럴 조감도 </small></Navbar.Brand>
		    <Navbar.Toggle aria-controls="basic-navbar-nav" />
		    <Navbar.Collapse id="basic-navbar-nav">
		      <Nav className="mr-auto">
		      
		      	
		        <NavDropdown title={currentElection.name} id="basic-nav-dropdown" >
		        {
	        		this.props.elections.map((election,i)=>{
	        			return <NavDropdown.Item href={'#'+i} key={i} onClick={()=>this.selectElection(election)} active={election===currentElection}>
	        				{election.name}
	        			</NavDropdown.Item>	        			
	        		})
		        }
		        </NavDropdown>
		      </Nav>
		      
		      <Form inline className="mr-2 m-1">
		      	<ToggleButtonGroup type="radio" name="options" defaultValue={1}>
			      <ToggleButton value={1} onClick={()=>this.props.showResult('full')}>전체보기</ToggleButton>
			      <ToggleButton value={2} onClick={()=>this.props.showResult('small')}>간략히</ToggleButton>
			      <ToggleButton value={3} onClick={()=>this.props.showResult('min')}>최소화</ToggleButton>
			      </ToggleButtonGroup>

			  </Form>
		      
		    
		      <Form inline onSubmit={this.search} style={{flexFlow: 'row'}} className="m-1">
		        <FormControl type="text" placeholder="이름" className="mr-sm-1" name="name" onChange={this.handleChange.bind(this)}/>
		        <Button variant="secondary"  type="submit"><span className="glyphicon glyphicon-search"></span></Button>
		      </Form>
		    </Navbar.Collapse>
		  </Navbar>
	  
		 
	    </>
	}
}