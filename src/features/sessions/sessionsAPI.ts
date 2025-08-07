export async function getSessions() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5203/api/Session', {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    const data = await response.json();
    return data;
}

export async function createSession(sessionData: any) {
    const token = localStorage.getItem('token');
    const payload = {
        ...sessionData,
        dateStart: new Date(sessionData.dateStart).toISOString(),
        dateEnd: new Date(sessionData.dateEnd).toISOString(),
    };

    const response = await fetch('http://localhost:5203/api/Session', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error("API error:", errorText);
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return await response.json();
}
