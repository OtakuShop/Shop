const btn_down = document.getElementsByClassName('down');
const sizes_btns = document.getElementsByClassName('btn_size');
const boxSize = document.getElementsByClassName('click-size');
const delete_bnts = document.getElementsByClassName('delete-btn')
const deletarCarrinho = document.getElementById('delete-all')
const resgateCupom = document.getElementById("btn_resgatar")
const calcularFrete = document.getElementById("calcep")
const check = document.getElementById('radio-frete')
const btn_compra = document.getElementById('fCompra')
const btn_produtos = document.getElementById('mais-produtos')
let datacupom = {}
let vfrete = 0;

window.onload = () => {
    for (let i = 0; i < sizes_btns.length; i++) {
        sizes_btns[i].id = "btn_size" + i
        document.getElementById('btn_size' + i).addEventListener("click", (e) => {
            let text = e.target.textContent.trim();
            document.getElementById("size_cart" + e.target.parentNode.id).textContent = text
            document.getElementById(e.target.parentNode.parentNode.parentNode.id).style.display = "none"
            axios.post('https://otakushop.herokuapp.com/alterarTamanho', new URLSearchParams({
                'produto': `${e.target.parentNode.id}`,
                'size': `${text}`
            })).then((response) => {}).catch((error) => {
                console.log(error);
            });
        })
    }
    for (let i = 0; i < boxSize.length; i++) {
        let id = boxSize[i].parentNode.id
        let btn = document.getElementById('div-size' + id)
        if (btn != null) {
            btn.addEventListener('click', (e) => {
                let btns = document.getElementById('btns' + id)
                if (btns.style.display == "flex") {
                    btns.style.display = "none"
                } else {
                    btns.style.display = "flex"
                }
            })
        }
    }

}


btn_compra.addEventListener('click', () => {
    limparCarrinho()
})
btn_produtos.addEventListener('click', () => {
    window.location.href = "https://otakushop.herokuapp.com/produtos";
})


check.addEventListener('click', () => {
    document.getElementById('fr').textContent = "R$ " + (vfrete).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    atualizarSubTotalGeral();
    atualizarTotalGeral();
})

for (let i = 0; i < delete_bnts.length; i++) {
    document.getElementById("delete" + i).addEventListener("click", function(e) {
        let id = this.parentNode.parentNode.parentNode.children[2].children[0].id
        deletaProduto(e.target.id[this.id.length - 1], id)
        atualizarSubTotalGeral();
        atualizarTotalGeral();
    })
}

calcularFrete.addEventListener("click", () => {
    let cep = document.getElementById('inpfrete').value
    let remetente = {}
    document.getElementById('inpfrete').value = ""
    if (!cep == "") {
        axios.get(`https://viacep.com.br/ws/47970-000/json/`).then(response => {
            remetente = response.data
        })
        axios.get(`https://viacep.com.br/ws/${cep}/json/`).then(response => {
            if (response.data.hasOwnProperty('erro')) {
                setarMensagem('status-frete', "Cep Inválido")
            } else {
                if (remetente.localidade === response.data.localidade) {
                    atualizarFrete({ valor: 10, prazoEntrega: 2 })
                } else {
                    vfrete = response.data.valor
                    atualizarFrete({ valor: 30, prazoEntrega: 12 })
                }
                atualizarTotalGeral();
            }
        }).catch((error) => {
            console.log("Essa merda ta dando erro: " + error);
        });
    }
})
resgateCupom.addEventListener("click", () => {
    let cupom = document.getElementById('inpcup').value
    if (!cupom == "") {
        axios.post('http://localhost:3000/verifica-cupom', new URLSearchParams({
            'usuario': `gabriel_vogais`,
            'cupom': `${cupom}`
        })).then((response) => {
            atualizaCupom(response.data)
        }).catch((error) => {
            console.log(error);
        });
    }
})

const deletaProduto = (id, produto) => {
    let elemento = document.querySelector("#prod" + id)
    elemento.parentNode.removeChild(elemento);
    removerProduto(produto)
    let carrinho = document.getElementsByClassName('produto')
    if (carrinho.length === 0) {
        limparCarrinho()
    }
}
deletarCarrinho.addEventListener("click", () => {
    limparCarrinho()
})
for (let i = 0; i < btn_down.length; i++) {
    document.getElementById("down" + i).addEventListener("click", function(e) {
        id = e.target.id[this.id.length - 1]
        let span = document.getElementById("span" + id)
        if (parseInt(span.textContent) > 1) {
            span.textContent = parseInt(span.textContent) - 1
            atualizarQuantidadeProduto(this.parentNode.id, -1)
            atualizarSubTotalProduto(id, parseInt(span.textContent))
        } else {
            deletaProduto(id)
        }
    })
    document.getElementById("up" + i).addEventListener("click", function(e) {
        id = e.target.id[this.id.length - 1]
        let span = document.getElementById("span" + id)
        atualizarQuantidadeProduto(this.parentNode.id, 1)
        span.textContent = parseInt(span.textContent) + 1
        atualizarSubTotalProduto(id, parseInt(span.textContent))
    })
}

const atualizarSubTotalProduto = (id, qtde) => {
    let pr = document.getElementById("preco" + id)
    let preco = 0,
        total = document.getElementById("total" + id)
    preco = parseFloat(pr.textContent.replace(",", ".").trim().substr(2, preco.length)) * qtde
    total.textContent = "R$" + (preco).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    atualizarSubTotalGeral();
    atualizarTotalGeral();
}

const atualizarSubTotalGeral = () => {
    let totalprodutos = document.getElementById("pr")
    let spans = document.getElementsByClassName('spantotal');
    let total = 0;
    for (let i = 0; i < spans.length; i++) {
        total += parseFloat(spans[i]
            .textContent
            .replace(".", "")
            .replace(",", ".")
            .trim()
            .substr(2, spans[i].length)
        )
    }
    totalprodutos.textContent = "R$" + (total).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
    if (datacupom.tipo == "percente") {
        descontarPorcentagem(datacupom.valor)
    }
}

const atualizarTotalGeral = () => {
    let valores = document.getElementsByClassName('calc-total');
    let totalgeral = document.getElementById('totg')
    let total = 0
    for (let i = 0; i < valores.length; i++) {
        total += parseFloat(valores[i]
            .textContent
            .replace(".", "")
            .replace(",", ".")
            .trim()
            .substr(2, valores[i].length)
        )
    }
    totalgeral.textContent = "R$" + (total).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}

const atualizaCupom = (cupom) => {
    if (cupom.status == 200) {
        switch (cupom.desconto.tipo) {
            case 'dinheiro':
                datacupom.tipo = 'dinheiro'
                datacupom.valor = cupom.desconto.valor
                descontarDinheiro(cupom.desconto.valor)
                break;
            case 'percente':
                datacupom.tipo = 'percente'
                datacupom.valor = cupom.desconto.valor
                descontarPorcentagem(cupom.desconto.valor)
                break;
        }
    }
    setarMensagem('status-cupom', cupom.message)
    atualizarSubTotalGeral();
    atualizarTotalGeral();
}

const setarMensagem = (Span, message) => {
    let span = document.getElementById(Span)
    span.textContent = message
    span.style.display = "block"
    setTimeout(() => {
        span.style.display = "none"
    }, 3000)
}

const descontarDinheiro = (valor) => {
    let cupons = document.getElementById('cup')
    cupons.textContent = "R$ " + (valor * -1).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

}
const descontarPorcentagem = (valor) => {
    let cupons = document.getElementById('cup')
    let valores = document.getElementsByClassName('calc-total');
    let total = 0;
    for (let i = 0; i < valores.length - 1; i++) {
        total += parseFloat(valores[i]
            .textContent
            .replace(".", "")
            .replace(",", ".")
            .trim()
            .substr(2, valores[i].length)
        )
    }
    total *= valor / 100
    cupons.textContent = "R$ " + (total * -1).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
const atualizarFrete = (data) => {
    document.getElementById('sedex').style.display = "block"
    document.getElementById('prazo-frete').textContent = " - em até " + data.prazoEntrega + " dias úteis"
    vfrete = data.valor
    document.getElementById('preco-frete').textContent = "R$ " + (data.valor).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })
}
const atualizarQuantidadeProduto = (id, qtde) => {
    axios.post('https://otakushop.herokuapp.com/alterarProduto', new URLSearchParams({
        'produto': `${id}`,
        'qtde': `${qtde}`
    })).then((response) => {
        console.log("deu certo")
    }).catch((error) => {
        console.log(error);
    });
}
const removerProduto = (id) => {
    axios.post('https://otakushop.herokuapp.com/removerProduto', new URLSearchParams({
        'produto': `${id}`
    })).then((response) => {
        console.log("deu certo")
    }).catch((error) => {
        console.log(error);
    });
}

const limparCarrinho = () => {
    axios.post('https://otakushop.herokuapp.com/deletarCarrinho').then((response) => {}).catch((error) => {
        console.log(error);
    });
    setTimeout(() => {
        window.location.href = "https://otakushop.herokuapp.com/carrinho";
    }, 300)
}