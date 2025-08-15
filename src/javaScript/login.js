import { corrigirAutofill, adicionarCSSDetecaoAutofill } from "../utils/autofillFix.js"
import { login } from "../core/auth.js"
import { handleError } from "../core/erroHandler.js"

const form = document.getElementById('formLogin')

form.addEventListener('submit',async (event)=>{
    event.preventDefault()

    const formData = new FormData(form)

    const dados = {}
    for(let [chave, valor] of formData.entries()){
        dados[chave] = valor
    }

    if (!dados.email || !dados.password) {
        alert('Por favor, preencha todos os campos!');
        return;
    }
    
    try {
        await login(dados.email, dados.password)
    } catch (error) {
        alert(handleError(error, 'Erro ao fazer login'));
    }
})




document.addEventListener('DOMContentLoaded', async () => {
    adicionarCSSDetecaoAutofill();
    corrigirAutofill(); 
});
