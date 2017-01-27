import React from 'react';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments'
import { merge, map } from 'lodash'
import { MenuItem, Table, Button, ButtonToolbar, Form, FormGroup,FormControl, ButtonGroup, Input,ControlLabel, Col, Row, Panel, Tabs, Tab} from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';
import dataMapper from '../../utils/dataMapper';
import API from '../../utils/API';
import OrderForm from './OrderForm'

export default class Order extends React.Component {
    constructor(props) {
        super(props);

        this.orderSubscription = {};
        this.positionSubscription={};
        this.openOrders={};
        this.positions={};
        this.accountInfo =  {};

        this.state = { IsSubscribedForOrders:false,
                       IsSubscribedForPositions:false,
                       updated:false,
                       selectedInstrument:undefined
                     };

        this.createOrderSubscription = this.createOrderSubscription.bind(this);
        this.creatPositionSubscription = this.creatPositionSubscription.bind(this);
    }

    // React Event: Unsubscribe or dispose on component unmount.
    componentWillUnmount() {
        API.disposeSubscription();
    }

    // React Event: Get Account information on mount\loading component.
    componentDidMount() {
        API.getAccountInfo(this.onAccountInfo.bind(this));
    }

    // Calback: successfully got account information.
    onAccountInfo(response) {
        this.accountInfo = response.Data[0];

        // Create Order subscription.
        this.createOrderSubscription();
        // Create Positions subscription.
        this.creatPositionSubscription();
    }

    // Called after getting accountInfo successfully while loading component.
    creatPositionSubscription() {
        var subscriptionArgs = {
            "Arguments": {
                "AccountKey": this.accountInfo.AccountKey,
                "ClientKey": this.accountInfo.ClientKey,
                "FieldGroups": ["DisplayAndFormat","PositionBase","PositionView"]
            }
        }
        this.positionSubscription = API.createPositionsSubscription(subscriptionArgs,this.OnPositionUpdate.bind(this));
        this.setState({IsSubscribedForPositions:true});
    }

    // Called after getting accountInfo successfully while loading component.
    createOrderSubscription() {

        var subscriptionArgs = {
            "Arguments": {
                "AccountKey": this.accountInfo.AccountKey,
                "ClientKey": this.accountInfo.ClientKey,
                "FieldGroups": ["DisplayAndFormat"]
            }
        }
        this.orderSubscription = API.createOrderSubscription(subscriptionArgs,this.OnOrderUpdate.bind(this));
        this.setState({IsSubscribedForOrders:true});
    }

    // Callback for positions and delta from streaming server.
    OnPositionUpdate(response) {
        var data = response.Data;
        for (var index in data) {
            if(this.positions[data[index].PositionId]) {
                if(data[index].PositionView)
                    merge(this.positions[data[index].PositionId], data[index].PositionView); // TODO: Please fix it. Don't assume flat delta'.
            }
            else {
                var position = dataMapper.getPositionsData(data[index]);
                this.positions[position.PositionId] = position;
            }
        }
        this.setState({updated:true});
    }

    // Callback for Orders and delta from streaming server.
    OnOrderUpdate(response) {
        var data = response.Data;
        for (var index in data) {
            if(this.openOrders[data[index].OrderId]) {
                merge(this.openOrders[data[index].OrderId], data[index]);
            }
            else {
                var order = dataMapper.getOrderData(data[index]);
                this.openOrders[order.OrderId] = order;
            }
        }
        this.setState({updated:true});
    }

    // Get inforprice for instrument selected in UI.
    onInstrumentChange(instrument){
            var queryParams =  {
                AssetType: instrument.AssetType,
                Uic: instrument.Identifier,
                FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote']
            }
            API.getInfoPrices(queryParams,this.onInfoPrice.bind(this));
       }

    // Callback on successful inforprice call.
    onInfoPrice(response) {
       this.setState({selectedInstrument:response});
    }

    render() {

        return (
          <Details Title = "Orders" Description={this.description}>
          <Instruments parent="true" onInstrumentSelected={this.onInstrumentChange.bind(this)}/>
          <div className="padBox">
            <Row>
            <Col sm={6}><OrderForm accountInfo={this.accountInfo} instrumentInfo={this.state.selectedInstrument} /></Col>
            <Col sm={4}>
                <Panel header="Account Info: openapi/port/v1/accounts/me" className="panel-primary">
                <div className="padBox">
                <Table striped bordered condensed hover>
                    <thead><tr><th>Data</th><th>Value</th></tr></thead>
                    <tbody>
                        <tr  key="AccountId" ><td>AccountId</td><td>{this.accountInfo.AccountId}</td></tr>
                        <tr  key="AccountKey"><td>AccountKey</td><td>{this.accountInfo.AccountKey}</td></tr>
                        <tr  key="AccountType"><td>AccountType</td><td>{this.accountInfo.AccountType}</td></tr>
                        <tr  key="ClientId"><td>ClientId</td><td>{this.accountInfo.ClientId}</td></tr>
                        <tr  key="ClientKey"><td>ClientKey</td><td>{this.accountInfo.ClientKey}</td></tr>
                        <tr  key="Currency"><td>Currency</td><td>{this.accountInfo.Currency}</td></tr>
                    </tbody>
                </Table>
                </div>
                </Panel>
            </Col>
            </Row>
            <Row>
                <div className="padBox">
                <Tabs className="primary" defaultActiveKey={1} animation={false} id="noanim-tab-example">
                    <Tab eventKey={1} title="Orders">
                    <Row>
                    <div className="padBox">
                      <CustomTable cols={dataMapper.getOrderColumns()} Data={this.openOrders} ></CustomTable>
                    </div>
                    </Row>
                    </Tab>
                    <Tab eventKey={2} title="Positions">
                    <Row>
                    <div className="padBox">
                        <CustomTable cols={dataMapper.getPositionColumns()} Data={this.positions}  ></CustomTable>
                    </div>
                    </Row>
                    </Tab>
                </Tabs>
                </div>
            </Row>
            </div>
            </Details>);
    }
}
