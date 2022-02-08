const addCarrinho = document.getElementById('add-carrinho')

addCarrinho.addEventListener('click', (e) => {
    let select = document.getElementById('size-option');
    let size = ''
    try {
        size = select.options[select.selectedIndex].text
    } catch (error) {
        size = 0
    }
    let input = document.getElementById('product-qtde')
    let qtde = parseInt(input.value)
    let produto = e.target.parentNode.id
    if (qtde >= 1 && (size == "M" || size == "G" || size == "P")) {
        axios.post('https://otakushop.herokuapp.com/adicionar-produto', new URLSearchParams({
            'produto': `${produto}`,
            'size': `${size}`,
            'qtde': `${qtde}`
        })).then((response) => {
            window.location.href = "https://otakushop.herokuapp.com/"
        }).catch((error) => {
            console.log(error);
        });
    }
})