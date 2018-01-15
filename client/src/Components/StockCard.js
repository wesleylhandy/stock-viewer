import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';
import io from 'socket.io-client'; 

export default class StockCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      latestPrice: 0.00,
      latestSource: '',
      latestTime: '',
      stock: props.stock
    }
    this.getLatestPrice = this.getLatestPrice.bind(this)
  }

  componentDidMount() {
    this.getLatestPrice(this.props.stock.symbol)
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.symbol !== this.state.stock.symbol) {
      this.setState({stock: nextProps.stock})
      this.getLatestPrice(nextProps.stock.symbol)
    }
  }

  getLatestPrice(symbol){
    // console.log(symbol)
    fetch(`https://api.iextrading.com/1.0/stock/${symbol}/quote`).then(response=>response.json()).then(json=>{
      this.setState({latestPrice: json.latestPrice, latestSource: json.latestSource, latestTime: json.latestTime})
    })
  }

  render() {
    return (
      <div className='stock-card'>
        <div className="stock-card__symbol">{this.state.stock.symbol}</div>
        <div className="stock-card__name">{this.state.stock.companyName}</div>
        <div className="stock-card__previous-price">{this.state.latestPrice}</div>
        <div className="stock-card__previous-price--date">{this.state.latestTime}</div>
        <div className="stock-card__ceo">{this.state.stock.CEO}</div>
        <div className="stock-card__company-desc">{this.state.stock.description}</div>
        <a href={this.state.stock.website} target="_blank">{this.state.stock.website}</a>
      </div>
    )
  }
}