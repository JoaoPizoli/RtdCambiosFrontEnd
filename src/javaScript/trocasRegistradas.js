import { formatarDataBrasileira } from "../utils/formatters.js"
import { listarClientes } from "../services/clientesService.js"
import { listarPorCliente } from "../services/carrosService.js"
import { listarTrocasOleo } from "../services/oleoService.js"
import { deletarTrocarOleo } from "../services/oleoService.js"

const formEdit = document.getElementById('formEditar')

async function pegarDadosClientes(){
    const data = await listarClientes()
    const ativarForm = document.getElementById('selectVeiculoFiltro')
    ativarForm.disabled = false
    const selectCliente = document.getElementById('selectClienteFiltro')
    selectCliente.innerHTML ='<option value="0">Selecionar Cliente</option>'
    data.forEach(cliente =>{
        const option = document.createElement('option')
        option.value = cliente.id
        option.textContent = cliente.nome 
        selectCliente.appendChild(option)
    })
}

async function pegarDadosCarro(idCliente){
    const data = await listarPorCliente(idCliente) 
    const carregarDados = carregarDadosCarroTela(data)
    if(!carregarDados){
        console.log('Erro ao carregar a lista de carros do cliente!')
    }
    return data
}

async function pegarDadosTrocaOleo(data){

    const dados = await listarTrocasOleo(data)
    const loadData = await carregarDadosTelaTrocaOleo(dados)
    if(!loadData){
        console.error('Erro ao carregar os dados na tela - verifique se a função carregarDadosTelaTrocaOleo está funcionando')
    }
    return true 
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

function excluirTroca(idTroca){
    console.log('ID recebido:', idTroca, 'Tipo:', typeof idTroca, 'É objeto?', typeof idTroca === 'object')
    window.trocaParaExcluir = idTroca
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'))
    modal.show()
}

function editarTroca(idTroca){
    alert(`Editar troca ID: ${idTroca}`)
}

// Tornar as funções globalmente acessíveis
window.excluirTroca = excluirTroca
window.editarTroca = editarTroca


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
                        <button class="btn btn-sm btn-outline-warning me-2" onclick="editarTroca('${data[i].id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirTroca('${data[i].id}')">
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
    if(clientId === "0"){
        const dropDown = document.getElementById('selectVeiculoFiltro')
        dropDown.innerHTML = '<option value="">Selecionar Veículo do Cliente</option>'
        document.getElementById('listaTrocas').innerHTML = '';
        document.getElementById('totalRegistros').innerHTML = '0'
    }
    else if(clientId){ 
        const dadosCarro = await pegarDadosCarro(clientId)
        if(!dadosCarro){
            console.log('Erro ao executar função que pega os dados do carro pelo ClientId')
        }
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

// Event listener para confirmar exclusão no modal
document.getElementById('confirmarExclusao').addEventListener('click', async () => {
    try {
        const idTroca = window.trocaParaExcluir

        if (idTroca) {
            await deletarTrocarOleo(idTroca)
            
            // Fechar o modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('modalExcluir'))
            modal.hide()
            
            // Recarregar a lista
            const carroSelecionado = document.getElementById('selectVeiculoFiltro').value
            if (carroSelecionado) {
                await pegarDadosTrocaOleo(carroSelecionado)
            }
            
            // Limpar a variável temporária
            window.trocaParaExcluir = null
            
            alert('Troca excluída com sucesso!')
        } else {
            alert('Erro: ID da troca não encontrado')
        }
    } catch (error) {
        console.error('Erro ao excluir troca:', error)
        alert('Erro ao excluir troca: ' + error.message)
    }
})

window.addEventListener('DOMContentLoaded', async ()=>{
    await pegarDadosClientes()
})
