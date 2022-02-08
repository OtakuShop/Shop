const express = require("express");
const axios = require('axios').default
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch');


router.get("/", (req, res) => {
    axios.get("https://api-shop-otaku.herokuapp.com/destaques").then((response) => {
        res.render('home', { destaques: response.data, title: "Otaku Shop" })
    })
})

router.get("/detalhes/:id", (req, res) => {
    axios.post("https://api-shop-otaku.herokuapp.com/detalhes", { id: req.params.id }).then((response) => {
        res.render('details', { data: response.data , title: "Otaku Shop"})
    })
})
router.get("/produtos", (req, res) => {
    axios.get("https://api-shop-otaku.herokuapp.com/produtos").then((response) => {
        res.render('produtos', { produtos: response.data ,  title: "Produtos"})
    })
})

module.exports = router;