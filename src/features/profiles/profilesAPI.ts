export async function getUser(id: string) {
    const token = localStorage.getItem('token');

    const response = await fetch(`http://localhost:5203/api/User/${id}`, {
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

    const response = await fetch(`http://localhost:5203/api/User/${id}`, {
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

    const response = await fetch(`http://localhost:5203/api/User/${id}`, {
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