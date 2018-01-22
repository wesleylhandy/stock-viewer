import React, {Component} from 'react';
import axios from 'axios';

import TickerItem from './TickerItem';

export default class Ticker extends Component {
  constructor(props){
    super(props);
    this.state = {
      symbols: [],
      isLoading: true
    }
  }
  componentDidMount(){
    // console.log({thisTicker: this.props})
    axios.get('https://api.iextrading.com/1.0/stock/market/previous').then(response=>{
      const stocks = Object.keys(response.data);
      let date = response.data[stocks[0]].date;
      const symbols = stocks.map(stock => {
        return response.data[stock]
      })
      // this.props.updateTicker(symbols);
      this.setState({symbols, isLoading: false});
      this.props.addPreviousSession(date);
    })
  }

  // componentWillReceiveProps(nextProps){
  //   console.log({nextTicker: nextProps})
  // }

  render(){
    return (
      <div className={this.state.isLoading ? 'ticker' : 'ticker scrolling'}>
        {this.state.symbols.map(symbol => <div key={symbol.symbol} className='ticker__item'><TickerItem symbol={symbol} /></div>)}
      </div>
    )
    
  }
}