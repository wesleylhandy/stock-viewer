import React, {Component} from 'react';
import fetch from 'isomorphic-fetch';
import moment from 'moment';

import { removeSymbolFromState } from '../utils/helpers'

import io from 'socket.io-client'; 
const socket = io(); 

export default class StockCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      latestPrice: 0.00,
      latestSource: '',
      latestTime: '',
      stock: props.stock,
      color: props.color
    }
    this.getLatestPrice = this.getLatestPrice.bind(this)
    this.handleRemove = this.handleRemove.bind(this)
    this.handleRefresh = this.handleRefresh.bind(this)
  }

  componentDidMount() {
    this.getLatestPrice(this.props.stock.symbol)
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.color !== this.state.color) {
      this.setState({color: nextProps.color})
    }
  }

  getLatestPrice(symbol){
    // console.log(symbol)
    fetch(`https://api.iextrading.com/1.0/stock/${symbol}/quote`).then(response=>response.json()).then(json=>{
      this.setState({latestPrice: json.latestPrice, latestSource: json.latestSource, latestTime: json.latestUpdate, isLoading: false})
    })
  }

  handleRemove(e){
    e.preventDefault();
    // console.log({RemoveValue: this.refs.removeBtn.value})
    const symbol = this.refs.removeBtn.value;
    // update state in db, tell other clients to remove this stock
    removeSymbolFromState(symbol).then(response=>{
      socket.emit('remove-event', {stock: symbol});
    }).catch(err=>console.error(err));
  }

  handleRefresh(e){
    e.preventDefault();
    this.setState({isLoading: true})
    const symbol = this.refs.refreshBtn.value;
    this.getLatestPrice(symbol)
  }

  render() {
    const style = {
      color: this.state.color
    }
    return (
      <div className='stock-card'>
        <div className='stock-card__info-group'> 
          <div className="stock-card__symbol" style={style}>{this.state.stock.symbol}</div>
          <div className="stock-card__name">{this.state.stock.companyName}</div>
        </div>
        <div className='stock-card__info-group'>
          <div className="stock-card__previous-price">Last Price: <span className='price'>{this.state.latestPrice}</span></div>
          <div className="stock-card__previous-price--date">{moment(this.state.latestTime).format('hh:MM A, MMM Do, YYYY')}</div>
        </div>
        <div className="stock-card__ceo">CEO: {this.state.stock.CEO}</div>
        <div className="stock-card__company-desc">{this.state.stock.description}</div>
        <a href={this.state.stock.website} target="_blank">{this.state.stock.website}</a>
        <button className='remove-btn' onClick={this.handleRemove} ref='removeBtn' value={this.state.stock.symbol}>X</button>
        <button className='refresh-btn' onClick={this.handleRefresh} ref='refreshBtn' value={this.state.stock.symbol}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512.333 512" width='12px' className={this.state.isLoading ? 'refresh loading' : 'refresh'}>
            <path d="M500.333 0h-47.411c-6.853 0-12.314 5.729-11.986 12.574l3.966 82.759C399.416 41.899 331.672 8 256.001 8 119.34 8 7.899 119.526 8 256.187 8.101 393.068 119.096 504 256 504c63.926 0 122.202-24.187 166.178-63.908 5.113-4.618 5.354-12.561.482-17.433l-33.971-33.971c-4.466-4.466-11.64-4.717-16.38-.543C341.308 415.448 300.606 432 256 432c-97.267 0-176-78.716-176-176 0-97.267 78.716-176 176-176 60.892 0 114.506 30.858 146.099 77.8l-101.525-4.865c-6.845-.328-12.574 5.133-12.574 11.986v47.411c0 6.627 5.373 12 12 12h200.333c6.627 0 12-5.373 12-12V12c0-6.627-5.373-12-12-12z"/>
          </svg>
        </button>
      </div>
    )
  }
}