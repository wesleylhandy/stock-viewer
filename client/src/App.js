import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import {getUpdatedStockList} from './utils/helpers.js';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      stocks: []
    }
    this.showStocks = this.showStocks.bind(this);
    this.getStocks = this.getStocks.bind(this);
  }
  getStocks = () => {
    getUpdatedStockList().then(response => {
      const stocks = response.stocks;
      this.setState({stocks})
    }).catch(err=>console.error(err));
  }
  showStocks = (stocks) => {
    return stocks.map(stock=> (
      <li key={stock._id}>
        <div>
          <h3>{stock.name}</h3>
          <h1>{stock.symbol}</h1>
        </div>
      </li>
    ))
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <button onClick={this.getStocks}>Click me!</button>
        <ul>
          {this.showStocks(this.state.stocks)}
        </ul>
      </div>
    );
  }
}

export default App;
