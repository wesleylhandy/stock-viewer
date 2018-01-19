// NEEDS WORK!!!!!

import React, {Component} from 'react';

import fetch from 'isomorphic-fetch';
import Select from 'react-virtualized-select';
import createFilterOptions from 'react-select-fast-filter-options';
import 'react-select/dist/react-select.css';
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css';

import { addSymbolToState } from '../utils/helpers'

import io from 'socket.io-client'; 
const socket = io(); 

export default class StockSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      label: props.label,
      selectValue: '',
      options: [],
      isLoading: true,
      filteredOptions: []
    }
    this.updateValue = this.updateValue.bind(this);
  }
  componentDidMount() {
    fetch('https://api.iextrading.com/1.0/ref-data/symbols')
      .then(response => response.json())
      .then(json => {
        const options = json.map((stock, i) => {
          return { 
            label: `${stock.symbol} - ${stock.name}`,
            value: stock.symbol
          }
        });

        this.setState({options: options, isLoading: false});
      })
  }
  updateValue = selected => {
    this.setState({
      selectValue: selected
    });
    if(selected.hasOwnProperty('value') && selected.value) {
      const symbol = selected.value;
      addSymbolToState(symbol).then(response=>{
        socket.emit('add-event', {stock: symbol})
      }).catch(err=>console.error(err));
    }
  }

  render() {
    const options = this.state.options;
    const filteredOptions = createFilterOptions({ options });
    return (
      <div className="section">
        <h3 className="section-heading">{this.state.label}</h3>
        <Select   
          filterOptions={filteredOptions}
          options={options}
          isLoading={this.state.isLoading}
          onChange={this.updateValue}
          value={this.state.selectValue}
          placeholder='Search for stock...'
        />
      </div>
    );
  }

}