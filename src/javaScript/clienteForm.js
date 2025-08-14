import { corrigirAutofill, adicionarCSSDetecaoAutofill } from "../utils/autofillFix.js";
import { registrarCliente } from "../services/clientesService.js";

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
    const telefone =  parseInt(dados.telefone)

    try {
        const registrar = registrarCliente(dados.nome,dados.email, telefone)
        if(registrar){
            console.log('Sucesso:', resposta);
            alert('Cliente registrado com sucesso!');
            form.reset(); 
            // Reaplica correção após reset
            setTimeout(corrigirAutofill, 100);
            // Recarregar a lista de clientes no dropdown do formulário de carros
            if (typeof window.recarregarListaClientes === 'function') {
                window.recarregarListaClientes();
            } 
            btnSubmit.textContent = textoOriginal;
            btnSubmit.disabled = false;
        }
    } catch (error) {
        console.error('Erro:', error.message);
    }
})