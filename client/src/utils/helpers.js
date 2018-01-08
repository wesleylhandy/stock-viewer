import axios from 'axios';

export function getUpdatedStockList() {
    console.log('called symbols update api');
    return new Promise((resolve, reject) => {
        axios.get('/api/symbols/all/updated').then(response => resolve(response.data)).catch(err => reject({ location: 'getUpdatedStockList', err }))
    })
}