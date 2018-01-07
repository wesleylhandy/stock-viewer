var MongoClient = require('mongodb').MongoClient,
assert = require('assert');


function SymbolDAO(database) {
"use strict";

    this.db = database;

    this.getSymbols = function(callback) {
        const symbolCollection = this.db.collection('sybmol');
        const cursor = symbolCollection.find({});
        cursor.sort({symbol: 1});
        cursor.toArray(function(err, docs){
            if(err) {
                return callback(err, null)
            }
            callback(null, docs);
        })
    }

    this.insertSymbols = function(symbols, callback) {

        const symbolCollection = this.db.collection('sybmol');
        const promises = [];
        symbols.forEach(function(symbol){
            promises.push(new Promise(function(resolve, reject){
                symbolCollection.findOneAndUpdate({symbol: symbol._id}, {
                    symbol: symbol._id,
                    iexId: symbol.iexId,
                    name: symbol.name,
                    type: symbol.type
                },{
                    upsert: true,
                    returnOriginal: false
                }, function(err, result) {
                    if (err) {
                        return reject(err)
                    }
                    resolve(result.value)
                })
            }))
        })
        Promise.all(promises).then(function(values){
            callback(null, values);
        }).catch(function(err){
            callback(err, null);
        })

    }
}

module.exports.SymbolDAO = SymbolDAO;