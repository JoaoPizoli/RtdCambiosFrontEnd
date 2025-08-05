async function carregarDadosClientes(){
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/clientes/listar',{
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        const data = await response.json()
        const selectCliente = document.getElementById('selectCliente')
        selectCliente.innerHTML = '<option value="">Selecione o Cliente</option>'
        data.forEach(cliente =>{
            const option = document.createElement('option')
            option.value = cliente.id
            option.textContent = cliente.nome
            selectCliente.appendChild(option)
        })
        return data
    } catch (error) {
        console.log(`Erro ao listar os clientes ${error.message}`)
    }
    
}

async function carregarDadosCarros(dadosCliente){
    const token = localStorage.getItem('token')
    const { id } = dadosCliente 
    try {
        const response = await fetch('http://172.16.5.57:3000/carros/cliente',{
            method: 'POST',
            headers: {
                'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                clienteId: id
            })
        })

        if(!response.ok){
            throw new Error(`Erro ${response.status}: ${response.statusText}`);
        }
        const data = await response.json()
        const selectCarro = document.getElementById('selectVeiculo')
        selectCarro.innerHTML = '<option value="">Selecione o Veículo</option>'
        data.forEach(carro =>{
            const option = document.createElement('option')
            option.value = carro.id
            option.textContent = 'Modelo: ' + '' + carro.modelo + ' ' + '|' + ' ' + 'Placa: ' + carro.placa 
            option.dataset.modelo = carro.modelo
            option.dataset.placa = carro.placa
            selectCarro.appendChild(option)
        })
    } catch (error) {
        console.log(`Erro ao listar os veículos: ${error.message}`)
    }
}




const formOleo = document.getElementById('formTrocaOleo')

formOleo.addEventListener('submit',async (event)=>{
    event.preventDefault()

    const formData = new FormData(formOleo)

})



document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosClientes();  
});

document.getElementById('selectCliente').addEventListener('change', async (event) => {
    const clienteId = event.target.value;
    
    if (clienteId) {
        const selectVeiculo = document.getElementById('selectVeiculo');
        selectVeiculo.disabled = false;
        await carregarDadosCarros({ id: clienteId });
    } else {
        document.getElementById('selectVeiculo').disabled = true;
    }
});