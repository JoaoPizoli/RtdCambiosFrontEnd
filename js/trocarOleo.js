  // Funções para navegação entre formulários
    function mostrarForm(tipo) {
        document.getElementById('formCliente').style.display = tipo === 'cliente' ? 'block' : 'none';
        document.getElementById('formServico').style.display = tipo === 'servico' ? 'block' : 'none';
        
        // Limpar informações do cliente quando voltar para seleção
        if (tipo === 'cliente') {
            document.getElementById('clienteInfo').style.display = 'none';
            // Desabilitar o botão de registrar serviço quando voltar para seleção
            desabilitarBotaoRegistrarServico();
            // Resetar os selects
            document.getElementById('selectCliente').value = '';
            document.getElementById('selectVeiculo').value = '';
            document.getElementById('selectVeiculo').disabled = true;
            document.getElementById('selectVeiculo').innerHTML = '<option value="">Selecione o Veículo</option>';
        }
    }

    // Função para habilitar o botão de registrar serviço
    function habilitarBotaoRegistrarServico() {
        const btnRegistrarServico = document.getElementById('btnRegistrarServico');
        btnRegistrarServico.disabled = false;
        btnRegistrarServico.style.opacity = '1';
        btnRegistrarServico.style.cursor = 'pointer';
    }

    // Função para desabilitar o botão de registrar serviço
    function desabilitarBotaoRegistrarServico() {
        const btnRegistrarServico = document.getElementById('btnRegistrarServico');
        btnRegistrarServico.disabled = true;
        btnRegistrarServico.style.opacity = '0.5';
        btnRegistrarServico.style.cursor = 'not-allowed';
    }

    // Função específica para mostrar o formulário de serviço (só funciona se estiver habilitado)
    function mostrarFormServico() {
        const selectCliente = document.getElementById('selectCliente');
        const selectVeiculo = document.getElementById('selectVeiculo');
        
        // Verificar se cliente e veículo estão selecionados
        if (!selectCliente.value || !selectVeiculo.value) {
            alert('Você precisa selecionar um cliente e veículo primeiro.');
            mostrarForm('cliente');
            return;
        }
        
        // Mostrar o formulário de serviço
        mostrarInfoCliente();
        mostrarForm('servico');
    }

    // Mostrar informações do cliente/veículo no formulário de serviço
    function mostrarInfoCliente() {
        const selectCliente = document.getElementById('selectCliente');
        const selectVeiculo = document.getElementById('selectVeiculo');
        
        if (selectCliente.value && selectVeiculo.value) {
            const clienteNome = selectCliente.options[selectCliente.selectedIndex].textContent;
            const veiculoOption = selectVeiculo.options[selectVeiculo.selectedIndex];
            
            document.getElementById('nomeCliente').textContent = clienteNome;
            document.getElementById('modeloVeiculo').textContent = veiculoOption.dataset.modelo;
            document.getElementById('placaVeiculo').textContent = veiculoOption.dataset.placa;
            document.getElementById('hiddenClienteId').value = selectCliente.value;
            document.getElementById('hiddenVeiculoId').value = selectVeiculo.value;
            document.getElementById('clienteInfo').style.display = 'block';
            
            // Definir data atual como padrão para a data da troca
            const hoje = new Date().toISOString().split('T')[0];
            document.getElementById('dataTroca').value = hoje;
        }
    }

    // Função para validar e continuar para o formulário de serviço
    function continuarParaServico() {
        const selectCliente = document.getElementById('selectCliente');
        const selectVeiculo = document.getElementById('selectVeiculo');
        
        // Validar se cliente foi selecionado
        if (!selectCliente.value) {
            alert('Por favor, selecione um cliente.');
            selectCliente.focus();
            return;
        }
        
        // Validar se veículo foi selecionado
        if (!selectVeiculo.value) {
            alert('Por favor, selecione um veículo.');
            selectVeiculo.focus();
            return;
        }
        
        // Se tudo estiver válido, ir direto para o formulário de serviço
        mostrarInfoCliente();
        habilitarBotaoRegistrarServico();
        mostrarFormServico(); // ✅ Chama automaticamente!

    }

    // Inicialização da página
    document.addEventListener('DOMContentLoaded', function() {
        // Inicializar o botão como desabilitado
        desabilitarBotaoRegistrarServico();
        
        // Calcular automaticamente a próxima quilometragem (5000km a mais)
        const kmAtualInput = document.getElementById('kmAtual');
        const kmProximaInput = document.getElementById('kmProxima');
        
        if (kmAtualInput && kmProximaInput) {
            kmAtualInput.addEventListener('input', function() {
                const kmAtual = parseInt(this.value) || 0;
                if (kmAtual > 0) {
                    kmProximaInput.value = kmAtual + 5000;
                }
            });
        }
    });


// Funções para Comunicação com o Banco de Dados

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



//Envia os dados para o Registro de Troca de Óleo
const formOleo = document.getElementById('formTrocaOleo')
formOleo.addEventListener('submit',async (event)=>{
    event.preventDefault()

    const formData = new FormData(formOleo)
    const dados = {}

    for(let [chave,valor] of formData.entries()){
        dados[chave] = valor
    }

    console.log(dados)

    // Converter datas para formato ISO-8601
    const oleoDataTroca = new Date(dados.oleoDataTroca).toISOString();
    const oleoDataProximaTroca = new Date(dados.oleoDataProximaTroca).toISOString();
    const btnSubmit = formOleo.querySelector('button[type="submit"]')
    btnSubmit.textContent = 'Enviando ...'
    btnSubmit.disabled = true
    
    const token = localStorage.getItem('token')
    try {
        const response = await fetch('http://172.16.5.57:3000/oleo/registrar',{
            method:'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                oleoDataTroca: oleoDataTroca,
                oleoDataProximaTroca: oleoDataProximaTroca,
                kmTroca: parseInt(dados.kmTroca),
                KmProximaTroca: parseInt(dados.KmProximaTroca),
                tipoOleo: dados.tipoOleo,
                carroId: dados.carroId,
            })
        })
        if(response.ok){
            btnSubmit.textContent = 'Registrar Troca de Óleo'
            btnSubmit.disabled = false
        } else{
            const error = await response.json();
            alert('Erro ao cadastrar veículo: ' + (error.message || 'Erro desconhecido'));
            btnSubmit.textContent = 'Registrar Troca de Óleo'
            btnSubmit.disabled = false
        }

    } catch (error) {
        console.log(`Erro ao registrar troca de óleo: ${error.message}`)
    }

})



document.addEventListener('DOMContentLoaded', async () => {
    await carregarDadosClientes();  
});


// Event listener para carregar carros do cliente selecionado
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
