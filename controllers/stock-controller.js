import { StateDAO } from '../models/state';
import { PromiseProvider } from 'mongoose';

const assert = require('assert');
const router = require('express').Router();
const axios = require('axios');

//initialize MongoDB client
const MongoClient = require('mongodb').MongoClient
const uri = process.env.MLAB_URI || 'mongodb://localhost:27017/devstocks';
const SymbolDAO = require('../models/symbols.js').SymbolDAO;

module.exports = function(app) {
    MongoClient.connect(uri, function(err, db) {
        "use strict";
        //test connection for errors, will stop app if Mongo connection is down on load
        assert.equal(null, err);
        console.log("Somewhere a SQLFairy lost it's wings...Mongo Pokemon Evolved!");

        const symbols = new SymbolDAO(db);
        const appState = new StateDAO(db);

        router.put('/symbols/update', function(req, res){
            axios.get('https://api.iextrading.com/1.0/ref-data/symbols').then(function(response){
                const symbolInsert = response.data.map(function(symbol){
                    return {
                        _id: symbol.symbol,
                        iexId: symbol.iexId,
                        name: symbol.name,
                        type: symbol.type
                    }
                })
                symbols.insertSymbols(symbolInsert, function(err, symbols){
                    if(err) {
                        res.statusCode = 503;
                        return res.json({InsertError: err});
                    }
                    res.json({symbols})
                });
            }).catch(function(err){
                res.statusCode = 500;
                res.json({iexApiError: err})
            })
        })

        router.get('/symbols/all', function(req, res){
            symbols.getSymbols(function(err, symbols){
                if(err) {
                    res.statusCode = 503;
                    return res.json({GetSymbolsError: err});
                }
                res.json({symbols})
            })
        });

        router.post('/state/add/:symbol', function(req, res){
            appState.updateState(req.param.symbol, function(err, success){
                if(err) {
                    res.statusCode = 503;
                    return res.json({getStateError: err})
                }
                res.status(200).send(true);
            })
        })

        router.get('/state/all', function(req, res){
            appState.getState(function(err, symbols){
                if(err) {
                    res.statusCode = 503;
                    return res.json({getStateError: err})
                }
                const promises = [];
                symbols.forEach(function(symbol){
                    promises.push(axios.get(`https://api.iextrading.com/1.0/stock/${symbol.symbol}/chart/1y`).then(function(chart){
                        return Promise.resolve({symbol, chart})
                    }))
                });
                Promise.all(promises).then(function(symbols){
                    res.json({symbols});
                }).catch(function(err){
                    res.statusCode = 500;
                    res.json({iexApiError: err})
                })
            })
        })

        app.use('/api', router);
    });
}