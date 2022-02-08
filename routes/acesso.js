const express = require("express");
const { calcularPrecoPrazo } = require('correios-brasil');
const bcrypt = require('bcrypt');
const axios = require('axios').default
const router = express.Router();
const crypto = require('crypto')
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch');

router.post("/redirect-cadastro", (req, res) => {
    let perfil = {
        nome: '',
        telefone: '',
        cep: '',
        nascimento: '',
        rua: '',
        cidade: '',
        estado: '',
        numero: '',
        bairro: '',
        complemento: '',
        path: '/images/avatar/default.png'
    }
    axios.post('https://api-shop-otaku.herokuapp.com/cadastro', new URLSearchParams({
        usuario: `${req.body.usuario}`,
        senha: `${bcrypt.hashSync(req.body.senha, 10)}`,
        email: `${req.body.email}`,
        perfil: ''
    }
    )).then((response) => {
        axios.post('https://api-shop-otaku.herokuapp.com/atualizar-perfil', new URLSearchParams({
            'usuario': `${req.body.usuario}`,
            'telefone': `${perfil.telefone}`,
            'nome': `${perfil.nome}`,
            'nascimento': `${perfil.nascimento}`,
            'cep': `${perfil.cep}`,
            'estado': `${perfil.estado}`,
            'cidade': `${perfil.cidade}`,
            'bairro': `${perfil.bairro}`,
            'rua': `${perfil.rua}`,
            'numero': `${perfil.numero}`,
            'complemento': `${perfil.complemento}`,
            'path': `${perfil.path}`
        }))
    }).catch((error) => {
        console.log(error)
    });
})
router.get("/redirect-logout", (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/logout', new URLSearchParams({
        'usuario': `${usuario}`
    })).then((response) => {
        res.json(response.data)
    }).catch((error) => {
        console.log(error)
    });
})
router.post("/redirect-login", (req, res) => {
    axios.post('https://api-shop-otaku.herokuapp.com/login', new URLSearchParams({
        'usuario': `${req.body.usuario}`,
        'senha': `${req.body.senha}`
    })).then((response) => {
        if (response.data.alert == "green") {
            localStorage.clear()
            localStorage.setItem("usuario", req.body.usuario)
        }
        res.json(response.data)
    }).catch((error) => {
        console.log(error)
    });
})


router.get("/acesso", (req, res) => {
    res.render('acesso', { layout: 'acesso', title: "Acesso" })
})


module.exports = router;