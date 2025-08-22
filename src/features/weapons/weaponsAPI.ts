import {API_BASE} from "../../lib/api.ts";

export async function getWeapons() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/WeaponDetail`, {
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

export async function createWeaponDetail(weaponData: any) {
    const token = localStorage.getItem('token');
    const payload = {
        ...weaponData
    };

    const response = await fetch(`${API_BASE}/WeaponDetail`, {
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

    return await response.json();
}

export async function updateWeaponDetail(id: string, weaponData: any) {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_BASE}/WeaponDetail/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(weaponData),
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return await response.json();
}

export async function deleteWeaponDetail(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/WeaponDetail/${id}`, {
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