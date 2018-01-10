import React, { Component } from 'react';
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

        </header>

        <StockSelect label='Search For Stock'/>

        <div className="ticker-wrap">
          <Ticker />
        </div>
      </div>
    );
  }
}

export default App;
