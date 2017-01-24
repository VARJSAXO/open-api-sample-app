import React from 'react';
import { FormGroup, FormControl, Panel, Button} from 'react-bootstrap';
import Details from './Details';
import DataService from './utils/DataService'

export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.createTransport = this.createTransport.bind(this);
        this.description = "OpenAPIs require authorization token to authenticate user."
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
            <Details Title="Set Access Token" Description={this.description}>
                <div className="padBox">
                    <h3> Set Access Token </h3>
                    <h2> <small>Please copy authorization token from <a href="https://developer.saxobank.com/sim/openapi/portal/" target="_blank">Developer's Portal</a>.</small> </h2>
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
