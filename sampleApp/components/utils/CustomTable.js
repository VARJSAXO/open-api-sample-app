import React from 'react';
import { map } from 'lodash'
import { Table } from 'react-bootstrap';

export default class CustomTable extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
            <Table striped bordered condensed hover>
                <thead>
                    <tr>
                        {map(this.props.cols, (col) =>
                             <th key={col.key}> {col.label} </th>)}
                    </tr>
                </thead>
                <tbody>
                    { this.props.Data ?
                        (map(this.props.Data, (item)=>
                        <tr>
                          { map(this.props.cols, (col) => <td className={ this.props.cellcolor } >{ item[col.key] }</td>)}
                        </tr>)
                        ):null
                    }
              </tbody>
          </Table>
        );
    }
}