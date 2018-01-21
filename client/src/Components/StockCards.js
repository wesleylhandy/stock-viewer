import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

import StockCard from './StockCard';

export default class StockCards extends Component {
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks,
      stocksData: []
    }
    this.fetchStocksData = this.fetchStocksData.bind(this);      
  }
  componentDidMount(){
    this.fetchStocksData(this.props.stocks);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stocks.length === 0) {
      return this.setState({stocks: [], stocksData: []})
    }
    if (nextProps.stocks.join() !== this.state.stocks.join()) {
      this.fetchStocksData(nextProps.stocks)
    }
  }

  fetchStocksData(stocks) {
    const promises = [];
    // console.log(stocks)
    stocks.forEach(stock => {
      promises.push(fetch(`https://api.iextrading.com/1.0/stock/${stock.symbol}/company`).then(response=> response.json()))
    })
    Promise.all(promises).then(stocksData=> {
      // console.log({stocksData})
      this.setState({stocksData})
    }).catch(err=>console.error({fetchCompanyDataErr: err}))
  }

  render(){
    return <div className='stock-cards'>{this.state.stocksData.map((stock, i)=><StockCard key={`card-${stock.symbol}`} stock={stock} {...this.props}/>)}</div>
  }
  
}