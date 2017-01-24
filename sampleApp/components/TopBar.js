import React from 'react';
import { Link } from 'react-router'
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class TopBar extends React.Component {
	render () {
		return (
			<Navbar inverse collapseOnSelect>
				<Navbar.Header>
		      		<Navbar.Brand>
		        		<a href="https://developer.saxobank.com/sim/openapi/portal/" target="_blank">OpenAPI</a>
		      		</Navbar.Brand>
		      		<Navbar.Toggle />
	    		</Navbar.Header>
	    		<Navbar.Collapse>
	    			<Nav pullRight>
				        <NavItem eventKey={1} href="#">LOGIN</NavItem>
				        <NavItem eventKey={1}> <Link to = "home"> ACCESS TOKEN </Link> </NavItem>
				    </Nav>
	        	</Navbar.Collapse>
			</Navbar>
		)
	}
}

