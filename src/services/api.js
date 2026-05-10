const API_URL = import.meta.env.VITE_API_URL;

export async function login({email, password}) {
    try {
        const response = await fetch(`${API_URL}/api/Auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        console.log(email, password);
        const data = await response.json();
        
        console.log('ERRO BACKEND:', data);
        if (!response.ok) {
            if (data.message?.toLowerCase().includes("not found")) {
                throw new Error("Usuário não cadastrado");
            }

            if (data.message?.toLowerCase().includes("invalid")) {
                throw new Error("Email ou Senha inválidos");
            }

            throw new Error(data.message || JSON.stringify(data) || "Erro ao fazer login");
        }
        localStorage.setItem('token', data.token);

        return data;
    } catch (error) {        
        console.error('Error logging in:', error);
        throw error;
    }
}

export async function register({
    name, 
    surname, 
    email, 
    password
}) 
{
    try {
        const response = await fetch(`${API_URL}/api/Auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, surname, email, password })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erro ao registrar");
        }
        return data;
    } catch (error) {
        console.error('Error registering:', error);
        throw error;
    }
}

export function logout() {
    localStorage.removeItem('token');
}

export function getToken() {
    return localStorage.getItem('token');
}

export async function resetPassword(email) {
    try {
        const response = await fetch(`${API_URL}/api/Auth/reset-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Erro ao redefinir a senha");
        }
        return data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
}

export async function fetchWithAuth(url, options = {}) {
    const token = getToken();
    return fetch(`${API_URL}${url}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            ...options.headers
        }
    });
}