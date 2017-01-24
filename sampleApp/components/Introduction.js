import React from 'react';
import { FormGroup, FormControl, Panel, Button} from 'react-bootstrap';
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
                    <h2> <small>Please login or set access token from above to have access to application</small> </h2>
                </div>
            </Details>
        );
    }
}
