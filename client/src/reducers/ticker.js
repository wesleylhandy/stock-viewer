const ticker = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_TICKER":
            return [
                ...action.symbols
            ]
        default:
            return state;
    }
}

export default ticker;