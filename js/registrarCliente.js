import { corrigirAutofill, adicionarCSSDetecaoAutofill } from "../src/utils/autofillFix.js";

const form = document.getElementById('formClientes')

document.addEventListener('DOMContentLoaded', async function() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }
    console.log('Token verificado na inicialização da página');
    
    // Adicionar correções do autofill
    adicionarCSSDetecaoAutofill();
    corrigirAutofill();
});

form.addEventListener('submit',(event) =>{
    event.preventDefault()

    const formData = new FormData(form)

    const dados = {}
    for(let [chave, valor] of formData.entries()){
        dados[chave] = valor
    }

    if (!dados.nome || !dados.email || !dados.telefone) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const btnSubmit = form.querySelector('button[type="submit"]');
    const textoOriginal = btnSubmit.textContent;
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;
    const token = localStorage.getItem('token')
    const telefone =  parseInt(dados.telefone)
    

    fetch('http://172.16.5.57:3000/clientes/registrar',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
            nome: dados.nome,
            email: dados.email,
            telefone: telefone
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
    })
    .then(resposta => {
        console.log('Sucesso:', resposta);
        alert('Cliente registrado com sucesso!');
        form.reset(); 
        
        // Reaplica correção após reset
        setTimeout(corrigirAutofill, 100);
        
        // Recarregar a lista de clientes no dropdown do formulário de carros
        if (typeof window.recarregarListaClientes === 'function') {
            window.recarregarListaClientes();
        }
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao registrar cliente: ' + err.message);
    })
    .finally(() => {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    });
})