import React from 'react';
import Details from '../../Details';
import InstrumentTemplate from './InstrumentTemplate'
import API from '../../utils/API'

export default class Instruments extends React.Component {
    constructor (props) {
        super(props);
        this.assetTypes = ["FxSpot", "Bond", "Cash", "Stock", "CfdOnFutures", "CfdOnIndex", "CfdOnStock", "ContractFutures", "FuturesStrategy", "StockIndex", "ManagedFund"];
        this.instrumentList = [];
        this.description = "Shows how to get instruments details based on Asset Type";
        this.state = { hasInstruments : false };
        this.onAssetTypeSelectionChange = this.onAssetTypeSelectionChange.bind(this);
        this.onInstrumentsUpdated = this.onInstrumentsUpdated.bind(this);
        this.onInstrumentSelected = this.onInstrumentSelected.bind(this);
    }

    onAssetTypeSelectionChange (eventKey, event) {
        API.getInstruments({ AssetTypes: eventKey },
            this.onInstrumentsUpdated,
            (result) => console.log(result)
        );
    }

    onInstrumentsUpdated (result) {
        this.instrumentList = result.Data;
        this.setState({
            hasInstruments : true
        });
    }

    onInstrumentSelected (eventKey, event) {
        if(this.props.parent) {
            this.props.onInstrumentSelected(eventKey)
        }
    }

    render() {
        return (
            <div>
                { this.props.parent ?
                    ( <InstrumentTemplate hasInstruments = {this.state.hasInstruments} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelectionChange = {this.onAssetTypeSelectionChange} parent={this.props.parent} onInstrumentSelected={this.onInstrumentSelected}/>)
                    : (<Details Title="Ref Data - EndPoint: v1/instruments" Description = {this.description}>
                        <InstrumentTemplate hasInstruments = {this.state.hasInstruments} assetTypes = {this.assetTypes} instrumentList = {this.instrumentList} onAssetTypeSelectionChange = {this.onAssetTypeSelectionChange} parent={this.props.parent}/>
                    </Details>)
                }
            </div>
        );
    }
}
