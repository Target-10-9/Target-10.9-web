export async function getWeapons() {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:5203/api/WeaponDetail', {
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