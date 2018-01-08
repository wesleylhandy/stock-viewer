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

SymbolDAO.prototype.confirmSymbol = function(symbol) {
    const self = this;
    return new Promise(function(resolve, reject) {
        self.collection.findOne({ symbol: symbol.symbol })
            .then(function(doc) {
                if (!doc) {
                    resolve({
                        insertOne: { "document": symbol }
                    })
                } else {
                    resolve(null)
                }
            })
            .catch(function(err) {
                reject(err)
            });
    })

}

SymbolDAO.prototype.insertSymbols = function(symbols, callback) {
    console.log('insert Symbols function called')
    const self = this;
    const promises = symbols.map(function(symbol) {
        return self.confirmSymbol(symbol)
    })
    Promise.all(promises).then(function(allValues) {
        const fullValues = allValues.filter(function(value) {
            return value
        });
        if (fullValues.length) {
            self.collection.bulkWrite(filtered).then(function(res) {
                callback(null, res);
            }).catch(function(err) {
                console.error({ bulkWriteErr: err })
                callback(err, null);
            })
        } else {
            callback(null, []);
        }
    });
}

module.exports.SymbolDAO = SymbolDAO;