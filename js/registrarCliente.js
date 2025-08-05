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