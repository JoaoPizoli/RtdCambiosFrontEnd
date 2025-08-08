// FUNÇÃO PARA CORRIGIR AUTOFILL
import { corrigirAutofill, adicionarCSSDetecaoAutofill } from "../src/utils/autofillFix.js";

// Aplicar correções quando a página carrega
document.addEventListener('DOMContentLoaded', () => {
    adicionarCSSDetecaoAutofill();
    corrigirAutofill();
});

const formCarros = document.getElementById('formCarros')

formCarros.addEventListener('submit', async (event) => {
    event.preventDefault()

    const formData = new FormData(formCarros)

    const dados = {}
    for(let [chave, valor] of formData.entries()){
        dados[chave] = valor
    }

    if (!dados.placa || !dados.modelo || !dados.clienteId) {
        alert('Por favor, preencha todos os campos!');
        return;
    }

    const btnSubmit = formCarros.querySelector('button[type="submit"]');
    btnSubmit.textContent = 'Enviando...';
    btnSubmit.disabled = true;
    
    try {
        const token = localStorage.getItem('token')

        const response = await fetch('http://172.16.5.57:3000/carros/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                placa: dados.placa,
                modelo: dados.modelo,
                clienteId: dados.clienteId 
            })
        })

        if (response.ok) {
            alert('Veículo cadastrado com sucesso!');
            formCarros.reset();
            // Reaplica correção após reset
            setTimeout(corrigirAutofill, 100);
        } else {
            const error = await response.json();
            alert('Erro ao cadastrar veículo: ' + (error.message || 'Erro desconhecido'));
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar veículo: ' + error.message);
    } finally {
        btnSubmit.textContent = 'Registrar';
        btnSubmit.disabled = false;
    }
})

async function carregarClientes(){
    try {
        const token = localStorage.getItem('token')
        const response = await fetch('http://172.16.5.57:3000/clientes/listar',{
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const clientes = await response.json()
        return clientes 
    } catch (error) {
        console.error('Erro ao carregar clientes:', error);
        return []
    }
}

function popularSelectClientes(clientes){
    const select = document.querySelector('#formCarros select')

    if (!select) return;

    select.innerHTML = '<option value="">Selecione o Cliente</option>';

    clientes.forEach((cliente) => {
        const option = document.createElement('option')
        option.value = cliente.id
        option.textContent = cliente.nome
        select.appendChild(option)
    });
}

window.recarregarListaClientes = async function() {
    const clientes = await carregarClientes();
    popularSelectClientes(clientes);
}

window.addEventListener('DOMContentLoaded', async () => {
    const clientes = await carregarClientes();
    popularSelectClientes(clientes);
    
    // Aplica correção do autofill após carregar os dados
    setTimeout(corrigirAutofill, 200);
});