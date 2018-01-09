import React, { Component } from 'react';
import logo from './logo.svg';
import './styles/index.css';

import Ticker from './Components/Ticker';
import StockSelect from './Components/StockSelect';

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      stocks: []
    }

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
        <StockSelect label='Search For Stock'/>

        <div className="ticker-wrap">
          <Ticker />
        </div>
      </div>
    );
  }
}

export default App;
