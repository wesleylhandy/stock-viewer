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

export const updateStockData = (symbol, data) => {
    return {
        type: 'REMOVE_STOCK',
        symbol,
        data
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