export async function getSessions() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5203/api/Session', {
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

export async function getSessionById(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5203/api/Session/${id}`, {
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
        throw new Error(`Erreur ${response.status} : ${response.statusText}`);
    }

    return await response.json();
}

export async function updateSession(id: string, sessionData: any) {
    const token = localStorage.getItem('token');

    const payload = {
        ...sessionData,
        sessionModeId: sessionData.sessionMode?.id || sessionData.sessionModeId,
        sessionMode: undefined,
        dateStart: new Date(sessionData.dateStart).toISOString(),
        dateEnd: new Date(sessionData.dateEnd).toISOString(),
    };

    const response = await fetch(`http://localhost:5203/api/Session/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data?.message || `Erreur ${response.status} : ${response.statusText}`);
    }

    return data;
}


export async function deleteSession(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5203/api/Session/${id}`, {
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