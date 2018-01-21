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
        responsive: true,
        scales: {
          xAxes: [{
            display: false,
            type: 'time',
            unit: 'day',
            displayFormats: {
              month: 'MMM D YYYY'
            },
            toolTipFormat: 'MMM D YYYY',
            distribution: 'series',
            bounds: 'data',
            ticks: {
              source: 'data'
            },
            scaleLabel: {
              display: true,
              labelString: 'Month'
            }
          }],
          yAxes: [{
            display: true,
            scaleLabel: {
              display: true,
            },
            ticks: {
                suggestedMin: 5,
                suggestedMax: 1000
            }
          }]
        },
        tooltips: {
          mode: 'index',
          axis: 'x',
          intersect: false,
          position: 'average',
          callbacks : {
            label: function(tooltipItem, data) {
              return tooltipItem.xLabel
            }
          }
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
    if(nextProps.stocks.length === 0) {
      return this.setState({datasets: [], stocks: []})
    }
    if(nextProps.stocks.join() !== this.state.stocks.join() || nextProps.stocks.length !== this.state.stocks.length) {
      this.setState({stocks: nextProps.stocks, datasets: []})
      nextProps.stocks.forEach((stock, ind, arr)=>{
        const color = `hsla(${((360 / arr.length) * ind) + 20}, 100%, 45%, 0.9)`
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
        const labels = data.map(label => moment(label.x).format('MMMM YYYY'));
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
        this.setState({datasets, labels})
      })
  }
  getData(e){
    console.log({e: e})
    if(e.length) {
      let values = e.map(el=>{return {datasetIndex: el._index, value: el._model.y}})
      let chart = e[0]._chart;
      let ctx = chart.ctx;
      console.log({values})
    }
  }
  render() {
    const data = {
      labels: this.state.labels,
      datasets: this.state.datasets,
      options: this.state.options
    }
      return (
        <div>
          <Line data={data} getElementsAtEvent={this.getData}/>
        </div>
      );
  }
}