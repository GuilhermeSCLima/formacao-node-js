const sequelize = require('sequelize');
const connection = require("./database")

const pergunta = connection.define("perguntas",{
    titulo:{
        type: sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: sequelize.TEXT,
        allowNull: false
    }
})

pergunta.sync({force: false}).then(() => {}).catch((err) => {
    console.log(err)
})

module.exports = pergunta