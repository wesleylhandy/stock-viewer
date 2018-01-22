import React, {Component} from 'react';
import {Line, defaults} from 'react-chartjs-2';

import moment from 'moment';

defaults.global.animation = false;
defaults.global.showLines = false;

const options = {
  responsive: true,
  scales: {
    xAxes: [{
      type: 'time',
      distribution: 'series',
      bounds: 'data',
      ticks: {
        source: 'auto'
      },
      time: {
        unit: 'month',
        minUnit: 'month',
        stepSize: 1,
        displayFormats: {
          month: 'MMM YYYY'
        },
        toolTipFormat: "MMM Do YYYY"
      },
      scaleLabel: {
        display: true
      }
    }],
    yAxes: [{
      display: true,
      scaleLabel: {
        display: true,
      },
      ticks: {
          suggestedMin: 5,
          suggestedMax: 200
      }
    }]
  },
  tooltips: {
    mode: 'index',
    intersect: false,
    bodySpacing: 5,
    titleSpacing: 3,
    position: 'nearest',
    itemSort: function(a, b, data){ return a.y - b.y},
    callbacks: {
      title: function(tooltipItem, chart) {
        return moment(tooltipItem.xLabel).format('MMM Do YYYY')
      }
    }
  },
  hover: {
    mode: 'x',
    intersect: true
  }
}

export default class StockChart extends Component{
  constructor(props){
    super(props);
    this.state = {
      stocks: props.stocks,
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
      labels: this.state.labels,
      datasets: this.state.datasets,
    }
    return (
      <div>
        <Line data={data} options={options} redraw/>
      </div>
    );
  }
}