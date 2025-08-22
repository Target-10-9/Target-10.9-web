import {API_BASE} from "../../lib/api.ts";

export async function getSessionModes() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/SessionMode`, {
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
export const addWeaponToSessionMode = async (sessionModeId: string, payload: { weaponDetailId: string }) => {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/SessionMode/${sessionModeId}/weapons`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return null;
};

export async function deleteWeaponFromSessionMode(sessionModeId: string, weaponId: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/SessionMode/${sessionModeId}/weapons/${weaponId}`, {
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