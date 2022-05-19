require("dotenv").config()

const sequelize = require('sequelize');

const connection = new sequelize('guiaperguntas', 'root', process.env.DBPASS, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = connection