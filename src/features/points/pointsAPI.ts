import {API_BASE} from "../../lib/api.ts";

export async function addPoint(point: {
    x_Coordinate: number;
    y_Coordinate: number;
    dateTimePoint: string;
    sessionId: string;
}) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/Point`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(point),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur API: ${response.status} ${errorText}`);
    }

    return response.json();
}

export async function getPoints() {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/Point`, {
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

export async function getPointsBySessionId(sessionId: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`${API_BASE}/Point/${sessionId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    if (!response.ok) {
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }
    const data = await response.json();
    return data;
}