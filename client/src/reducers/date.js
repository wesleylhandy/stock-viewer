const date = (state = {}, action) => {
    switch (action.type) {
        case 'ADD_PREVIOUS_SESSION':
            return {
                ...state,
                previousSession: action.date
            }
        case 'ADD_CURRENT_DATE':
            return {
                ...state,
                currentDate: action.date
            }
        case 'ADD_SEARCH_DATES':
            return {
                ...state,
                startDate: action.startDate,
                endDate: action.endDate
            }
        default:
            return state;
    }
}

export default date;