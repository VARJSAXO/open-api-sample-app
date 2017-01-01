import React from 'react';
import { FormGroup, FormControl, Panel, Button} from 'react-bootstrap';

const Home = React.createClass({
	render () {
		return (
			<div className="padBox">
				<h3> Set Access Token </h3>
				<Panel header="Access Token" bsStyle="primary">
					<FormGroup controlId="formControlsTextarea">
				      <FormControl componentClass="textarea" placeholder="Paste authorization token here" />
			    	</FormGroup>
			    	<Button bsStyle="primary">Set Token</Button>
			    </Panel>
			    <hr/>
			</div>
		)
	}
});

export default Home;
