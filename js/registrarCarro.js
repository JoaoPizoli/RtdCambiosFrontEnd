// FUNÇÃO PARA CORRIGIR AUTOFILL
function corrigirAutofill() {
    setTimeout(() => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], input[type="password"]');
        
        inputs.forEach(input => {
            // Método 1: Força o estilo quando detecta autofill
            input.addEventListener('animationstart', function(e) {
                if (e.animationName === 'onAutoFillStart') {
                    aplicarEstiloCustomizado(this);
                }
            });

            // Método 2: Observa mudanças no valor
            const observer = new MutationObserver(() => {
                if (input.matches(':-webkit-autofill')) {
                    aplicarEstiloCustomizado(input);
                }
            });

            observer.observe(input, {
                attributes: true,
                attributeFilter: ['value']
            });

            // Método 3: Verifica periodicamente
            setInterval(() => {
                if (input.matches(':-webkit-autofill')) {
                    aplicarEstiloCustomizado(input);
                }
            }, 100);

            // Método 4: Eventos de input
            input.addEventListener('input', function() {
                if (this.matches(':-webkit-autofill')) {
                    aplicarEstiloCustomizado(this);
                }
            });

            // Método 5: Força aplicação após um delay
            setTimeout(() => {
                if (input.matches(':-webkit-autofill')) {
                    aplicarEstiloCustomizado(input);
                }
            }, 500);
        });
    }, 100);
}

function aplicarEstiloCustomizado(input) {
    input.style.setProperty('background-color', 'rgba(255, 255, 255, 0.05)', 'important');
    input.style.setProperty('background-image', 'none', 'important');
    input.style.setProperty('color', '#edf0f1', 'important');
    input.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
    input.style.setProperty('border-radius', '10px', 'important');
    input.style.setProperty('-webkit-box-shadow', 'none', 'important');
    input.style.setProperty('box-shadow', 'none', 'important');
    input.style.setProperty('-webkit-text-fill-color', '#edf0f1', 'important');
}

function adicionarCSSDetecaoAutofill() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes onAutoFillStart {
            from { opacity: 1; }
            to { opacity: 1; }
        }
        
        input:-webkit-autofill {
            animation-name: onAutoFillStart;
            animation-duration: 0.001s;
        }
        
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
        input:-webkit-autofill:active {
            -webkit-box-shadow: 0 0 0 1000px rgba(255, 255, 255, 0.05) inset !important;
            -webkit-text-fill-color: #edf0f1 !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 10px !important;
            background-color: transparent !important;
            transition: background-color 50000s ease-in-out 0s !important;
        }
    `;
    document.head.appendChild(style);
}

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