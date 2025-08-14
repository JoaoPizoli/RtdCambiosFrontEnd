import { apiCall } from "../core/apiClient.js";


export async function registrarCliente({nome, email, telefone}){
    return await apiCall('/clientes/registrar',{
            method: 'POST',
            body: {nome: nome, email: email, telefone: telefone}
        }
    )
}

export async function listarClientes(){
    return await apiCall('/clientes/listar')
}


export async function deletarCliente({ idCliente }) {
    return await apiCall('/clientes/deletar', {
        method: 'DELETE',
        body: { idCliente: idCliente }
    })
}


export async function editarCliente({ nome, email, telefone, idCliente }){
    return await apiCall('/clientes/update',{
        method: 'PATCH',
        body: { nome: nome, email: email, telefone: telefone, idCliente: idCliente }
    })
}
