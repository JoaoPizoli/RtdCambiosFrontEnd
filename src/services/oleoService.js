import { apiCall } from "../core/apiClient";

export async function registrarTrocaOleo({ oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo,  carroId }){
    return apiCall('/oleo/registrar', {
        method: 'POST',
        body: { oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo,  carroId }
    })
}

export async function deletarTrocarOleo(idTrocaOleo){
    return apiCall('/oleo/deletar', {
        method: 'DELETE',
        body: { idTrocaOleo }
    })
}

export async function listarTrocasOleo(idCarro){
    return apiCall('/oleo/listar', {
        method: 'POST',
        body: { idCarro }
    })
}

export async function editarTrocaOleo({ oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo, idCarro }){
    return apiCall('/oleo/update',{
        method: 'PATCH',
        body:{ oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo, idCarro }
    })
}
