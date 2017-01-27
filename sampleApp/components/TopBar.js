import React from 'react';
import { Link } from 'react-router'
import { Navbar, Nav, NavItem } from 'react-bootstrap';

export default class TopBar extends React.Component {
	render () {
		return (
			<Navbar inverse collapseOnSelect fixedTop>
				<Navbar.Header>
		      		<Navbar.Brand>
		      			Open Api - Feature Samples
		      		</Navbar.Brand>
	    		</Navbar.Header>
	    		<Navbar.Collapse>
	    			<Nav pullRight>
				        <NavItem eventKey={1} href="#" className="navItems"> LOGIN</NavItem>
				        <NavItem eventKey={2} className="navItems"><Link to="home">ACCESS TOKEN </Link></NavItem>
				        <Navbar.Brand className="pullRight">
				        	<a  href="https://developer.saxobank.com/sim/openapi/portal/" target="_blank"> Developer's Portal </a>
				        </Navbar.Brand>
				    </Nav>
	        	</Navbar.Collapse>
			</Navbar>
		)
	}
}
