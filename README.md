# stock-viewer
MERN Stack Application with Web Sockets to display Graphic Representations of Stock Data

This application is a visual representation of historical as well as near-real-time data from the Investors Exhange [IEX API](https://iextrading.com/). Any user can search from over 8500 stock listings to view a particular stock's performance over the past 12 months and compare it to any other number of stocks. :chart_with_upwards_trend: :chart_with_downwards_trend: :date:

## Features

#### Stock Ticker :money_with_wings:
The page has a running ticker that cycles through the stock prices of the previous trading period at the close of business.

#### Stock Chart :chart_with_upwards_trend:
Add stocks using the Stock Search and hover over the chart to get a readout of the stock value at the close of business on a given day.

#### Stock Search :dollar:
Autofilled Search Bar of all the listings in the IEX database. Works best when searching by Company Name. You can search by Stock Symbol, but be prepared to have to scroll to find the particular symbol.

#### Stock Cards :moneybag:
Color-coded cards to match the chart, includes the most recent trading price (within the hour, or day, if after hours), the name of the CEO, description of the company and a link to their website.

## Technology

* React - the front is was built with `create-react-app`, also utilizing `react-chartjs-2` for the chart, `moment` for representing time, `isomorphic-fetch` for making front-end api calls, `redux` for state management, and `socket.io` for managing state across instances.

* MongoDB - the backend is only used for persisting state over time across instances. Using version 3.0 of Node.js api.

* Node + Express + Socket.io - keeping it real on the back end with node.

### Lessons Learned

#### Managing State, Props, Keys, and Sockets

Much of the application was straight forward. Initially, I struggled setting up MongoDB until I realized they updated their API. In the end, I didn't use the backend but to store an array of symbols representing the application state. Redux was easy to implement here. The biggest struggle came with utilizing websockets. Initially, I was mistakenly closing my socket connection when a particular component was unmounting, and I was also not allowing some components to unmount because I was changing state upon listening for changes to the props. 

Imagine this scenario:

```javascript

    //import socket.io and call new instance

    function List (props) => {
        let data = [...props.data];

        return <div>data.map((datum, index)=><ListItem key={index} datum={datum} {...props}>)</div>
    }

    class ListItem extends Component {
        constructor(props){
            super(props);
            this.state = {
                datum: props.datum
            }
        }
        componentWillReceiveProps(nextProps) {
            this.setState({datum: nextProps.datum});
        }

        componentWillUnmount(){
            //close instance
            socket.close();
        }
        render() {
            return <div>{this.state.datum}</div>
        }
    }
```

##### There are a few problems with this scenario. 

1. It is [very unwise](https://medium.com/@robinpokorny/index-as-a-key-is-an-anti-pattern-e0349aece318) to set Index as the key for a mapped React Component. 
2. In the above scenario, if you had some sort of event listener on your ListItem where a user could click to close, rather than allowing that ListItem to be completely unmounted, it gets redefined based whatever items remain in the original data list. In my case, I found that I was unable to ever remove the last list element.
3. As it came to my socket connections, `.close` shut off all my sockets, causing numerous errors in my application, including a very weird React lifecycle error claiming I was setting state eithe before a component was mounted or after it was unmounted, which is a React no-no. This was because my application was setting keys improperly and because I was calling `setState` every time I was receiving new props.

##### How did I fix the problem?

1. I used a unique identifier for my key definition. I used a combination of data and index, though another great solution would be to use something like `shortid` npm package. I used ```key={`card-${index}-${datum.symbol}`}```
2. I removed both lifecycle events `componentWillReceiveProps` and `componentWillUnmount`. In my case, I didn't need either of them. I was not updating anything for that particular item on change of props, so removing this event listener enabled removed items to completely unmount. And by not closing the socket on unmount, not only did that particular connection die, the rest of my sockets stayed alive.

#### Chart.js Complexity

I decided to use the npm package [`react-chartjs-2`](https://github.com/jerairrest/react-chartjs-2) since I had used it before and I didn't do an extensive search of other implementations of Chart.js in React for new versions of Chart.js. The problem was the complexity I was looking to integrate in my project seemed to go beyond the documentation for either the npm package or the Chart.js docs themselves. 

Initially, I was setting up my data and options as a single object to be passed into my Line chart. 

```javascript
render() {
    const data = {
      labels: this.state.labels,
      datasets: this.state.datasets,
      options: this.state.options
    }
    return (
      <div>
        <Line data={data} redraw/>
      </div>
    );
  }
```

It took over a week of banging my head against a wall not being able to get any of my options to work propery before I realized a simple fix, pass in my options as a separate property of the `<Line>` Component.

```javascript
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
```

This simple change opened new doors to me in crafting my own custom tooltips and managing labels properly. The problem with many forms of documentation is that often you are trying to do something that goes beyond simply getting the initial state to render. Documentation may go beyond this textually, but most of the examples you can find only show the simple implementation of initial state.

I loved chasing down the answer. I learned more about `Chart.js` than I have used thus far chasing down my issue. But I'm keeping this struggle in mind as I write documentation in the future.