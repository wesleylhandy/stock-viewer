import React from 'react';
import StockCard from './StockCard';

export default function StockCards(props) {
  return <div>{props.stocks.map((stock, i)=><StockCard key={i} symbol={stock.symbol} {...props}/>)}</div>
}