const express = require("express");
const { calcularPrecoPrazo } = require('correios-brasil');
const bcrypt = require('bcrypt');
const axios = require('axios').default
const router = express.Router();
const crypto = require('crypto')
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch');

const verifica = (req, res, next) => {
    try {
        if (localStorage.getItem("usuario") == "" || localStorage.getItem("usuario") == undefined) {
            res.redirect('/acesso')
        } else {
            axios.post('https://api-shop-otaku.herokuapp.com/verifica-token', new URLSearchParams({
                'usuario': `${localStorage.getItem("usuario")}`
            })).then((response) => {
                console.log(response.data)
                if (response.data.status == true) {
                    next();
                } else {
                    res.redirect('/acesso')
                }
            })
        }
    } catch (error) {
        res.redirect('/acesso')
    }
}

router.get("/carrinho", verifica, (req, res) => {
    let [usuario, vazio, total] = [localStorage.getItem("usuario"), false, 0]
    axios.post("https://api-shop-otaku.herokuapp.com/carrinho", { usuario: usuario }).then((response) => {
        if (response.data.length == 0) {
            vazio = true
        } else {
            response.data.forEach((item) => {
                let tot = parseFloat(item.total)
                let pr = item.price
                total += tot;
                item.total = (tot).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })
                item.price = (pr).toLocaleString('pt-BR', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            })
            total = (total).toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            })
        }
        res.render('carrinho', {
            title: "Carrinho",
            data: response.data,
            vazio: vazio,
            total: total,
            layout: 'carrinho'
        })
    })
})
router.get('/adicionar-produto/:produto/:qtde/:tamanho', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/addCarrinho', {
        usuario: usuario,
        produto: req.params.produto,
        qtde: req.params.qtde,
        size: req.params.tamanho
    }).then(() => {
        res.redirect('/carrinho')
    })
})
router.post('/adicionar-produto', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/addCarrinho', {
        usuario: usuario,
        produto: req.body.produto,
        qtde: req.body.qtde,
        size: req.body.size
    }).then(() => {
        res.redirect('/carrinho')
    })
})
router.post('/alterarProduto', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/alterar', new URLSearchParams({
        'usuario': `${usuario}`,
        'produto': `${req.body.produto}`,
        'qtde': `${req.body.qtde}`
    })).then((response) => { }).catch((error) => {
        console.log(error);
    });
})
router.post('/alterarTamanho', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/tamanho', new URLSearchParams({
        'usuario': `${usuario}`,
        'produto': `${req.body.produto}`,
        'size': `${req.body.size}`
    })).then((response) => { }).catch((error) => {
        console.log(error);
    });
})
router.post('/removerProduto', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/remover', new URLSearchParams({
        'usuario': `${usuario}`,
        'produto': `${req.body.produto}`
    })).then((response) => {
        console.log("deu certo")
    }).catch((error) => {
        console.log(error);
    });
})
router.post('/deletarCarrinho', (req, res) => {
    axios.post('https://api-shop-otaku.herokuapp.com/limpar', new URLSearchParams({
        'usuario': `gabriel_vogais`
    })).then((response) => { }).catch((error) => {
        console.log(error);
    });
})


module.exports = router;