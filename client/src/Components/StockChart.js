import React from 'react';

export default function StockChart(props){
  return <div>{JSON.stringify(props.stocks, null, 5)}</div>
}