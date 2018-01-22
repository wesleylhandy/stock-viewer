import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actionCreators from './actions/actions';

import moment from 'moment';

import 'raf/polyfill';
import './styles/index.css';

import Ticker from './Components/Ticker';
import StockSelect from './Components/StockSelect';
import StockChart from './Components/StockChart';
import StockCards from './Components/StockCards';

import { getState } from './utils/helpers'

//client side socket connection
import io from 'socket.io-client'; 
const socket = io();

class App extends Component {
  constructor(props){
    super(props);
    this.state ={
      stocks: [],
      previousSession: moment(props.date.previousSession, 'YYYY-MM-DD'),
      ...props
    }
    socket.on('new-save', stock => {
      // console.log({stock})
      props.addStock(stock.stock)
    });
    socket.on('new-delete', stock => {
      // console.log({stock})
      props.removeStock(stock.stock)
    });
  }

  componentDidMount(){
    this.props.addCurrentDate(moment().format('YYYY-MM-DD'))
    getState().then(response=>{
      const symbols = response.symbols;
      this.props.updateStocks(symbols);
    }).catch(err=>console.error(err))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.date.previousSession !== this.state.previousSession) {
      this.setState({previousSession: moment(nextProps.date.previousSession, 'YYYY-MM-DD')});
    }
  }
  
  render() {
    return (
      <div className="App">
        <div className="ticker-wrap">
          <Ticker {...this.props}/>
        </div>
        <div>Previous Trading Session - {moment(this.state.previousSession).format('MMM Do, YYYY')}</div>
        <main>
          <StockChart {...this.props}/>
          <StockSelect label='Search For Stock' {...this.props}/>
          <StockCards {...this.props}/>
        </main>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    date: state.date,
    stocks: state.stocks
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const Main = connect(mapStateToProps, mapDispatchToProps)(App);

export default Main;
