import { apiCall } from './apiClient.js'

const TOKEN_KEY = 'token'

export function setToken(token){
    if(!token){
        throw new Error('Token inválido (valor vazio)!')
    }
    localStorage.setItem(TOKEN_KEY,token)
}

export function getToken(){
    const token = localStorage.getItem(TOKEN_KEY)
    if(!token){
        return null
    }
    return token
}

export function isAuthenticated(){
    return !!getToken()
}

export function clearToken(){
    localStorage.removeItem(TOKEN_KEY)
}

export async function logout({ redirect = 'login.html'} = {}){
    try {
        await apiCall('/admin/logout', {method:'POST'})
    } catch (error) {
        
    } finally {
        clearToken()
        if(redirect) window.location.href = redirect
    }
}