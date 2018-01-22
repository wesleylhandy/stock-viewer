export const addStock = symbol => {
    return {
        type: 'ADD_STOCK',
        symbol
    }
}

export const removeStock = symbol => {
    return {
        type: 'REMOVE_STOCK',
        symbol
    }
}

export const updateStocks = symbols => {
    return {
        type: 'UPDATE_STOCKS',
        symbols
    }
}

export const updateStockData = (symbol, data) => {
    return {
        type: 'UPDATE_STOCK_DATA',
        symbol,
        data
    }
}

export const updateStockColor = (symbol, color) => {
    return {
        type: "UPDATE_STOCK_COLOR",
        symbol,
        color
    }
}

export const addPreviousSession = date => {
    return {
        type: 'ADD_PREVIOUS_SESSION',
        date
    }
}

export const addCurrentDate = date => {
    return {
        type: 'ADD_CURRENT_DATE',
        date
    }
}

export const addSearchDates = (startDate, endDate) => {
    return {
        type: 'ADD_SEARCH_DATES',
        startDate,
        endDate
    }
}

export const updateTicker = symbols => {
    return {
        type: 'UPDATE_TICKER',
        symbols
    }
}