import { apiCall } from "../core/apiClient";


export async function registrarCliente({nome, email, telefone}){
    return apiCall('/clientes/registrar',{
            method: 'POST',
            body: {nome, email, telefone}
        }
    )
}

export async function listarClientes(){
    return apiCall('/clientes/listar')
}


export async function deletarCliente({ idCliente }) {
    return apiCall('/clientes/deletar', {
        method: 'DELETE',
        body: { idCliente }
    })
}


export async function editarCliente({ nome, email, telefone, idCliente }){
    return apiCall('/clientes/update',{
        method: 'PATCH',
        body: { nome, email, telefone, idCliente }
    })
}
