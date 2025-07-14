export async function login(email: string, password: string) {
    const response = await fetch('http://localhost:5203/api/Authentication/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur serveur');
    }

    const data = await response.json();
    return data;
}
