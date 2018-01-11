import React, {Component} from 'react';
import {Line, defaults} from 'react-chartjs-2';
import moment from 'moment';

defaults.global.animation = false;
defaults.global.showLines = false;

export default class StockChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks,
      options: {
        scales: {
          xAxes: [{
              type: 'time',
              unit: 'month',
              displayFormats: {
                month: 'MMM YYYY'
              },
              distribution: 'series',
              ticks: {
                source: 'data'
              }
          }],
          yAxes: [{
            ticks: {
                suggestedMin: 5,
                suggestedMax: 1000
            }
          }]
        }
      },
      labels: [],
      datasets: []
    }
    this.getStockData = this.getStockData.bind(this);
  }
  componentDidMount(){
    const labels = [];
    for (let i=11; i >= 0; i--){
      labels.push(moment(this.props.date.currentDate).subtract(i, 'months').format('MMM YYYY'))
    }
    this.setState({labels})
    this.props.stocks.forEach((stock, ind, arr)=>{
      const color = `hsla(${((360 / arr.length) * ind) + 20}, 100%, 45%, 0.9)`
      this.getStockData(stock.symbol, color)
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.stocks.join() !== this.state.stocks.join()) {
      this.setState({stocks: nextProps.stocks})
      nextProps.stocks.forEach(stock=>{
        this.getStockData(stock.symbol)
      });
    }
  }
  getStockData(symbol, color) {
    fetch(`https://api.iextrading.com/1.0/stock/${symbol}/chart/1y`)
      .then(response => response.json())
      .then(json => {
        const data = json.map(stock=> {
          return {
            x: new Date(moment(stock.date, 'YYYY-MM-DD')),
            y: stock.close
          }
        })
        const datasets = this.state.datasets.slice();
        const dataset = {
          label: symbol,
          data: data,
          fill: false,
          pointBorderColor: color,
          borderColor: color
        }
        datasets.push(dataset);
        this.setState({datasets})
      })
  }
  render() {
    const data = {
      labels: this.state.labels,
      datasets: this.state.datasets,
      options: this.state.options
    }
      return (
        <div>
          <h2>Line Example</h2>
          <Line data={data} />
        </div>
      );
  }
}