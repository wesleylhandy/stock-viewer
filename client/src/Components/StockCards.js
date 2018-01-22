import React, { Component } from 'react';
import fetch from 'isomorphic-fetch';

import StockCard from './StockCard';

export default class StockCards extends Component {
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks,
      stocksData: [],
      colorUpdate: false
    }
    this.fetchStocksData = this.fetchStocksData.bind(this);
    this.getStockColor = this.getStockColor.bind(this);      
  }
  componentDidMount(){
    this.setState({ stocks: this.props.stocks, colorUpdate: true })
    this.fetchStocksData(this.props.stocks);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.stocks.length === 0) {
      return this.setState({stocks: [], stocksData: []})
    }
    const newSymbols = nextProps.stocks.map(stock=> stock.symbol);
    const oldSymbols = this.state.stocks.map(stock=> stock.symbol)
    if (newSymbols.sort().join('') !== oldSymbols.sort().join('') || nextProps.stocks.length !== this.state.stocks.length) {
      this.setState({stocks:nextProps.stocks, colorUpdate: true})
      return this.fetchStocksData(nextProps.stocks)
    }
    const newColors = nextProps.stocks.map(stock => stock.color);
    const oldColors = this.state.stocks.map(stock => stock.color);
    if (newColors.sort().join('') !== oldColors.sort().join('')) {
      return this.setState({ stocks: nextProps.stocks, colorUpdate: true })
    }
    this.setState({colorUpdate: false})
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

  getStockColor(stocks, symbol){
    const filtered = stocks.filter(stock => stock.symbol === symbol)
    return filtered.length ? filtered[0].color : null
  }

  renderStockCards(stocks, stocksData, colorUpdate, props) {
    return stocksData.map((stock, i) => {
      const stockColor = this.getStockColor(stocks, stock.symbol)
      return (
        <StockCard
          key={`card-${i}-${stock.symbol}`}
          stock={stock}
          color={stockColor}
          {...props}
        />
      )
    })
  }

  render(){
    return <div className='stock-cards'>
      { this.renderStockCards(this.state.stocks, this.state.stocksData, this.state.colorUpdate, {...this.props}) }
    </div>
  }
  
}