const form = document.getElementById('formLogin')

form.addEventListener('submit',(event)=>{
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

    fetch('http://172.16.5.57:3000/admin/login',{
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: JSON.stringify({
            email: dados.email,
            password: dados.password
        })
    })
    .then(res => {
        if (!res.ok) {
            throw new Error(`Erro ${res.status}: ${res.statusText}`);
        }
        return res.json();
    })
    .then(data => {
        localStorage.setItem('token', data.token);
        console.log('Sucesso:', data);
        window.location.href ='painel.html'
        form.reset(); 
    })
    .catch(err => {
        console.error('Erro:', err);
        alert('Erro ao fazer login: ' + err.message);
    })
    .finally(() => {
        btnSubmit.textContent = textoOriginal;
        btnSubmit.disabled = false;
    });
})