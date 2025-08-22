import {API_BASE} from "../../lib/api.ts";

export async function login(email: string, password: string) {
    const response = await fetch(`${API_BASE}/Authentication/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}

export async function register(user: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    licenseNumber: string;
}) {
    const response = await fetch(`${API_BASE}/Authentication/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
    });

    const data = await response.json();

    if (!response.ok) {
        throw data;
    }

    return data;
}
