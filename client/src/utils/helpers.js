import axios from 'axios';

export function getUpdatedStockList() {
    console.log('called symbols update api');
    return new Promise((resolve, reject) => {
        axios.get('/api/symbols/all/updated').then(response => resolve(response.data)).catch(err => reject({ location: 'getUpdatedStockList', err }))
    })
}

export function getState() {
    console.log('called get state api')
    return new Promise((resolve, reject) => {
        axios.get('/api/state/all').then(response => resolve(response.data)).catch(err => reject({ location: 'getState', err }))
    })
}

export function addSymbolToState(symbol) {
    console.log('called state update api');
    return new Promise((resolve, reject) => {
        axios.post('/api/state/add/', { symbol }).then(response => resolve(response.data)).catch(err => reject({ location: 'addSymbolToState', err }))
    })
}

export function removeSymbolFromState(symbol) {
    console.log('called state update api');
    return new Promise((resolve, reject) => {
        axios.put('/api/state/remove/', { symbol }).then(response => resolve(response.data)).catch(err => reject({ location: 'removeSymbolFromState', err }))
    })
}