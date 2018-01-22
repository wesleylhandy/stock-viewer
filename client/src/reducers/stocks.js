let storedStocks = [],
    newStock = true,
    updateStocks = true;

const stocks = (state = [], action) => {
    switch (action.type) {
        case 'ADD_STOCK':
            storedStocks = state.map(stock => stock.symbol)
            newStock = !storedStocks.includes(action.symbol)
            if (newStock) {
                return [
                    ...state,
                    singleStock(null, action)
                ]
            } else return state;
        case 'REMOVE_STOCK':
            // console.log('RemoveStockReducer', action.symbol)
            // console.log({newState: [
            //     ...state.filter(stock => stock.symbol !== action.symbol)
            // ]})
            return [
                ...state.filter(stock => stock.symbol !== action.symbol)
            ]
        case 'UPDATE_STOCKS':
            // compare stored state to database state and update store
            storedStocks = state.map(stock => stock.symbol).sort().join('')
            updateStocks = storedStocks !== action.symbols.sort().join('')
            if (updateStocks) {
                return [
                    ...action.symbols.map(symbol => singleStock(null, { type: "ADD_STOCK", symbol }))
                ]
            } else return state;
        case 'UPDATE_STOCK_COLOR':
        case 'UPDATE_STOCK_DATA':
            return [
                ...state.map(stock => stock.symbol === action.symbol ? singleStock(stock, action) : stock)
            ]
        default:
            return state;
    }
}

const singleStock = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_STOCK':
            return {
                ...state,
                symbol: action.symbol
            }
        case 'UPDATE_STOCK_DATA':
            return {
                ...state,
                data: [...action.data]
            }
        case "UPDATE_STOCK_COLOR":
            return {
                ...state,
                color: action.color
            }
        default:
            return state;
    }
}

export default stocks;