import { apiCall } from "../core/apiClient.js";

export async function registrarTrocaOleo({ oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo,  carroId }){
    return apiCall('/oleo/registrar', {
        method: 'POST',
        body: { oleoDataTroca: oleoDataTroca, oleoDataProximaTroca: oleoDataProximaTroca, kmTroca: kmTroca, KmProximaTroca: KmProximaTroca, tipoOleo: tipoOleo,  carroId: carroId }
    })
}

export async function deletarTrocarOleo(idTrocaOleo){
    return apiCall('/oleo/deletar', {
        method: 'DELETE',
        body: { id: idTrocaOleo }
    })
}

export async function listarTrocasOleo(idCarro){
    return apiCall('/oleo/listar', {
        method: 'POST',
        body: { idCarro: idCarro }
    })
}

export async function editarTrocaOleo({ oleoDataTroca, oleoDataProximaTroca, kmTroca, KmProximaTroca, tipoOleo, idCarro }){
    return apiCall('/oleo/update',{
        method: 'PATCH',
        body:{ oleoDataTroca: oleoDataTroca, oleoDataProximaTroca: oleoDataProximaTroca, kmTroca: kmTroca, KmProximaTroca: KmProximaTroca, tipoOleo: tipoOleo, idCarro: idCarro }
    })
}
