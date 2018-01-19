const assert = require('assert');
const router = require('express').Router();
const axios = require('axios');

//initialize MongoDB client
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MLAB_URI || 'mongodb://localhost:27017/devstocks';
const dbName = 'devstocks';
const SymbolDAO = require('../models/symbols.js').SymbolDAO;
const StateDAO = require('../models/state.js').StateDAO;

module.exports = function(app) {
    const client = new MongoClient(uri);

    client.connect(function(err, client) {
        "use strict";
        //test connection for errors, will stop app if Mongo connection is down on load
        assert.equal(null, err);
        assert.ok(client !== null);
        console.log("Somewhere a SQLFairy lost it's wings...Mongo Pokemon Evolved!");

        const db = client.db(dbName);

        const symbolCollection = db.collection('symbol');
        const stateCollection = db.collection('state');

        const symbols = new SymbolDAO(symbolCollection);
        const appState = new StateDAO(stateCollection);

        router.get('/symbols/all/updated', function(req, res) {
            axios.get('https://api.iextrading.com/1.0/ref-data/symbols').then(function(response) {
                const symbolInsert = response.data.map(function(symbol) {
                    return {
                        symbol: symbol.symbol,
                        iexId: symbol.iexId,
                        name: symbol.name,
                        type: symbol.type
                    }
                });

                symbols.insertSymbols(symbolInsert, function(err, newSymbols) {
                    if (err) {
                        res.statusCode = 503;
                        return res.json({ InsertError: err });
                    }
                    console.log('Insert Function added ' + newSymbols.length + ' records.');
                    symbols.getSymbols(function(err, allSymbols) {
                        if (err) {
                            res.statusCode = 503;
                            return res.json({ GetError: err });
                        }
                        console.log('get function returned ' + allSymbols.length + ' records.');
                        res.json({ stocks: allSymbols });
                    })
                });
            }).catch(function(err) {
                res.statusCode = 500;
                res.json({ iexApiError: err })
            })
        })

        router.get('/symbols/all', function(req, res) {
            symbols.getSymbols(function(err, symbols) {
                if (err) {
                    res.statusCode = 503;
                    return res.json({ getSymbolsError: err });
                }
                res.json({ symbols })
            })
        });

        router.post('/state/add/', function(req, res) {
            appState.addToState(req.body.symbol, function(err, success) {
                if (err) {
                    res.statusCode = 503;
                    return res.json({ getStateError: err })
                }
                res.status(200).send(true);
            })
        })

        router.put('/state/remove/', function(req, res) {
            appState.removeFromState(req.body.symbol, function(err, success) {
                if (err) {
                    res.statusCode = 503;
                    return res.json({ getStateError: err })
                }
                res.status(200).send(true);
            })
        })

        router.get('/state/all', function(req, res) {
            appState.getState(function(err, docs) {
                if (err) {
                    res.statusCode = 503;
                    return res.json({ getStateError: err })
                }
                const symbols = docs.map(doc => doc.symbol);
                res.json({ symbols })
            })
        })

        app.use('/api', router);
    });
}