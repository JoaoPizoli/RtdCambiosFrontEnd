import { formatarDataBrasileira } from "../src/utils/formatters.js"

const formEdit = document.getElementById('formEditar')

async function pegarDadosClientes(){
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/clientes/listar',{
        method: 'GET',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
            }
        })
        if(response.ok){
            const ativarForm = document.getElementById('selectVeiculoFiltro')
            ativarForm.disabled = false
        }else{
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        const data = await response.json()
        const selectCliente = document.getElementById('selectClienteFiltro')
        selectCliente.innerHTML ='<option value="">Selecionar Cliente</option>'
        data.forEach(cliente =>{
            const option = document.createElement('option')
            option.value = cliente.id
            option.textContent = cliente.nome 
            selectCliente.appendChild(option)
        })
    } catch (error) {
        console.log(`Erro ao listar Clientes: ${error.message}`)
    }
}

async function pegarDadosCarro(idCliente){
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/carros/cliente',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId: idCliente
            })
        })
        if(!response.ok){
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const data = await response.json()
        const carregarDados = carregarDadosCarroTela(data)
        if(!carregarDados){
            console.log('Erro ao carregar a lista de carros do cliente!')
        }
        return data
    } catch (error) {
        console.log(`Erro ao listar Clientes: ${error.message}`)
    }
}

async function pegarDadosTrocaOleo(data){
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/oleo/listar',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
            carroId: data
         })
        })
        if(!response){
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const dados = await response.json()
        const loadData = await carregarDadosTelaTrocaOleo(dados)
        if(!loadData){
            console.error('❌ Erro ao carregar os dados na tela - verifique se a função carregarDadosTelaTrocaOleo está funcionando')
        }
        return true 

    } catch (error) {
        console.log(`Erro ao carregar os dados de troca de óleo: ${error.message}`)
        return false 
    }
}



async function carregarDadosCarroTela(dadosCarro){
    const dropDown = document.getElementById('selectVeiculoFiltro')
    dropDown.innerHTML = '<option value="">Selecionar Veículo do Cliente</option>'
    for(let i = 0; i < dadosCarro.length; i++){
        const option = document.createElement('option')
        option.value = dadosCarro[i].id
        option.textContent = dadosCarro[i].modelo
        dropDown.appendChild(option)
    }
}


function contador(tamanhoData){
    const contador = document.getElementById('totalRegistros')
    contador.textContent = '0'
    const novoValor = `${tamanhoData.length}`
    contador.textContent = novoValor
}

async function carregarDadosTelaTrocaOleo(dados){
    
    const data = dados
    contador(dados)
    const lista = document.getElementById('listaTrocas')
    lista.innerHTML = ''
    for(let i = 0; i < data.length; i++){
        const card = document.createElement('div')
                card.innerHTML = `
            <div class="troca-card" data-id="${data[i].id}">
                <div class="troca-card-header">
                    <div class="acoes">
                        <button class="btn btn-sm btn-outline-warning me-2" onclick="editarTroca(${data[i].id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirTroca(${data[i].id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="troca-card-body">
                    <div class="row">
                        <div class="col-md-6">
                            <div class="data-info">
                                <i class="fas fa-calendar-check text-success me-2"></i>
                                <div>
                                    <strong>Troca Realizada:</strong>
                                    <p class="mb-0">${formatarDataBrasileira(data[i].oleoDataTroca)}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="data-info">
                                <i class="fas fa-calendar-plus text-warning me-2"></i>
                                <div>
                                    <strong>Próxima Troca:</strong>
                                    <p class="mb-0">${formatarDataBrasileira(data[i].oleoDataProximaTroca)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="row mt-2">
                        <div class="col-md-4">
                            <div class="data-info">
                                <i class="fas fa-tachometer-alt text-info me-2"></i>
                                <div>
                                    <strong>Km Atual:</strong>
                                    <p class="mb-0">${data[i].kmTroca} km</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-info">
                                <i class="fas fa-road text-info me-2"></i>
                                <div>
                                    <strong>Próximo Km:</strong>
                                    <p class="mb-0">${data[i].KmProximaTroca} km</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-info">
                                <i class="fas fa-oil-can text-primary me-2"></i>
                                <div>
                                    <strong>Tipo de Óleo:</strong>
                                    <p class="mb-0">${data[i].tipoOleo}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="status-container mt-3">
                        <span class="badge status-badge status-em-dia">
                            <i class="fas fa-check-circle me-1"></i>Em dia
                        </span>
                    </div>
                </div>
            </div>
        `
        lista.appendChild(card)

    }
    return true 
}



//Event Listeners

document.getElementById('selectClienteFiltro').addEventListener('change', async (event) =>{
    const clientId = event.target.value
    if(clientId){
        const dadosCarro = await pegarDadosCarro(clientId)
        if(!dadosCarro){
            console.log('Erro ao executar função que pega os dados do carro pelo ClientId')
        }
    } else {
        document.getElementById('listaTrocas').innerHTML = '';
    }
})

document.getElementById('selectVeiculoFiltro').addEventListener('change', async (event)=>{
    const idCarro = event.target.value
    if(idCarro){
        const trocas = await pegarDadosTrocaOleo(idCarro)
        if(!trocas){
            console.error('❌ Erro ao exibir dados da troca de óleo - ID do carro:', idCarro)
        }
    
    }
})



window.addEventListener('DOMContentLoaded', async ()=>{
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }
    await pegarDadosClientes()
})
