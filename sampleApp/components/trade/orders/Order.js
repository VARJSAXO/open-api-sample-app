import React from 'react';
import Details from '../../Details';
import Instruments from '../../ref/instruments/Instruments'
import { merge, map } from 'lodash'
import { MenuItem, Table, Button, ButtonToolbar, Form, FormGroup,FormControl, ButtonGroup, Input,ControlLabel, Col,Row,Panel, Tabs, Tab} from 'react-bootstrap';
import CustomTable from '../../utils/CustomTable';
import dataMapper from '../../utils/dataMapper';
import API from '../../utils/API';


export default class Order extends React.Component {
    constructor(props) {
        super(props);

        this.orderSubscription = {};
        this.positionSubscription={};
        this.OpenOrders={};
        this.Positions={};
        this.accountInfo =  {};
        this.currentOrder = {
            Uic:"",
            AssetType:"",
            OrderType:"Market",
            OrderPrice:0.0,
            OrderDuration:{ DurationType:"DayOrder", },
            Amount:0,
            AccountKey:"",
            BuySell:"",
            OrderRelation:"StandAlone"

        };

        this.state = { IsSubscribedForOrders:false,
                       IsSubscribedForPositions:false,
                       updated:false,
                       Ask:0.0,
                       Bid:0.0,
                       Symbol:"",
                       orderRequestParams:""
                     };

        this.onInstrumentChange = this.onInstrumentChange.bind(this);
        this.creatOrderSubscription = this.creatOrderSubscription.bind(this);
        this.creatPositionSubscription = this.creatPositionSubscription.bind(this);

        this.OnOrderUpdate = this.OnOrderUpdate.bind(this);
        this.OnPositionUpdate = this.OnPositionUpdate.bind(this);
        this.onAccountInfo = this.onAccountInfo.bind(this);
        this.onInfoPrice = this.onInfoPrice.bind(this);

        this.onSelectOrderType = this.onSelectOrderType.bind(this);
        this.onSelectOrderDuration = this.onSelectOrderDuration.bind(this);

        this.placeOrder = this.placeOrder.bind(this);
        this.onPlaceOrderSuccess = this.onPlaceOrderSuccess.bind(this);
        this.onPlaceOrderFailure = this.onPlaceOrderFailure.bind(this);

        this.prettyPrint = this.prettyPrint.bind(this);
    }

    prettyPrint(obj) {
        if (!obj) return '';
        return JSON.stringify(obj, null, 3)
        .replace(/&/g, '&amp;')
        .replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') + '\n';
    }


    // Buy or Sell button handling. 
    placeOrder() {
        //Call to openApi.
        API.placeOrder(JSON.parse(this.state.orderRequestParams), this.onPlaceOrderSucces, this.onPlaceOrderFailure);
    }

    // Calback: Order placed successfully.
    onPlaceOrderSuccess(result) {
        console.log(result);
    }

    // Calback: Order Failure.
    onPlaceOrderFailure(result) {
        console.log(result);
    }

    // React Event: Unsubscribe or dispose on component unmount.
    componentWillUnmount() {

        if(this.state.IsSubscribedForOrders) {
            API.unsubscribe(this.orderSubscription);
        }

        if(this.state.IsSubscribedForPositions) {
             API.unsubscribe(this.positionSubscription);
        }
    }

    // React Event: Get Account information on mount\loading component.
    componentDidMount() {
        API.getAccountInfo(this.onAccountInfo);
    }

    // Calback: successfully got account information.
    onAccountInfo(response) {
        this.accountInfo = response.Data[0];

        this.currentOrder.AccountKey = this.accountInfo.AccountKey;

        // Create Order subscription.
        this.creatOrderSubscription();
        // Create Positions subscription.
        this.creatPositionSubscription();
    }

    // Callback for positions and delta from streaming server.
    OnPositionUpdate(response) {
        var data = response.Data;
        for (var index in data) {
            if(this.Positions[data[index].PositionId]) {
                if(data[index].PositionView)
                    merge(this.Positions[data[index].PositionId], data[index].PositionView); // TODO: Please fix it. Don't assume flat delta'.
            }
            else {
                var position = dataMapper.getPositionsData(data[index]);
                this.Positions[position.PositionId] = position;
            }
        }
        this.setState({updated:true});
    }

    // Callback for Orders and delta from streaming server.
    OnOrderUpdate(response) {
        var data = response.Data;
        for (var index in data) {
            if(this.OpenOrders[data[index].OrderId]) {
                merge(this.OpenOrders[data[index].OrderId], data[index]);
            }
            else {
                var order = dataMapper.getOrderData(data[index]);
                this.OpenOrders[order.OrderId] = order;
            }
        }
        this.setState({updated:true});
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
        this.positionSubscription = API.createPositionsSubscription(subscriptionArgs,this.OnPositionUpdate);
        this.setState({IsSubscribedForPositions:true});
    }

    // Called after getting accountInfo successfully while loading component.
    creatOrderSubscription() {

        var subscriptionArgs = {
            "Arguments": {
                "AccountKey": this.accountInfo.AccountKey,
                "ClientKey": this.accountInfo.ClientKey,
                "FieldGroups": ["DisplayAndFormat"]
            }
        }
        this.orderSubscription = API.creatOrderSubscription(subscriptionArgs,this.OnOrderUpdate);
        this.setState({IsSubscribedForOrders:true});
    }

    // Get inforprice for instrument selected in UI.
    onInstrumentChange(instrument){
            var queryParams =  {
                AssetType: instrument.AssetType,
                Uic: instrument.Identifier,
                FieldGroups: ['DisplayAndFormat', 'PriceInfo', 'Quote']
            }
            API.getInfoPrice(queryParams,this.onInfoPrice);
       }

    // Callback on successful inforprice call.
    onInfoPrice(response) {

        this.currentOrder.Amount = response.Quote.Amount;
        this.currentOrder.Uic = response.Uic;
        this.currentOrder.AssetType = response.AssetType;
        this.currentOrder.OrderPrice = response.Quote.Ask ? response.Quote.Ask:0.0;
        this.setState({Ask:response.Quote.Ask ? response.Quote.Ask:0.0,
                       Bid:response.Quote.Bid ? response.Quote.Bid:0.0,
                       Symbol:response.DisplayAndFormat.Symbol,
                       orderRequestParams:this.prettyPrint(this.currentOrder)});
    }

    // Function to handle UI updates and modify currentOrderModel.
    onSelectOrderType(event){
        this.currentOrder.OrderType = event.target.value;
        this.setState({orderRequestParams:this.prettyPrint(this.currentOrder)});
    }

    // Function to handle UI updates and modify currentOrderModel.
    onSelectOrderDuration(event) {
        this.currentOrder.OrderDuration.DurationType = event.target.value;
        this.setState({orderRequestParams:this.prettyPrint(this.currentOrder)});
    }


    onChangeAmount(event) {
        this.currentOrder.Amount = event.target.value;
        this.setState({orderRequestParams:this.prettyPrint(this.currentOrder)});
    }

    onSelectBuySell(event)
    {
        this.currentOrder.BuySell = event.target.value;
        this.currentOrder.OrderPrice = this.currentOrder.BuySell == "Buy" ? this.state.Ask:this.state.Bid;
        this.setState({orderRequestParams:this.prettyPrint(this.currentOrder)});
    }

    onChangeOrderPrice(event)
    {
        this.currentOrder.OrderPrice = event.target.value;
        this.setState({orderRequestParams:this.prettyPrint(this.currentOrder)});
    }

    onChangeRequestParams(event)
    {
        this.setState({orderRequestParams:event.target.value});
    }

    render() {

        return (
          <Details Title = "Orders" Description={this.description}>
          <Instruments parent="true" onInstrumentSelected={this.onInstrumentChange}/>
          <div className="padBox">
            <Row>
            <Col sm={6}>
            <Panel header="Order Details" className="panel-primary">
            <Form>
                <div className="padBox">
                    <FormGroup>
                    <Row>
                        <Col sm={3}>
                            <ControlLabel >Instrument (UIC: {this.currentOrder.Uic})</ControlLabel>
                            <FormControl readOnly="readOnly" type="text" placeholder="Symbol" value={this.state.Symbol} />
                        </Col>
                        <Col sm={3}>
                            <ControlLabel >AssetType</ControlLabel>
                            <FormControl readOnly="readOnly" type="text" placeholder="AssetType" value={this.currentOrder.AssetType} />
                        </Col>
                        <Col sm={3}>
                            <ControlLabel>Ask Price</ControlLabel>
                            <FormControl type="text" readOnly="readOnly" placeholder="Ask Price" value={this.state.Ask}/>
                        </Col>
                        <Col sm={3} >
                            <ControlLabel>Bid Price</ControlLabel>
                            <FormControl type="text" readOnly="readOnly" placeholder="Bid Price" value={this.state.Bid}/>
                        </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                    <Col sm={3}>
                        <ControlLabel>BuySell</ControlLabel>
                        <FormControl componentClass="select" value={this.currentOrder.BuySell} onChange={this.onSelectBuySell.bind(this)} >
                            <option value="Buy">Buy</option><option value="Sell">Sell</option>
                        </FormControl>
                    </Col>
                    <Col sm={3}>
                        <ControlLabel>Order Price</ControlLabel>
                        <FormControl type="text"  placeholder="Order Price" value={this.currentOrder.OrderPrice} onChange={this.onChangeOrderPrice.bind(this)}  />
                    </Col>
                    <Col sm={3}>
                        <ControlLabel>Order Amount</ControlLabel>
                        <FormControl type="text" placeholder="Amount" value={this.currentOrder.Amount} onChange={this.onChangeAmount.bind(this)} />
                    </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Row>
                    <Col sm={3}>
                        <ControlLabel>Order Type</ControlLabel>
                        <FormControl componentClass="select" value={this.currentOrder.OrderType} onChange={this.onSelectOrderType} >
                            <option value="Market">Market</option><option value="Limit">Limit</option>
                        </FormControl>
                    </Col>
                    <Col sm={3} >
                        <ControlLabel>Order Duration</ControlLabel>
                        <FormControl componentClass="select" value={this.currentOrder.Duration} onChange={this.onSelectOrderDuration}>
                            <option value="DayOrder">DayOrder</option><option value="GoodTillCancel">GoodTillCancel</option>
                            <option value="GoodTillDate">GoodTillDate</option> <option value="ImmediateOrCancel">ImmediateOrCancel</option>
                        </FormControl>
                    </Col>
                   </Row>
                    </FormGroup>
                    <FormGroup  bsSize="large">
                    <Row>
                    <Col sm={12} >
                        <ControlLabel bsStyle="default"><h3>Request Parameters:</h3></ControlLabel>
                        <FormControl componentClass="textarea" placeholder="textarea" rows={6} value={this.state.orderRequestParams} onChange={this.onChangeRequestParams.bind(this)} />
                    </Col>
                    </Row>
                    </FormGroup>
                    <FormGroup>
                    <Col smOffset={8} sm={4}><Button bsStyle="primary" block  onClick={this.placeOrder.bind(this)}>Place Order</Button></Col>
                    </FormGroup>
                </div>
            </Form>
            </Panel>
            </Col>
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
                      <CustomTable cols={dataMapper.getOrderColumns()} Data={this.OpenOrders} ></CustomTable>
                    </div>
                    </Row>
                    </Tab>
                    <Tab eventKey={2} title="Positions">
                    <Row>
                    <div className="padBox">
                        <CustomTable cols={dataMapper.getPositionColumns()} Data={this.Positions}  ></CustomTable>
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
