import { callbackify } from 'util';

var MongoClient = require('mongodb').MongoClient,
assert = require('assert');

function StateDAO(database) {
"use strict";

    this.db = database;

    this.updateState = function(symbol, callback) {
        const stateCollection = this.db.collection('state');
        
        try {
            stateCollection.insertOne(symbol)
        } catch(err){
            return callback(err, null)
        }

        callback(null, true);
    }

    this.getState = function(callback) {
        const stateCollection = this.db.collection('state');

        const cursor = stateCollection.find({});
        cursor.sort({symbol: 1});
        cursor.toArray(function(err, docs){
            if(err) {
                return callback(err, null)
            }
            callback(null, docs);
        })
    }
}

module.exports.StateDAO = StateDAO;