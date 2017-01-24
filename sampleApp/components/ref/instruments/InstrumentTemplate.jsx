import React from 'react';
import { ButtonToolbar, DropdownButton, MenuItem, Table} from 'react-bootstrap';
import { isEmpty } from 'lodash'

export default (props) => {
    var instruments = props.instrumentList.map((instrument) =>  <MenuItem eventKey = {instrument} key = {instrument.Symbol}> {instrument.Description} </MenuItem> );
    var assetTypes = props.assetTypes.map((assetType) => <MenuItem eventKey = {assetType} key = {assetType}> {assetType} </MenuItem> );
    var headers = !isEmpty(props.instrumentList) ? Object.keys(props.instrumentList[0]).map((key) => <th key={key}> {key} </th>) : null;
	var data =  !isEmpty(props.instrumentList) ? props.instrumentList.map((instrument) =>
			      <tr key={instrument.Uic}>
			        <td>{instrument.Description}</td>
			        <td>{instrument.AssetType}</td>
			        <td>{instrument.ExchangeId}</td>
			        <td>{instrument.Identifier}</td>
			        <td>{instrument.SummaryType}</td>
			        <td>{instrument.Symbol}</td>
			      </tr>
				) : null;
	return (
	    <div className="padBox">
		    <ButtonToolbar>
		        <DropdownButton bsStyle="primary" title="Select Asset Type" id="dropdown-size-large" onSelect = {props.onAssetTypeSelectionChange}>
		        	{assetTypes}
		        </DropdownButton>
		        { props.hasInstruments ?
		        	props.parent ?
			        (<DropdownButton bsStyle="primary" title="Select Instruments" id="dropdown-size-large" onSelect = {props.onInstrumentSelected}>
						{instruments}
			        </DropdownButton>) :
			        ( <div>
			        	<br/>
			        	<br/>
			        	<br/>
				        <Table striped bordered condensed hover>
						    <thead>
						      <tr> {headers} </tr>
						    </thead>
						    <tbody> {data} </tbody>
						</Table>
					</div>)
				: null }
		    </ButtonToolbar>
		</div>
	);
};



