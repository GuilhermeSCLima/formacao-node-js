const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const connection = require("./database/database")
const session = require("express-session")

const categoriesController = require("./categories/CategoriesController")
const articlesController = require("./articles/ArticlesController")
const usersController = require("./user/UsersController")

const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./user/User")

//! View engine

app.set('view engine', 'ejs')

//!----------

//! Sessions

app.use(session(
  { secret: "gsaldsgdjahgd", cookie: { maxAge: 1800 * 1000 } }
))

//!---------

//! Static

app.use(express.static("public"))

//!---------

//! Body parser

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//!-----------

//! DATABASE

connection
  .authenticate()
  .then(() => {
    console.log("Conexão bem sucedida")
  })
  .catch((err) => {
    console.log(err)
  })

//!---------

//! Controllers

app.use("/", categoriesController)
app.use("/", articlesController)
app.use("/", usersController)

//!-----------

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4
  }).then((arts) => {
    Category.findAll().then((cats) => {
      res.render("index", { articles: arts, categories: cats })
    })

  })
})

app.get("/:slug", (req, res) => {
  let slug = req.params.slug
  Article.findOne({
    where: {
      slug: slug
    }
  }).then((article) => {
    if (article != undefined) {
      Category.findAll().then((cats) => {
        res.render("article", { article: article, categories: cats })
      })
    } else {
      res.redirect("/")
    }
  }).catch((err) => {
    res.redirect("/")
  })
})

app.get("/category/:slug", (req, res) => {
  let slug = req.params.slug

  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then((cat) => {
    if (cat != undefined) {
      Category.findAll().then((categories) => {
        res.render("index", { articles: cat.articles, categories: categories })
      })
    } else {
      res.redirect("/")
    }
  }).catch((err) => {
    res.redirect("/")
  });
})

app.listen(8080, () => {
  console.log("O servidor está online")
})