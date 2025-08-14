import { apiCall } from "../core/apiClient.js";


export async function cadastrarCarro({ placa, modelo, clienteId}){
    return apiCall('/carros/cadastrar',{
        method: 'POST',
        body: { placa: placa, modelo: modelo, clienteId: clienteId }
    })
}

export async function listarPorCliente({ clienteId }){
    return apiCall('/carros/cliente', {
        method: 'POST',
        body: { clienteId: clienteId }
    })
}

export async function deletarCarro({ carroId }){
    return apiCall('/carros/deletar',{
        method: 'DELETE',
        body: { carroId: carroId }
    })
}

 export async function editarCarro({ placa, modelo, id }){
    return apiCall('/carros/update',{
        method:'PATCH',
        body: { placa: placa, modelo: modelo, id: id }
    })
}

