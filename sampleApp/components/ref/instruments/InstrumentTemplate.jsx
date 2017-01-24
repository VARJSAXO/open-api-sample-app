import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem, Table} from 'react-bootstrap';
import { isEmpty } from 'lodash'

export default (props) => {
    var instruments = props.instrumentList.map((instrument) =>  <MenuItem eventKey = {instrument} key = {instrument.Symbol}> {instrument.Description} </MenuItem> );
    var assetTypes = props.assetTypes.map((assetType) => <MenuItem eventKey = {assetType} key = {assetType}> {assetType} </MenuItem> );
	var data =  !isEmpty(props.instrumentList) ? props.instrumentList.map((instrument) =>
			      <tr key={instrument.Uic}>
			      	<td>{instrument.Identifier}</td>
			      	<td>{instrument.Symbol}</td>
			        <td>{instrument.AssetType}</td>
			        <td>{instrument.Description}</td>
			        <td>{instrument.ExchangeId}</td>
			      </tr>
				) : null;
	return (
	    <div className="padBox">
		    <ButtonToolbar>
		        <DropdownButton bsStyle="primary" title={props.assetType} id="dropdown-size-large" onSelect = {props.onAssetTypeSelected} >
		        	{assetTypes}
		        </DropdownButton>
		        { props.hasInstruments ?
		        	props.parent ?
			        (<DropdownButton bsStyle="primary" title={props.instrument} id="dropdown-size-large" onSelect = {props.onInstrumentSelected}>
						{instruments}
			        </DropdownButton>) :
			        (<div>
			        	<br/>
			        	<br/>
			        	<br/>
				        <Table striped bordered condensed hover>
						    <thead>
						     	<tr>
				    			    <th>Identifier / Uic</th>
				    			    <th>Symbol</th>
							        <th>AssetType</th>
							        <th>Instrument Name</th>
							        <th>ExchangeId</th>
					      		</tr>
						    </thead>
						    <tbody> {data} </tbody>
						</Table>
					</div>)
				: null }
		    </ButtonToolbar>
		</div>
	);
};



