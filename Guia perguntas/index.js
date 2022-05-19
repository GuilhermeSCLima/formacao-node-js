const express = require("express") //importação do modulo
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const Pergunta = require('./database/Perguntas')
const Respostas = require('./database/Repostas')
const pergunta = require("./database/Perguntas")
    //database

connection
    .authenticate()
    .then(() => {
        console.log("conexão feita com o banco de dados")
    })
    .catch((err) => {
        console.log(err)
    })

//Estou dizendo para o express usar o EJS como View engine
app.set('view engine', 'ejs')
app.use(express.static('public'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get("/", function(req, res) {
    Pergunta.findAll({
        raw: true,
        order: [
            ['id', 'DESC'] //ASC = Crescente || DESC = decrecente
        ]
    }).then((perg) => {
        res.render("index", {
            Perguntas: perg
        })
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar")
})

app.post("/salvarpergunta", (req, res) => {
    let titulo = req.body.titulo
    let descricao = req.body.descricao

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect("/")
    }).catch((err) => {
        console.log(err);
    })
})

app.get("/pergunta/:id", (req, res) => {
    let id = req.params.id

    Pergunta.findOne({
        where: { id: id }
    }).then((perg) => {
        if (perg != undefined) {

            Respostas.findAll({
                where: { perguntaid: perg.id },
                order: [
                    ['id', 'DESC']
                ]
            }).then((resp) => {
                res.render('pergunta', {
                    pergunta: perg,
                    respostas: resp
                })
            })
        } else {
            res.redirect("/")
        }
    })
})

app.post("/gerarresposta", (req, res) => {
    let corpo = req.body.corpo
    let perguntaId = req.body.pergunta

    Respostas.create({
        corpo: corpo,
        perguntaid: perguntaId
    }).then(() => {
        res.redirect(`/pergunta/${perguntaId}`)
    }).catch((err) => {
        console.log(err)
        res.send("Houve um erro ao enviar sua respsota")
    })
})

app.listen(8080, () => {
    console.log("app online")
})