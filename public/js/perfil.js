const btn_perfil = document.getElementById('save-perfil')
const inputcep = document.getElementById('cep')
const inputcell = document.getElementById('telefone')
const btn_logout = document.getElementById("logout")
let img = document.querySelector('[name=file]')

img.addEventListener('change', e => {
    let file = e.target.files[0]
    let fileReader = new FileReader()
    fileReader.onloadend = () => {
        document.querySelector('#image').setAttribute('src', fileReader.result)
    }
    fileReader.readAsDataURL(file)
})



btn_logout.addEventListener('click', () => {
    axios.get("https://otakushop.herokuapp.com/redirect-logout").then((response) => {
        window.location.href = "http://localhost:8081"
    }).catch((error) => {
        alert(error)
    });

})

inputcep.addEventListener('keypress', () => {
    if (inputcep.value.length == 5) {
        inputcep.value += "-"
    }
})
inputcep.addEventListener('focusout', () => {
    if (inputcep.value.length === 9) {
        axios.get(`https://viacep.com.br/ws/${inputcep.value}/json/`).then((response) => {
            const auto = document.getElementsByClassName('auto');
            for (let i = 0; i < auto.length; i++) {
                switch (auto[i].name) {
                    case 'estado':
                        auto[i].value = response.data.uf
                        break;
                    case 'cidade':
                        auto[i].value = response.data.localidade
                        break;
                    case 'bairro':
                        auto[i].value = response.data.bairro
                        break;
                    case 'rua':
                        auto[i].value = response.data.logradouro
                        break;
                }
            }
        }).catch((error) => {
            console.log(error);
        });
    }
})
inputcell.addEventListener('keypress', () => {
    switch (inputcell.value.length) {
        case 2:
            let string = inputcell.value.replace(/[^a-zA-Z0-9]/g, '')
            inputcell.value = "(" + string + ") "
            break;
        case 6:
            inputcell.value += " "
            break;
        case 11:
            inputcell.value += "-"
            break;
    }
    setTimeout(() => {
        console.log(inputcep.value)
    }, 250)
})

btn_perfil.addEventListener('click', async () => {
    const inputs = document.getElementsByClassName('input-perfil');
    let perfil = {}
    for (let i = 0; i < inputs.length; i++) {
        switch (inputs[i].name) {
            case 'nome':
                perfil.nome = inputs[i].value
                break;
            case 'usuario':
                perfil.usuario = inputs[i].value
                break;
            case 'email':
                perfil.email = inputs[i].value
                break;
            case 'nascimento':
                perfil.nascimento = inputs[i].value
                break;
            case 'telefone':
                perfil.telefone = inputs[i].value
                break;
            case 'cep':
                perfil.cep = inputs[i].value
                break;
            case 'estado':
                perfil.estado = inputs[i].value
                break;
            case 'cidade':
                perfil.cidade = inputs[i].value
                break;
            case 'bairro':
                perfil.bairro = inputs[i].value
                break;
            case 'rua':
                perfil.rua = inputs[i].value
                break;
            case 'numero':
                perfil.numero = inputs[i].value
                break;
            case 'complemento':
                perfil.complemento = inputs[i].value
                break;
        }
    }
    let formData = new FormData()
    let avatar = ''
    formData.append('image', img.files[0])
    let result = await axios.post('https://otakushop.herokuapp.com/imagem-perfil', formData)
    axios.post('https://otakushop.herokuapp.com/atualizar-perfil', new URLSearchParams({
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
        'path': `/images/avatar/${result.data.avatar}`
    })).then((response) => {
        avatar = response.avatar
    }).catch((error) => {
        console.log(error);
    });

})