import React from 'react';
import { ListGroup, ListGroupItem, Collapse, Glyphicon } from 'react-bootstrap';
import { Link } from 'react-router'

const SideBar = React.createClass({

	getInitialState() {
		return {
			open: false
		}
	},

	handleCollapse () {
		this.setState({ open: !this.state.open })
	},

	handleSelect (selectedKey) {
	  alert('selected ' + selectedKey);
	},

	getGlyphName () {
		return this.state.open ? "chevron-up" : "chevron-down";
	},

	render () {
		return (
			<div className="SideBar">
				<ListGroup className="SideBar-Navs">
				    <ListGroupItem>
				    	<Link to="home">Home</Link>
				    </ListGroupItem>
				    <ListGroupItem href="#" onClick={this.handleCollapse}>
				    	The Trade Service Group
				    	<Glyphicon className="glyph" glyph={this.getGlyphName()}/>
				    </ListGroupItem>
				    <Collapse in={this.state.open}>
			          <div>
		            	<ListGroup className="SideBar-Navs">
						    <ListGroupItem href="#" >InfoPrices</ListGroupItem>
						    <ListGroupItem href="#" >Prices</ListGroupItem>
						    <ListGroupItem href="#" >Trade/Orders</ListGroupItem>
						    <ListGroupItem href="#" >Trade/Positions</ListGroupItem>
						</ListGroup>
			          </div>
			        </Collapse>
			        <ListGroupItem href="#">The Reference Data Group</ListGroupItem>
				</ListGroup>
			</div>
		)
	}
});

export default SideBar;
