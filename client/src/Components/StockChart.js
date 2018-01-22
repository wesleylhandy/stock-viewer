import React, {Component} from 'react';
import {Line} from 'react-chartjs-2';

import moment from 'moment';

const options = {
  responsive: true,
  scales: {
    xAxes: [{
      type: 'time',
      distribution: 'series',
      bounds: 'data',
      ticks: {
        source: 'labels'
      },
      time: {
        unit: 'month',
        minUnit: 'month',
        stepSize: 1,
        displayFormat: 'MMM YYYY'
      },
      scaleLabel: {
        display: true,
        labelString: 'Trading Days'
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
        labelString:'Stock Price'
      },
      ticks: {
          suggestedMin: 5,
          suggestedMax: 200
      }
    }]
  },
  tooltips: {
    mode: 'x',
    intersect: false,
    bodySpacing: 5,
    titleSpacing: 3,
    position: 'nearest',
    itemSort: function(a, b){ return a.y - b.y},
    callbacks: {
      title: function(tooltipItem, chart) {
        return moment(tooltipItem[0].xLabel, 'YYYY-MM-DD').format('MMM Do YYYY')
      }
    }
  },
  hover: {
    mode: 'x',
    intersect: true
  },
  animation: false
}

export default class StockChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks,
      datasets: []
    }
    this.getStockData = this.getStockData.bind(this);
    this.getLabels = this.getLabels.bind(this);
  }
  componentDidMount(){

    this.props.stocks.forEach((stock, ind, arr)=>{
      const color = `hsla(${((360 / arr.length) * ind) + 20}, 100%, 45%, 0.9)`
      this.props.updateStockColor(stock.symbol, color);
      this.getStockData(stock.symbol, color)
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.stocks.length === 0) {
      return this.setState({datasets: [], stocks: []})
    }
    const newSymbols = nextProps.stocks.map(stock => stock.symbol);
    const oldSymbols = this.state.stocks.map(stock => stock.symbol)
    if (newSymbols.sort().join('') !== oldSymbols.sort().join('') || nextProps.stocks.length !== this.state.stocks.length) {
      this.setState({stocks: nextProps.stocks, datasets: []})
      nextProps.stocks.forEach((stock, ind, arr)=>{
        const color = `hsla(${((360 / arr.length) * ind) + 20}, 100%, 45%, 0.9)`
        this.props.updateStockColor(stock.symbol, color);
        this.getStockData(stock.symbol, color)
      });
    }
  }
  getLabels() {
    const labels = [];
    for (let i = 12; i >= 0; i--) {
      labels.push(moment(this.props.date.currentDate, 'YYYY-MM-DD').subtract(i, 'months'))
    }
    return labels;
  }
  getStockData(symbol, color) {
    fetch(`https://api.iextrading.com/1.0/stock/${symbol}/chart/1y`)
      .then(response => response.json())
      .then(json => {
        const data = json.map(stock=> {
          return {
            x: moment(stock.date, 'YYYY-MM-DD'),
            y: stock.close
          }
        })
        const datasets = this.state.datasets.slice();
        const dataset = {
          label: symbol,
          data: data,
          fill: false,
          lineTension: 0,
          backgroundColor: color,
          borderColor: color,
          pointBorderWidth:1,
          pointHoverRadius: 5,
          pointRadius: 1
        }
        datasets.push(dataset);
        this.setState({datasets})
      })
  }

  render() {
    const data = {
      labels: this.getLabels(),
      datasets: this.state.datasets,
    }
    return (
      <div>
        <Line data={data} options={options}/>
      </div>
    );
  }
}