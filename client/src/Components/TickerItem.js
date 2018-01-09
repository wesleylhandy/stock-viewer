import React from 'react';

export default function TickerItem(props) {
  return (
    <div className="ticker__item--details">
      <span className='ticker__item--symbol'>{props.symbol.symbol}</span>
      <span className='ticker__item--opening'>{props.symbol.open}</span>
      <span className='ticker__item--close'>{props.symbol.close}</span>
      <span className={props.symbol.changePercent >= 0 ? 'ticker__item--change positive' : 'ticker__item--change negative'}>{props.symbol.changePercent}%</span>
    </div>
  )
}