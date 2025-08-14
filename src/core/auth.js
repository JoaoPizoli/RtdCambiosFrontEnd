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

export async function login(email, password){
    try {
        const login = await apiCall('/admin/login', {method:'POST', body: {
            email: email,
            password: password
        }})
        if(login.token){
            setToken(login.token)
            window.location.href ='painel.html'
        }
    } catch (error) {
        console.log(error.message)
    }
}