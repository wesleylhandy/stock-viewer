var mongodb = require('mongodb');

function StateDAO(collection) {
    "use strict";
    this.collection = collection;
}

StateDAO.prototype.addToState = function(symbol, callback) {
    try {
        this.collection.insertOne({ symbol })
    } catch (err) {
        return callback(err, null)
    }

    callback(null, true);
}

StateDAO.prototype.removeFromState = function(symbol, callback) {
    try {
        this.collection.deleteOne({ symbol })
    } catch (err) {
        return callback(err, null)
    }

    callback(null, true);
}

StateDAO.prototype.getState = function(callback) {

    const cursor = this.collection.find({});
    cursor.sort({ symbol: 1 });
    cursor.toArray(function(err, docs) {
        if (err) {
            return callback(err, null)
        }
        callback(null, docs);
    })
}

module.exports.StateDAO = StateDAO;