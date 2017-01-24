import React from 'react';
import { Link } from 'react-router'
import { ListGroup, ListGroupItem, Collapse, Glyphicon } from 'react-bootstrap';

export default class SideBar extends React.Component {
	constructor(props) {
		super(props);
		this.handleCollapse = this.handleCollapse.bind(this);
		this.getGlyphName = this.getGlyphName.bind(this);
		this.state = {
			tradeOpen: false,
			refOpen: false
		};
	}

	handleCollapse (name) {
		var stateObject = {};
		stateObject[name+'Open'] = !this.state[name+'Open']
		this.setState(stateObject)
	}

	getGlyphName (name) {
		return this.state[name+'Open'] ? "chevron-up" : "chevron-down";
	}

	render () {
		return (
			<div className = "SideBar">
				<ListGroup className = "SideBar-Navs">
				    <ListGroupItem>
				    	<Link to = "intro"> Introduction </Link>
				    </ListGroupItem>
				    <ListGroupItem href = "#" onClick = { this.handleCollapse.bind(this,'trade') }>
						Trade Service Group
				    	<Glyphicon className = "glyph" glyph = { this.getGlyphName('trade') }/>
				    </ListGroupItem>
				    <Collapse in = { this.state.tradeOpen }>
			          <div>
		            	<ListGroup className = "SideBar-Navs">
						    <ListGroupItem href = "#infoPrices"> InfoPrices </ListGroupItem>
						    <ListGroupItem href = "#prices"> Prices </ListGroupItem>
						    <ListGroupItem href = "#orders"> Orders </ListGroupItem>
						    <ListGroupItem href = "#"> Positions</ListGroupItem>
						</ListGroup>
			          </div>
			        </Collapse>
			        <ListGroupItem href = "#" onClick = { this.handleCollapse.bind(this,'ref') }>
			        	Reference Data Group
			        	<Glyphicon className = "glyph" glyph = { this.getGlyphName('ref') }/>
			        </ListGroupItem>
			        <Collapse in = { this.state.refOpen }>
			          <div>
		            	<ListGroup className = "SideBar-Navs">
						    <ListGroupItem href = "#instruments"> Instruments </ListGroupItem>
						</ListGroup>
			          </div>
			        </Collapse>
				</ListGroup>
			</div>
		)
	}
}
