const express = require("express");
const axios = require('axios').default
const router = express.Router();
const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch');
const upload = require('../middlewares/multer')

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
router.get("/perfil", verifica, (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/buscar-perfil', new URLSearchParams({
        'usuario': `${usuario}`
    })).then((response) => {
        console.log(response.data)
        res.render(
            'perfil', {
            layout: 'perfil',
            title: 'Perfil',
            perfil: response.data
        })
    }).catch((error) => {
        console.log(error);
    });
})

router.post("/cep-perfil", (req, res) => {
    let cep = req.body.cep
    correios.consultaCEP({ cep }).then(response => {
        console.log(response)
        res.json(response)
    })
})
router.post('/imagem-perfil', verifica, upload.single('image'), (req, res) => {
    let avatar
    let usuario = localStorage.getItem("usuario")
    let size = req.file.originalname.length
    if (req.file) {
        if (req.file.originalname.match(/png/) || req.file.originalname.match(/jpg/)) {
            avatar = "user_" + usuario + req.file.originalname.substring(size - 4, size)
        } else {
            avatar = "user_" + usuario + req.file.originalname.substring(size - 5, size)
        }
        res.send({avatar: avatar})
    }else{
        res.send({message: "Falha no Upload"})
    }
})
router.post('/atualizar-perfil', (req, res) => {
    let usuario = localStorage.getItem("usuario")
    axios.post('https://api-shop-otaku.herokuapp.com/atualizar-perfil', new URLSearchParams({
        'usuario': `${usuario}`,
        'telefone': `${req.body.telefone}`,
        'nome': `${req.body.nome}`,
        'nascimento': `${req.body.nascimento}`,
        'cep': `${req.body.cep}`,
        'estado': `${req.body.estado}`,
        'cidade': `${req.body.cidade}`,
        'bairro': `${req.body.bairro}`,
        'rua': `${req.body.rua}`,
        'numero': `${req.body.numero}`,
        'complemento': `${req.body.complemento}`,
        'path': `${req.body.path}`
    }))
})


module.exports = router;