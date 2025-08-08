import { apiCall } from "../core/apiClient";


export async function cadastrarCarro({ placa, modelo, clienteId}){
    return apiCall('/carros/cadastrar',{
        method: 'POST',
        body: { placa, modelo, clienteId }
    })
}

export async function listarPorCliente({ clienteId }){
    return apiCall('/carros/cliente', {
        method: 'POST',
        body: { clienteId }
    })
}

export async function deletarCarro({ carroId }){
    return apiCall('/carros/deletar',{
        method: 'DELETE',
        body: { carroId }
    })
}

 export async function editarCarro({ placa, modelo, id }){
    return apiCall('/carros/update',{
        method:'PATCH',
        body: { placa, modelo, id }
    })
}

