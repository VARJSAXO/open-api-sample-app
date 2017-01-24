import React from 'react';
import { FormGroup, FormControl, Panel, Button, Alert} from 'react-bootstrap';
import Details from './Details';
import DataService from './utils/DataService'

export default class Home extends React.Component{
    constructor(props) {
        super(props);
        this.description = "Open API provides access to all of the resources and functionality required to build a high performance multi-asset trading platform. It is a sample application to explain different functionalities and features offered by OpenAPIs. OpenAPIs require authorization token."
        this.state = { token: '' };
    }

    render () {
        return (
            <Details Title="Welcome to the Saxo Bank Open Api - Feature Samples" Description={this.description}>
                <div className="padBox">
                    <h2> <small>This application contains a number of samples to illustrate how to use the different resources and endpoints available in the Saxo Bank OpenAPI.
                        <br/>
                        All samples require a valid access token, which you may obtain from the developer portal
                    </small> </h2>
                    <br/>
                    <br/>
                    <br/>
                    <Alert bsStyle="warning">
                        Some responses may return no samples, depending upon actual market data entitlements and the configuration of the logged in user.
                    </Alert>
                </div>
            </Details>
        );
    }
}
