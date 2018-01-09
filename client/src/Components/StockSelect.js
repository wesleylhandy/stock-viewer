// NEEDS WORK!!!!!

import React, {Component} from 'react';

import fetch from 'isomorphic-fetch';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class StockSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      backspaceRemoves: true,
      multi: false,
      creatable: false,
      value: ''
    }
    this.onChange = this.onChange.bind(this);
    this.getStocks = this.getStocks.bind(this);
  }
  onChange = value => {
    this.setState({
      value: value,
    });
  }
  getStocks(input) {
    if (!input) {
      return Promise.resolve({ options: [] });
    }

    return fetch(`https://api.iextrading.com/1.0/stock/${input}/company`)
      .then(response => response.json())
      .then(json => {
        console.log({json})
        // return { options: json.companyName };
      });
  }

  getStockData(value, event) {
    fetch(`https://api.iextrading.com/1.0/stock/${value.symbol}/chart/1y`)
      .then(response => response.json())
      .then(json => {
        console.log({json})
      })
  }

  render() {
    const AsyncComponent = this.state.creatable
      ? Select.AsyncCreatable
      : Select.Async;

    return (
      <div className="section">
        <h3 className="section-heading">{this.state.label}</h3>
        <AsyncComponent multi={this.state.multi} value={this.state.value} onChange={this.onChange} onValueClick={this.gotoUser} valueKey="id" labelKey="login" loadOptions={this.getStocks} backspaceRemoves={this.state.backspaceRemoves} />
      </div>
    );
  }

}