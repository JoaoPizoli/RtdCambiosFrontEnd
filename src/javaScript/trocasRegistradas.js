import sweetalert2 from 'https://cdn.jsdelivr.net/npm/sweetalert2@11.22.4/+esm'
import { formatarDataBrasileira, formatarParaISO8601  } from "../utils/formatters.js"
import { listarClientes } from "../services/clientesService.js"
import { listarPorCliente } from "../services/carrosService.js"
import { listarTrocasOleo } from "../services/oleoService.js"
import { deletarTrocarOleo } from "../services/oleoService.js"
import { editarTrocaOleo } from "../services/oleoService.js"
import { ApiError } from "../core/erroHandler.js"


async function pegarDadosClientes(){
    try {
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
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Erro ao carregar clientes:', error.userMessage);
        } else {
            console.error('Erro ao carregar clientes:', error.message);
        }
    }
}

async function pegarDadosCarro(idCliente){
    try {
        const data = await listarPorCliente({clienteId: idCliente}) 
        const carregarDados = carregarDadosCarroTela(data)
        if(!carregarDados){
            console.log('Erro ao carregar a lista de carros do cliente!')
        }
        return data
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Erro ao carregar carros:', error.userMessage);
        } else {
            console.error('Erro ao carregar carros:', error.message);
        }
        return []
    }
}

async function pegarDadosTrocaOleo(data){
    try {
        const dados = await listarTrocasOleo(data)
        const loadData = await carregarDadosTelaTrocaOleo(dados)
        if(!loadData){
            console.error('Erro ao carregar os dados na tela - verifique se a função carregarDadosTelaTrocaOleo está funcionando')
        }
        return true 
    } catch (error) {
        if (error instanceof ApiError) {
            console.error('Erro ao carregar trocas de óleo:', error.userMessage);
        } else {
            console.error('Erro ao carregar trocas de óleo:', error.message);
        }
        return false
    }
}

async function carregarDadosCarroTela(dadosCarro){
    const dropDown = document.getElementById('selectVeiculoFiltro')
    dropDown.innerHTML = '<option value="0">Selecionar Veículo do Cliente</option>'
    for(let i = 0; i < dadosCarro.length; i++){
        const option = document.createElement('option')
        option.value = dadosCarro[i].id
        option.textContent = dadosCarro[i].modelo
        dropDown.appendChild(option)
    }
}

function excluirTroca(idTroca){
    window.trocaParaExcluir = idTroca
    const modal = new bootstrap.Modal(document.getElementById('modalExcluir'))
    modal.show()
}

function editarTroca(idTroca){
    try {
        // Recupera a troca do cache e preenche o modal
        const troca = window.__trocasCache?.get?.(idTroca)
        if (!troca) {
            console.warn('Troca não encontrada no cache, ID:', idTroca)
        }

        // Info de cliente e veículo a partir dos selects
        const selCliente = document.getElementById('selectClienteFiltro')
        const selVeiculo = document.getElementById('selectVeiculoFiltro')
        const clienteNome = selCliente?.selectedOptions?.[0]?.textContent || ''
        const veiculoInfo = selVeiculo?.selectedOptions?.[0]?.textContent || ''
        document.getElementById('editClienteNome').textContent = clienteNome
        document.getElementById('editVeiculoInfo').textContent = veiculoInfo


        document.getElementById('editDataTroca').value = new Date(troca?.oleoDataTroca).toISOString();
        document.getElementById('editProximaTroca').value = new Date(troca?.oleoDataProximaTroca).toISOString();
        document.getElementById('editKmAtual').value = troca?.kmTroca ?? ''
        document.getElementById('editKmProxima').value = troca?.KmProximaTroca ?? ''
        document.getElementById('editTipoOleo').value = troca?.tipoOleo ?? ''

        // Guarda contexto para salvar
        window.trocaParaEditar = {
            idTroca,
            idCarro: selVeiculo?.value || null,
        }

        const modal = new bootstrap.Modal(document.getElementById('modalEditar'))
        modal.show()
    } catch (err) {
        console.error('Erro ao abrir modal de edição:', err)
        alert('Erro ao abrir a edição. Tente novamente.')
    }
}

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
    // Atualiza cache em memória para acesso rápido na edição
    if (!window.__trocasCache) window.__trocasCache = new Map()
    window.__trocasCache.clear()
    for (const t of data) {
        window.__trocasCache.set(String(t.id), t)
    }
    contador(dados)
    const lista = document.getElementById('listaTrocas')
    lista.innerHTML = ''
    for(let i = 0; i < data.length; i++){
        // Verificar status da troca
        const statusInfo = verificarStatusTroca(data[i].oleoDataProximaTroca)
        
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
                        <span class="badge status-badge ${statusInfo.classe}">
                            <i class="${statusInfo.icone} me-1"></i>${statusInfo.texto}
                        </span>
                    </div>
                </div>
            </div>
        `
        lista.appendChild(card)

    }
    return true 
}


// Função para verificar o status da troca baseado na data
function verificarStatusTroca(dataProximaTroca) {
    const dataAtual = new Date()
    const dataProxima = new Date(dataProximaTroca)
    
    // Remove a parte de horas para comparar apenas as datas
    dataAtual.setHours(0, 0, 0, 0)
    dataProxima.setHours(0, 0, 0, 0)
    
    const diferencaDias = Math.ceil((dataProxima - dataAtual) / (1000 * 60 * 60 * 24))
    
    if (diferencaDias < 0) {
        return {
            status: 'atrasado',
            classe: 'status-atrasado',
            icone: 'fas fa-exclamation-triangle',
            texto: 'Atrasado'
        }
    } else if (diferencaDias <= 7) {
        return {
            status: 'proximo',
            classe: 'status-proximo', 
            icone: 'fas fa-clock',
            texto: 'Próximo do vencimento'
        }
    } else {
        return {
            status: 'em-dia',
            classe: 'status-em-dia',
            icone: 'fas fa-check-circle',
            texto: 'Em dia'
        }
    }
}

// Validação simples dos campos
function validarCampos() {
    const erros = []
    const data = document.getElementById('editDataTroca').value?.trim()
    const proxima = document.getElementById('editProximaTroca').value?.trim()
    const km = document.getElementById('editKmAtual').value?.trim()
    const kmProx = document.getElementById('editKmProxima').value?.trim()
    const oleo = document.getElementById('editTipoOleo').value?.trim()
    
    if (!data) erros.push("Data da Troca é obrigatória")
    if (!proxima) erros.push("Data da Próxima Troca é obrigatória")
    if (!km || Number(km) <= 0) erros.push("KM Atual inválido")
    if (!kmProx || Number(kmProx) <= 0) erros.push("Próximo KM inválido")
    if (!oleo || oleo.length < 2) erros.push("Tipo de Óleo inválido")
    
    return erros
}

//Event Listeners
document.getElementById('selectClienteFiltro').addEventListener('change', async (event) =>{
    const clientId = event.target.value
    if(clientId === "0"){
        const dropDown = document.getElementById('selectVeiculoFiltro')
        dropDown.innerHTML = '<option value="0">Selecionar Veículo do Cliente</option>'
        document.getElementById('listaTrocas').innerHTML = '';
        document.getElementById('totalRegistros').innerHTML = '0'
    }
    else if(clientId){ 
        const dadosCarro = await pegarDadosCarro(clientId)
        document.getElementById('listaTrocas').innerHTML = '';
        document.getElementById('totalRegistros').innerHTML = '0'
        if(!dadosCarro){
            console.log('Erro ao executar função que pega os dados do carro pelo ClientId')
        }
    } 
})

document.getElementById('selectVeiculoFiltro').addEventListener('change', async (event)=>{
    const idCarro = event.target.value
    if(idCarro === "0"){
        document.getElementById('listaTrocas').innerHTML = '';
        document.getElementById('totalRegistros').innerHTML = '0'
    }
    else if(idCarro){
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
    
            sweetalert2.fire({
                title: "Feito!",
                text: "Troca excluída com sucesso!",
                icon: "success"
                });
        } else {
            alert('Erro: ID da troca não encontrado')
            sweetalert2.fire({
                icon: "error",
                title: "Oops...",
                text: "Erro ao excluir Troca!",
            });
        }
    } catch (error) {
        if (error instanceof ApiError) {
            alert(error.userMessage);
        } else {
            alert('Erro inesperado ao excluir troca: ' + error.message);
        }
        console.error('Erro ao excluir troca:', error)
    }
})

// Event listener para salvar edição no modal
document.getElementById('salvarEdicao').addEventListener('click', async () => {
    const btn = document.getElementById('salvarEdicao')
    try {
        const ctx = window.trocaParaEditar || {}
        const idCarro = ctx.idCarro || document.getElementById('selectVeiculoFiltro')?.value
        if (!idCarro) {
            alert('Selecione um veículo antes de editar.')
            return
        }
        const idTroca = ctx.idTroca
        const oleoDataFormat = document.getElementById('editDataTroca').value
        const oleoDataPformat = document.getElementById('editProximaTroca').value
        
        // Validar campos
        const erros = validarCampos()
        if (erros.length > 0) {
            sweetalert2.fire({
                icon: 'error',
                title: 'Dados Inválidos',
                html: erros.map(e => `• ${e}`).join('<br>'),
                confirmButtonText: 'OK'
            })
            return
        }
        
        const oleoDataTroca = formatarParaISO8601(oleoDataFormat)
        const oleoDataProximaTroca = formatarParaISO8601(oleoDataPformat)
        const kmTroca = Number(document.getElementById('editKmAtual').value)
        const KmProximaTroca = Number(document.getElementById('editKmProxima').value)
        const tipoOleo = document.getElementById('editTipoOleo').value?.trim()

        btn.disabled = true
        await editarTrocaOleo({ idTroca, oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo})

        // Fechar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalEditar'))
        modal?.hide()

        // Atualizar lista
        await pegarDadosTrocaOleo(idCarro)

        // Limpar contexto
        window.trocaParaEditar = null
        
        sweetalert2.fire({
            title: "Sucesso!",
            text: "Troca atualizada com sucesso!",
            icon: "success"
        })
    } catch (error) {
        if (error instanceof ApiError) {
            alert(error.userMessage)
        } else {
            alert('Erro ao salvar edição: ' + error.message)
        }
        console.error('Erro ao editar troca:', error)
    } finally {
        btn.disabled = false
    }
})

window.addEventListener('DOMContentLoaded', async ()=>{
    await pegarDadosClientes()
})
