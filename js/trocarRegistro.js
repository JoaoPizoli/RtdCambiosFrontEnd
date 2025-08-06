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
        console.log(data)
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
        console.log(data)
        return data
    } catch (error) {
        console.log(`Erro ao listar Clientes: ${error.message}`)
    }
}

async function pegarDadosTrocaOleo(data){
    const idCarro = data.carroId
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/oleo/listar',{
        method: 'POST',
        headers:{
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
         },
        body: JSON.stringify({
            carroId: idCarro
         })
        })
        if(!response){
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }

        const dados = await response.json()
        const loadData = await carregarDadosTela(dados)

        if(!loadData){
            console.log('Erro ao carregar os dados na tela')
        }

    } catch (error) {
        console.log(`Erro ao carregar os dados de troca de óleo: ${error.message}`)
    }
}




async function carregarDadosTela(dados){
    const data = dados
    const lista = document.getElementById('listaTrocas')
    data.forEach( trocas =>{
        const card = document.createElement('div')
        card.innerHTML = `
            <div class="troca-card" data-id="${trocas.id}">
                <div class="troca-card-header">
                    <div class="cliente-info">
                        <h5><i class="fas fa-user me-2"></i>${trocas.carro.cliente.nome}</h5>
                        <p class="veiculo-info">
                            <i class="fas fa-car me-1"></i>
                            <strong>${trocas.carro.modelo}</strong> - <span class="placa">${trocas.carro.placa}</span>
                        </p>
                    </div>
                    <div class="acoes">
                        <button class="btn btn-sm btn-outline-warning me-2" onclick="editarTroca(${trocas.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger" onclick="excluirTroca(${trocas.id})">
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
                                    <p class="mb-0">${trocas.oleoDataTroca}</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="data-info">
                                <i class="fas fa-calendar-plus text-warning me-2"></i>
                                <div>
                                    <strong>Próxima Troca:</strong>
                                    <p class="mb-0">${trocas.oleoDataProximaTroca}</p>
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
                                    <p class="mb-0">${trocas.kmTroca} km</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-info">
                                <i class="fas fa-road text-info me-2"></i>
                                <div>
                                    <strong>Próximo Km:</strong>
                                    <p class="mb-0">${trocas.KmProximaTroca} km</p>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-4">
                            <div class="data-info">
                                <i class="fas fa-oil-can text-primary me-2"></i>
                                <div>
                                    <strong>Tipo de Óleo:</strong>
                                    <p class="mb-0">${trocas.tipoOleo}</p>
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
    })

}



//Event Listeners

document.getElementById('selectClienteFiltro').addEventListener('change', async (event) =>{
    const clientId = event.target.value
    if(clientId){
        await pegarDadosTrocaOleo(clientId)
    } else {
        document.getElementById('listaTrocas').innerHTML = '';
    }
})



window.addEventListener('DOMContentLoaded', async ()=>{
    const token = localStorage.getItem('token');
    if (!token) {
        alert('Você precisa fazer login para acessar esta página.');
        window.location.href = 'login.html';
        return;
    }
    console.log('Token verificado na inicialização da página');
    await pegarDadosClientes()

})
