// FUNÇÃO PARA CORRIGIR AUTOFILL
export function corrigirAutofill() {
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

export function aplicarEstiloCustomizado(input) {
    input.style.setProperty('background-color', 'rgba(255, 255, 255, 0.05)', 'important');
    input.style.setProperty('background-image', 'none', 'important');
    input.style.setProperty('color', '#edf0f1', 'important');
    input.style.setProperty('border', '1px solid rgba(255, 255, 255, 0.2)', 'important');
    input.style.setProperty('border-radius', '10px', 'important');
    input.style.setProperty('-webkit-box-shadow', 'none', 'important');
    input.style.setProperty('box-shadow', 'none', 'important');
    input.style.setProperty('-webkit-text-fill-color', '#edf0f1', 'important');
}

export function adicionarCSSDetecaoAutofill() {
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