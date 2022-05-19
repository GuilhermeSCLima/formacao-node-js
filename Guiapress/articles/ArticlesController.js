const express = require("express")
const Category = require("../categories/Category")
const router = express.Router()
const Article = require('./Article');
const slugfy = require("slugify")
const adminAuth = require("../middlewares/adminAuth")

router.get("/admin/articles", adminAuth, (req, res) => {
  Article.findAll({
    include: [{ model: Category }]
  }).then((arts) => {
    res.render("admin/articles/index", { articles: arts })
  })
})

router.get("/admin/articles/new",  adminAuth, (req, res) => {
  Category.findAll().then((cat) => {
    res.render("admin/articles/new", { categories: cat })
  })
})

router.post("/articles/save", (req, res) => {
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category

  Article.create({
    title: title,
    slug: slugfy(title),
    body: body,
    categoryId: category
  }).then(() => {
    res.redirect("/admin/articles")
  })
})

router.post("/articles/delete", (req, res) => {
  let id = req.body.id

  if (id != undefined) {

    if (!isNaN(id)) {
      Article.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect("/admin/articles")
      })
    } else {
      res.redirect("/admin/articles")
    }

  } else {
    res.redirect("/admin/articles")
  }
})

router.get("/admin/articles/edit/:id",  adminAuth, (req, res) => {
  let id = req.params.id

  Article.findByPk(id).then((article) => {
    if (article != undefined) {

      Category.findAll().then((categories) => {
        res.render("admin/articles/edit", { article: article, categories: categories })
      })
    } else {
      res.redirect("admin/articles")
    }
  }).catch((err) => {
    res.redirect("/")
  });
})

router.post("/articles/update", (req, res) => {
  let id = req.body.id
  let title = req.body.title
  let body = req.body.body
  let category = req.body.category

  Article.update({ title: title, body: body, categoryId: category, slug: slugfy(title) }, { where: { id: id } })
    .then((article) => {
      res.redirect("/admin/articles")
    }).catch((err) => {
      res.redirect("/")
    });
})

router.get("/articles/page/:num", (req, res) => {
  let page = req.params.num
  let offset = 0

  if (isNaN(page) || page == 1) {
    offset = 0
  } else {
    offset = (parseInt(page) -1 ) * 4
  }

  Article.findAndCountAll({ limit: 4, offset: offset, order: [["id", "DESC"]] }).then((articles) => {
    
    let next
    if(offset + 4 >= articles.count){
      next = false
    }else{
      next = true
    }

    let result = {
      page: parseInt(page),
      next: next,
      articles: articles,

    }

    Category.findAll().then(categories => {
      res.render("admin/articles/page", {result: result, categories:categories})
    })
  })
})

module.exports = router