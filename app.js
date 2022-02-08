//Carregando Módulos

const express = require("express");
const axios = require('axios').default;
const cors = require('cors')
const app = express();
const path = require('path')
const AcessRoute = require('./routes/acesso')
const CartRoute = require('./routes/carrinho')
const ProductRoute = require('./routes/produtos')
const PerfilRoute = require('./routes/perfil')
const Handlebars = require('handlebars');
const LocalStorage = require('node-localstorage').LocalStorage

//Configurações

app.use(express.static(path.join(__dirname, "public")))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    app.use(cors)
    next();
})
localStorage = new LocalStorage('./scratch');
const port = process.env.PORT || 8081

//Middlewares 


//Handlebars

const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');
Handlebars.registerHelper('MaiorQue', (value1, value2) => {
    if (value1 > value2) {
        return `<strong><span>Status: Em estoque</span></strong>`
    } else {
        return `<strong><span>Status: Produto Indisponível</span></strong>`
    }
});

//Rotas

app.use('/', AcessRoute)
app.use('/', CartRoute)
app.use('/', ProductRoute)
app.use('/', PerfilRoute)

app.listen(port, () => {
    console.log("Rodando servidor na porta " + port);
})