const stocks = (state = [], action) => {
    switch (action.type) {
        case 'ADD_STOCK':
            return [
                ...state,
                singleStock(null, action)
            ]
        case 'REMOVE_STOCK':
            // console.log('RemoveStockReducer', action.symbol)
            // console.log({newState: [
            //     ...state.filter(stock => stock.symbol !== action.symbol)
            // ]})
            return [
                ...state.filter(stock => stock.symbol !== action.symbol)
            ]
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
                symbol: action.symbol
            }
        case 'UPDATE_STOCK_DATA':
            return {
                data: [...action.data]
            }
        default:
            return state;
    }
}

export default stocks;