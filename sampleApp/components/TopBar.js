import React from 'react';
import { Navbar, Nav, NavItem } from 'react-bootstrap';

const TopBar = React.createClass({
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
				    </Nav>
	        	</Navbar.Collapse>
			</Navbar>
		)
	}
});

export default TopBar;

