export function formatarDataBrasileira(dataISO){
    const data = new Date(dataISO)
    const dia = String(data.getDate()).padStart(2,'0')
    const mes = String(data.getMonth() + 1).padStart(2, '0'); 
    const ano = data.getFullYear();

    return `${dia}/${mes}/${ano}`;
}

export function formatarParaISO8601(data) {
    // Se receber uma string, converte para Date
    if (typeof data === 'string') {
        data = new Date(data);
    }
    
    // Se receber um objeto Date, usa toISOString()
    if (data instanceof Date) {
        return data.toISOString();
    }
    
    // Se receber null/undefined, usa a data atual
    if (!data) {
        return new Date().toISOString();
    }
    
    // Fallback: tenta converter para Date
    return new Date(data).toISOString();
}

