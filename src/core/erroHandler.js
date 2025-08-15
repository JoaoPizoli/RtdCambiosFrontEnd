export class ApiError extends Error {
    constructor(code, message) {
        super(message)
        this.name = 'ApiError'
        this.code = code
        
        const codeMessagesMap = {
            'network': 'Erro de conexão com o servidor',
            'auth': 'Erro de autenticação',
            'validation': 'Dados inválidos',
            'server': 'Erro interno do servidor',
            'not_found': 'Recurso não encontrado',
            'requisicao': 'Erro ao fazer requisição ao BackEnd'
        }
        
        this.userMessage = codeMessagesMap[code] || 'Erro inesperado'
    }
}

export class ValidationError extends Error {
    constructor(field, message) {
        super(message)
        this.name = 'ValidationError'
        this.field = field
        this.userMessage = `${field}: ${message}`
    }
}


export function handleError(error, defaultMessage = 'Ocorreu um erro') {
    if (error instanceof ApiError || error instanceof ValidationError) {
        return error.userMessage
    }
    return defaultMessage
}

// Função para criar erro baseado no status HTTP
export function createErrorFromStatus(status, message) {
    switch (status) {
        case 400:
            return new ApiError('validation', message || 'Dados inválidos')
        case 401:
            return new ApiError('auth', message || 'Acesso não autorizado')
        case 404:
            return new ApiError('not_found', message || 'Recurso não encontrado')
        case 500:
            return new ApiError('server', message || 'Erro interno do servidor')
        default:
            return new ApiError('requisicao', message || 'Erro na requisição')
    }
}

export const validators = {
    required: (value, fieldName) => {
        if (!value || value.toString().trim() === '') {
            throw new ValidationError(fieldName, 'Campo obrigatório')
        }
    },
    
    email: (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            throw new ValidationError('Email', 'Formato inválido')
        }
    },
    
    phone: (phone) => {
        const phoneRegex = /^\d{10,11}$/
        if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
            throw new ValidationError('Telefone', 'Formato inválido')
        }
    }
}

