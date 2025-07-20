export async function login(email: string, password: string) {
    const response = await fetch('http://localhost:5203/api/Authentication/login', {
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
