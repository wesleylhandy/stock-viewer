import React, { Component } from 'react';
import StockCard from './StockCard';
import io from 'socket.io-client'; 

// const socket = io('https://ws-api.iextrading.com/1.0/tops'); 

export default class StockCards extends Component {
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks
    }

    // socket.on('message', message => console.log(message))
      
  }
  componentDidMount(){
    // socket.emit('subscribe', this.props.stocks.map(stock=>stock.symbol).join())
  }

  render(){
    return <div>{this.state.stocks.map((stock, i)=><StockCard key={i} symbol={stock.symbol} {...this.props}/>)}</div>
  }
  
}