import React from 'react';
import { merge, map } from 'lodash'
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
                        <th key={col.key} > {col.label} </th>)}
                        </tr>
              </thead>
              <tbody>
                {this.props.Data ?
                  (map(this.props.Data, (item)=>
                        <tr key={item.id}>
                          {map(this.props.cols, (col) => <td>{item[col.key]}</td>)}
                        </tr>
                    )
                  ):null
                }
              </tbody>
          </Table>
      );
  }
}
