import React from 'react';
import { merge, map } from 'lodash'
import { MenuItem, Table, Button, ButtonToolbar, Form, FormGroup,FormControl, ButtonGroup, Input,ControlLabel, Col,Row,Panel, Tabs, Tab} from 'react-bootstrap';
import Instruments from '../../ref/instruments/Instruments';
import API from '../../utils/API';

export default class OrderForm extends React.Component {
    constructor(props) {
        super(props);

        this.currentOrder = {
            Uic:"",
            AssetType:"",
            OrderType:"Market",
            OrderPrice:0.0,
            OrderDuration:{ DurationType:"DayOrder", },
            Amount:0,
            AccountKey:"",
            BuySell:"Buy",
            OrderRelation:"StandAlone"
        };

        this.Ask=0.0;
        this.Bid=0.0;
        this.Symbol="";
        this.orderRequestParams="";

        this.state = { updated:false };
        this.prettyPrint = this.prettyPrint.bind(this);
    }

    prettyPrint() {

        this.orderRequestParams = JSON.stringify(this.currentOrder, null, 3)
        .replace(/&/g, '&amp;')
        .replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') + '\n';

        this.setState({updated:true});
    }

    // Function to handle UI updates and modify currentOrderModel.
    onSelectOrderType(event){
        this.currentOrder.OrderType = event.target.value;
        this.prettyPrint();
    }

    // Function to handle UI updates and modify currentOrderModel.
    onSelectOrderDuration(event) {
        this.currentOrder.OrderDuration.DurationType = event.target.value;
        this.prettyPrint();
    }


    onChangeAmount(event) {
        this.currentOrder.Amount = event.target.value;
        this.prettyPrint();
    }

    onSelectBuySell(event) {
        this.currentOrder.BuySell = event.target.value;
        this.currentOrder.OrderPrice = this.currentOrder.BuySell == "Buy" ? this.Ask:this.Bid;
        this.prettyPrint();
    }

    onChangeOrderPrice(event)
    {
        this.currentOrder.OrderPrice = event.target.value;
        this.prettyPrint();
    }

    onChangeRequestParams(event)
    {
        this.orderRequestParams = JSON.stringify(event.target.value, null, 3)
        .replace(/&/g, '&amp;')
        .replace(/\\"/g, '&quot;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;') + '\n';

        this.setState({updated:true});
    }

    placeOrder()
    {
        API.placeOrder(JSON.parse(this.orderRequestParams), this.onPlaceOrderSuccess.bind(this), this.onPlaceOrderFailure.bind(this));
    }

    // Calback: Order placed successfully.
    onPlaceOrderSuccess(result) {
        console.log(result);
    }

    // Calback: Order Failure.
    onPlaceOrderFailure(result) {
        console.log(result);
    }

    render() {

        this.currentOrder.AccountKey = (this.props.accountInfo.AccountKey ? this.props.accountInfo.AccountKey: "");
        let pnlHeader = "Order Details. AccountKey - " + (this.props.accountInfo.AccountKey ? this.props.accountInfo.AccountKey: "");

        if(this.props.instrumentInfo && this.currentOrder.Uic != this.props.instrumentInfo.Uic )
        {
            let instrumentInfo = this.props.instrumentInfo;

            this.currentOrder.Amount = instrumentInfo.Quote.Amount;
            this.currentOrder.Uic = instrumentInfo.Uic;
            this.currentOrder.AssetType = instrumentInfo.AssetType;
            this.currentOrder.OrderPrice = instrumentInfo.Quote.Ask ? instrumentInfo.Quote.Ask:0.0;
            this.Ask = instrumentInfo.Quote.Ask ? instrumentInfo.Quote.Ask:0.0;
            this.Bid = instrumentInfo.Quote.Bid ? instrumentInfo.Quote.Bid:0.0;
            this.Symbol = instrumentInfo.DisplayAndFormat.Symbol;
            this.orderRequestParams = JSON.stringify(this.currentOrder, null, 3)
                                            .replace(/&/g, '&amp;')
                                            .replace(/\\"/g, '&quot;')
                                            .replace(/</g, '&lt;')
                                            .replace(/>/g, '&gt;') + '\n';
        }

        return (
            <div>
            <Panel header={pnlHeader} className="panel-primary">
            <Form>
                <FormGroup>
                <Row>
                    <Col sm={3}>
                        <ControlLabel >Instrument (UIC: {this.currentOrder.Uic})</ControlLabel>
                        <FormControl readOnly="readOnly" type="text" placeholder="Symbol" value={this.Symbol} />
                    </Col>
                    <Col sm={3}>
                        <ControlLabel >AssetType</ControlLabel>
                        <FormControl readOnly="readOnly" type="text" placeholder="AssetType" value={this.currentOrder.AssetType} />
                    </Col>
                    <Col sm={3}>
                        <ControlLabel>Ask Price</ControlLabel>
                        <FormControl type="text" readOnly="readOnly" placeholder="Ask Price" value={this.Ask}/>
                    </Col>
                    <Col sm={3} >
                        <ControlLabel>Bid Price</ControlLabel>
                        <FormControl type="text" readOnly="readOnly" placeholder="Bid Price" value={this.Bid}/>
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
                    <FormControl componentClass="select" value={this.currentOrder.OrderType} onChange={this.onSelectOrderType.bind(this)} >
                        <option value="Market">Market</option><option value="Limit">Limit</option>
                    </FormControl>
                </Col>
                <Col sm={3} >
                    <ControlLabel>Order Duration</ControlLabel>
                    <FormControl componentClass="select" value={this.currentOrder.Duration} onChange={this.onSelectOrderDuration.bind(this)}>
                        <option value="DayOrder">DayOrder</option>
                    </FormControl>
                </Col>
                </Row>
                </FormGroup>

                <FormGroup  bsSize="large">
                <Row>
                <Col sm={12} >
                    <ControlLabel bsStyle="default"><h3>Request Parameters:</h3></ControlLabel>
                    <FormControl componentClass="textarea" placeholder="textarea" rows={6} value={this.orderRequestParams} onChange={this.onChangeRequestParams.bind(this)} />
                </Col>
                </Row>
                </FormGroup>
                <FormGroup>
                <Col smOffset={9} sm={3}><Button bsStyle="primary" block  onClick={this.placeOrder.bind(this)}>Place Order</Button></Col>
                </FormGroup>
            </Form>
            </Panel>
            </div>);
    }
}
