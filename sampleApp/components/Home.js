import React from 'react';
import { FormGroup, FormControl, Panel, Button} from 'react-bootstrap';
import Details from './Details';
import DataService from './utils/DataService'

export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.createTransport = this.createTransport.bind(this);
        this.description = "Open API provides access to all of the resources and functionality required to build a high performance multi-asset trading platform. It is a sample application to explain different functionalities and features offered by OpenAPIs. OpenAPIs require authorization token."
        this.state = { token: '' };
    }

    handleChange (event) {
        this.setState({
            token: event.target.value
        });
    }

    createTransport() {
        DataService.createTransport('Bearer ' + this.state.token);
        DataService.createStreamingObject('Bearer ' + this.state.token);
    }

    render () {
        return (
            <Details Title="Welcome to the Saxo Bank Open Api - Feature Samples" Description={this.description}>
                <div className="padBox">
                    <h2> <small>Please copy authorization token from <a href="https://developer.saxobank.com/sim/openapi/portal/" target="_blank">Developer's Portal</a>.</small> </h2>
                    <h3> Set Access Token </h3>
                    <Panel header="Access Token" bsStyle="primary">
                        <form>
                            <FormGroup controlId="formControlsTextarea">
                                <FormControl componentClass="textarea" value={this.state.value} placeholder="Paste authorization token here" onChange={this.handleChange}/>
                            </FormGroup>
                            <Button bsStyle="primary" onClick={this.createTransport}>Save</Button>
                        </form>
                    </Panel>
                </div>
            </Details>
        );
    }
}