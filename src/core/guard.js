import { isAuthenticated } from "./auth";

export function ensureAuth(redirect = 'login.html'){
    if(!isAuthenticated()){
        window.location.href = redirect
        return false
    }
    return true 
}