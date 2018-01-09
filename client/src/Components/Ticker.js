import React, {Component} from 'react';
import axios from 'axios';

import TickerItem from './TickerItem';

export default class Ticker extends Component {
  constructor(props){
    super(props);
    this.state = {
      symbols: []
    }
  }
  componentDidMount(){
    axios.get('https://api.iextrading.com/1.0/stock/market/previous').then(response=>{
      const stocks = Object.keys(response.data);
      const symbols = stocks.map(stock => {
        return response.data[stock]
      })
      // console.log({symbols})
      this.setState({symbols});
    })
  }

  render(){
    return (
      <div className='ticker'>
        {this.state.symbols.map(symbol => <div className='ticker__item'><TickerItem  key={symbol.symbol} symbol={symbol} /></div>)}
      </div>
    )
    
  }
}