import React, { Component } from 'react';

import Spinner from 'react-bootstrap/Spinner';
import Modal from 'react-bootstrap/Modal';



export default class LoadingModal extends Component {

	
	
	
	close(){
		
	}
	
	
	render() {
		
		return <Modal show={this.props.show} onHide={()=>this.close()} size="sm">
		        <Modal.Body>
			        <Spinner animation="border" size="sm" className="mr-2" />        	
			        <span style={{    top: '2px',position: 'relative'}}>Loading.... </span>

			     </Modal.Body>

	      	</Modal>
	
	      	
	}
}