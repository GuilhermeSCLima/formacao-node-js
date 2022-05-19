const sequelize = require('sequelize');
const connection = require("./database")

const Respostas = connection.define("respostas", {
    corpo: {
        type: sequelize.TEXT,
        allowNull: false
    },
    perguntaid: {
        type: sequelize.INTEGER,
        allowNull: false
    }
})

Respostas.sync({ force: false })

module.exports = Respostas