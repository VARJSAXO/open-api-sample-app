import React from 'react';
import { FormGroup, FormControl, Panel, Button} from 'react-bootstrap';
import { Router, Route, IndexRoute, Link, IndexLink, browserHistory } from 'react-router'

class Details extends React.Component {
		render () {
			return (
				<div className="Details">
					<div className="DetailsHeader">
						<div className= "DetailsTitle"> Introduction </div>
					</div>
					<div className="DetailsBanner">
						This application contains number of samples to illustrate how to use the different resources and endpoints available in the { } 
						<b>Saxo Bank OpenAPI </b>.
					</div>
					{this.props.page}
				</div>
			)
		}
};

export default Details;

