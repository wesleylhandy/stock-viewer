var mongodb = require('mongodb');

const SymbolDAO = function(collection) {
    "use strict";
    this.collection = collection;
}

SymbolDAO.prototype.getSymbols = function(callback) {
    const cursor = this.collection.find({});
    cursor.sort({ symbol: 1 });
    cursor.toArray(function(err, docs) {
        if (err) {
            return callback(err, null)
        }
        callback(null, docs);
    })
}

SymbolDAO.prototype.getSymbol = function(symbol, callback) {
    this.collection.findOne({ symbol: symbol.symbol })
        .then(function(doc) {
            callback(null, doc)
        })
        .catch(function(err) {
            callback(err, null)
        });

}

SymbolDAO.prototype.insertSymbols = function(symbols, callback) {
    console.log('insert Symbols function called')
    const self = this;
    //get all symbols from DB and compare to new collection of symbols from API and call a bulkwrite if any new symbols are found
    self.getSymbols(function(err, dbSymbols) {
        const currentSymbols = dbSymbols.map(function(dbSymbol) {
            return dbSymbol.symbol
        });
        //store new symbols as an array of promises to enable one call to db via bulkwrite
        const promises = symbols.map(function(symbol) {
            // console.log({ currentSymbol: currentSymbols.includes(symbol.symbol), symbol: symbol.symbol })
            if (!currentSymbols.includes(symbol.symbol)) {

                return new Promise(function(resolve) {
                    resolve({ insertOne: { "document": symbol } })
                })
            }
        }) || [];
        Promise.all(promises).then(function(allValues) {
            //filter out null or undefined values
            const fullValues = allValues.filter(function(value) {
                return value
            });
            //only call bulkwrite if any values returned
            if (fullValues.length) {
                self.collection.bulkWrite(fullValues).then(function(res) {
                    callback(null, res);
                }).catch(function(err) {
                    console.error({ bulkWriteErr: err })
                    callback(err, null);
                })
            } else {
                callback(null, []);
            }
        });
    })
}

module.exports.SymbolDAO = SymbolDAO;