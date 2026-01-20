const sqlite3 = require('sqlite3');
const{open} = require('sqlite');
const path = require('path');
require('dotenv').config();


async function connectDb() {
    return open({
        filename: path.resolve(__dirname, '..', 'database.sqlite'),
        driver: sqlite3.Database
    });
}

module.exports = connectDb;