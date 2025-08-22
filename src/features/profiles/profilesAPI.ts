import {API_BASE} from "../../lib/api.ts";

export async function getUser(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/User/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function updateUser(id: string, userData: any) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/User/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return await response.json();
}

export async function deleteUser(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/User/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return true;
}